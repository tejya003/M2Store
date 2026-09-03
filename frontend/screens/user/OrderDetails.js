import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

const STATUS_STEPS = ['pending', 'confirmed', 'shipped', 'delivered'];

const STEP_LABELS = {
  pending: 'Order Placed',
  confirmed: 'Confirmed',
  shipped: 'Shipped',
  delivered: 'Delivered',
};

const OrderDetails = ({ route, navigation }) => {
  const { order } = route.params;
  const isCancelled = order.orderStatus === 'cancelled';
  const currentStepIndex = STATUS_STEPS.indexOf(order.orderStatus);

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order #{order._id.slice(-6).toUpperCase()}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Items</Text>
          {order.items.map((item, index) => (
            <View key={index} style={styles.itemRow}>
              <Text style={styles.itemName}>{item.name} × {item.quantity}</Text>
              <Text style={styles.itemPrice}>₹{item.price * item.quantity}</Text>
            </View>
          ))}
          <View style={styles.divider} />
          <View style={styles.itemRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>₹{order.totalAmount}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Delivery Address</Text>
          <Text style={styles.addressName}>
            {order.shippingAddress?.fullName} ({order.shippingAddress?.mobile})
          </Text>
          <Text style={styles.addressText}>
            {order.shippingAddress?.addressLine}, {order.shippingAddress?.city} - {order.shippingAddress?.pincode}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Payment</Text>
          <Text style={styles.addressText}>Status: {order.paymentStatus}</Text>
          <Text style={styles.addressText}>Order Date: {formatDate(order.createdAt)}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Order Status</Text>

          {isCancelled ? (
            <Text style={styles.cancelledText}>❌ This order was cancelled</Text>
          ) : (
            STATUS_STEPS.map((step, index) => (
              <View key={step} style={styles.stepRow}>
                <Text style={[styles.stepIcon, { color: index <= currentStepIndex ? '#43A047' : '#ccc' }]}>
                  {index <= currentStepIndex ? '✓' : '○'}
                </Text>
                <Text style={[styles.stepLabel, { color: index <= currentStepIndex ? '#222' : '#999' }]}>
                  {STEP_LABELS[step]}
                </Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F5F5F7', paddingTop: 40 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, paddingBottom: 10 },
  backText: { fontSize: 16, color: '#6C5CE7', fontWeight: 'bold', marginRight: 15 },
  headerTitle: { fontSize: 16, fontWeight: 'bold', color: '#222' },
  container: { padding: 15 },

  card: { backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 12 },
  sectionTitle: { fontSize: 14, fontWeight: 'bold', color: '#222', marginBottom: 10 },

  itemRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  itemName: { color: '#444', fontSize: 13 },
  itemPrice: { color: '#222', fontWeight: '600', fontSize: 13 },
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 8 },
  totalLabel: { fontWeight: 'bold', color: '#222' },
  totalValue: { fontWeight: 'bold', color: '#6C5CE7' },

  addressName: { fontWeight: '600', color: '#222', marginBottom: 4 },
  addressText: { color: '#666', fontSize: 13, marginBottom: 2 },

  cancelledText: { color: '#E53935', fontWeight: '600' },
  stepRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  stepIcon: { fontSize: 16, fontWeight: 'bold', marginRight: 10, width: 20 },
  stepLabel: { fontSize: 14 },
});

export default OrderDetails;