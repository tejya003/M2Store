import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, RefreshControl, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getAvailableOrders, acceptOrder } from '../../api/deliveryApi';
import { useTheme } from '../../context/ThemeContext';

const AvailableOrders = () => {
  const { theme } = useTheme();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [acceptingId, setAcceptingId] = useState(null);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await getAvailableOrders();
      setOrders(data);
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  // जेव्हा हा screen परत उघडेल तेव्हा list refresh कर
  useFocusEffect(
    useCallback(() => {
      loadOrders();
    }, [])
  );

  const handleAccept = async (orderId) => {
    setAcceptingId(orderId);
    try {
      await acceptOrder(orderId);
      Alert.alert('झालं', 'Order तुमच्याकडे assign झाला');
      loadOrders(); // यादी परत लोड कर, accept केलेला order यादीतून जाईल
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setAcceptingId(null);
    }
  };

  const renderItem = ({ item }) => (
    <View style={[styles.card, { backgroundColor: theme.inputBackground }]}>
      <Text style={[styles.orderId, { color: theme.text }]}>
        Order #{item._id.slice(-6).toUpperCase()}
      </Text>
      <Text style={{ color: theme.text }}>
        {item.shippingAddress?.fullName} — {item.shippingAddress?.mobile}
      </Text>
      <Text style={{ color: theme.text }}>
        {item.shippingAddress?.addressLine}, {item.shippingAddress?.city} - {item.shippingAddress?.pincode}
      </Text>
      <Text style={{ color: theme.text, marginBottom: 8 }}>
        Total: ₹{item.totalAmount}
      </Text>

      <TouchableOpacity
        style={[styles.acceptBtn, { backgroundColor: theme.primary }]}
        onPress={() => handleAccept(item._id)}
        disabled={acceptingId === item._id}
      >
        <Text style={styles.acceptBtnText}>
          {acceptingId === item._id ? 'घेत आहे...' : 'Accept करा'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <FlatList
        data={orders}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={loadOrders} />}
        ListEmptyComponent={
          !loading && (
            <Text style={{ color: theme.text, textAlign: 'center', marginTop: 40 }}>
              सध्या कुठलाही order उपलब्ध नाही
            </Text>
          )
        }
        contentContainerStyle={{ padding: 12 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  card: {
    padding: 14,
    borderRadius: 8,
    marginBottom: 12,
  },
  orderId: { fontWeight: 'bold', fontSize: 15, marginBottom: 4 },
  acceptBtn: {
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  acceptBtnText: { color: '#fff', fontWeight: 'bold' },
});

export default AvailableOrders;