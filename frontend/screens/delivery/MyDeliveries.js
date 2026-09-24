import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, RefreshControl, Alert, Linking } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getMyDeliveries, markDelivered } from '../../api/deliveryApi';
import { useTheme } from '../../context/ThemeContext';

const MyDeliveries = () => {
  const { theme } = useTheme();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [markingId, setMarkingId] = useState(null);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await getMyDeliveries();
      setOrders(data);
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadOrders();
    }, [])
  );

  const handleMarkDelivered = (orderId) => {
    Alert.alert('Confirm', 'हा order delivered झाला याची खात्री आहे का?', [
      { text: 'नाही', style: 'cancel' },
      {
        text: 'हो, झाला',
        onPress: async () => {
          setMarkingId(orderId);
          try {
            await markDelivered(orderId);
            loadOrders();
          } catch (err) {
            Alert.alert('Error', err.message);
          } finally {
            setMarkingId(null);
          }
        },
      },
    ]);
  };

  const callCustomer = (mobile) => {
    if (mobile) Linking.openURL(`tel:${mobile}`);
  };

  const renderItem = ({ item }) => {
    const isDelivered = item.deliveryStatus === 'delivered';

    return (
      <View style={[styles.card, { backgroundColor: theme.inputBackground }]}>
        <Text style={[styles.orderId, { color: theme.text }]}>
          Order #{item._id.slice(-6).toUpperCase()}
        </Text>
        <Text style={{ color: theme.text }}>
          {item.shippingAddress?.fullName}
        </Text>
        <TouchableOpacity onPress={() => callCustomer(item.shippingAddress?.mobile)}>
          <Text style={{ color: theme.primary, marginBottom: 4 }}>
            📞 {item.shippingAddress?.mobile}
          </Text>
        </TouchableOpacity>
        <Text style={{ color: theme.text }}>
          {item.shippingAddress?.addressLine}, {item.shippingAddress?.city} - {item.shippingAddress?.pincode}
        </Text>
        <Text style={{ color: theme.text, marginBottom: 8 }}>
          Total: ₹{item.totalAmount} {item.paymentStatus === 'pending' ? '(COD)' : '(Paid)'}
        </Text>

        {isDelivered ? (
          <Text style={{ color: 'green', fontWeight: 'bold' }}>✅ Delivered</Text>
        ) : (
          <TouchableOpacity
            style={[styles.deliverBtn, { backgroundColor: theme.primary }]}
            onPress={() => handleMarkDelivered(item._id)}
            disabled={markingId === item._id}
          >
            <Text style={styles.deliverBtnText}>
              {markingId === item._id ? 'Update होत आहे...' : 'Delivered म्हणून mark करा'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

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
              अजून कुठलाही order accept केलेला नाही
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
  deliverBtn: {
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  deliverBtnText: { color: '#fff', fontWeight: 'bold' },
});

export default MyDeliveries;