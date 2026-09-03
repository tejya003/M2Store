import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getMyOrders } from '../../api/orderApi';

const STATUS_TABS = ['All', 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

const STATUS_COLORS = {
  pending: '#F9A825',
  confirmed: '#1E88E5',
  shipped: '#8E24AA',
  delivered: '#43A047',
  cancelled: '#E53935',
};

const MyOrders = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('All');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    try {
      const data = await getMyOrders();
      setOrders(data);
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      loadOrders();
    }, [])
  );

  const filteredOrders =
    activeTab === 'All' ? orders : orders.filter((o) => o.orderStatus === activeTab);

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.orderCard}
      onPress={() => navigation.navigate('OrderDetails', { order: item })}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.orderId}>#{item._id.slice(-6).toUpperCase()}</Text>
        <Text style={styles.orderDate}>{formatDate(item.createdAt)}</Text>
      </View>

      <Text style={styles.productName} numberOfLines={1}>
        {item.items[0]?.name}
        {item.items.length > 1 ? ` + ${item.items.length - 1} more` : ''}
      </Text>

      <View style={styles.statusRow}>
        <View style={[styles.statusDot, { backgroundColor: STATUS_COLORS[item.orderStatus] }]} />
        <Text style={[styles.statusText, { color: STATUS_COLORS[item.orderStatus] }]}>
          {item.orderStatus}
        </Text>
      </View>

      <Text style={styles.totalPrice}>Total: ₹{item.totalAmount}</Text>

      <Text style={styles.viewDetailsText}>View Details ›</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Orders</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsRow}>
        {STATUS_TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tabChip, activeTab === tab && styles.activeTabChip]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {loading ? (
        <ActivityIndicator size="large" color="#6C5CE7" style={{ marginTop: 30 }} />
      ) : filteredOrders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={{ color: '#999', fontSize: 15 }}>No orders found</Text>
        </View>
      ) : (
        <FlatList
          data={filteredOrders}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50, paddingHorizontal: 15, backgroundColor: '#F5F5F7' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 15, color: '#222' },

  tabsRow: { marginBottom: 15, maxHeight: 40 },
  tabChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: '#fff', marginRight: 8, borderWidth: 1, borderColor: '#eee' },
  activeTabChip: { backgroundColor: '#6C5CE7', borderColor: '#6C5CE7' },
  tabText: { fontSize: 12, fontWeight: '600', color: '#555', textTransform: 'capitalize' },
  activeTabText: { color: '#fff' },

  orderCard: { backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 12 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  orderId: { fontSize: 13, fontWeight: 'bold', color: '#6C5CE7' },
  orderDate: { fontSize: 12, color: '#888' },

  productName: { fontSize: 14, fontWeight: '600', color: '#222', marginBottom: 6 },

  statusRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  statusDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  statusText: { fontSize: 12, fontWeight: 'bold', textTransform: 'capitalize' },

  totalPrice: { fontSize: 13, fontWeight: 'bold', color: '#222' },
  viewDetailsText: { color: '#6C5CE7', fontSize: 12, fontWeight: '600', marginTop: 8, textAlign: 'right' },

  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default MyOrders;