import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

const OrderTrackingDetails = ({ route: navRoute, navigation }) => {
  const { result } = navRoute.params;
  const order = result.order;

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) +
      ', ' + d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
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
        <View style={[styles.statusBanner, { backgroundColor: result.isFinalDestination ? '#E8F5E9' : '#E3F2FD' }]}>
          {result.isFinalDestination ? (
            <Text style={styles.statusFinalText}>🏠 Final destination reached — send to customer</Text>
          ) : (
            <>
              <Text style={styles.statusText}>Reached: {result.currentOffice}</Text>
              <Text style={styles.statusNextText}>➡️ Send next to: {result.nextOffice}</Text>
            </>
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Customer</Text>
          <Text style={styles.text}>{order.shippingAddress?.fullName} ({order.shippingAddress?.mobile})</Text>
          <Text style={styles.textMuted}>
            {order.shippingAddress?.addressLine}, {order.shippingAddress?.city} - {order.shippingAddress?.pincode}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Items</Text>
          {order.items.map((item, index) => (
            <View key={index} style={styles.itemRow}>
              <Text style={styles.text}>{item.name} × {item.quantity}</Text>
              <Text style={styles.text}>₹{item.price * item.quantity}</Text>
            </View>
          ))}
          <View style={styles.divider} />
          <View style={styles.itemRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>₹{order.totalAmount}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Route</Text>
          <Text style={styles.text}>{order.route?.join(' → ') || 'Not set'}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Scan History</Text>
          {order.scanHistory && order.scanHistory.length > 0 ? (
            order.scanHistory.map((s, index) => (
              <View key={index} style={styles.scanRow}>
                <Text style={styles.scanDot}>●</Text>
                <View>
                  <Text style={styles.text}>{s.office}</Text>
                  <Text style={styles.textMuted}>{formatDate(s.scannedAt)}</Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.textMuted}>No scans yet</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F5F5F7', paddingTop: 40 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, paddingBottom: 10 },
  backText: { fontSize: 16, color: '#7C4DFF', fontWeight: 'bold', marginRight: 15 },
  headerTitle: { fontSize: 16, fontWeight: 'bold', color: '#222' },
  container: { padding: 15 },

  statusBanner: { borderRadius: 12, padding: 16, marginBottom: 15 },
  statusFinalText: { fontSize: 15, fontWeight: 'bold', color: '#43A047' },
  statusText: { fontSize: 13, color: '#444' },
  statusNextText: { fontSize: 18, fontWeight: 'bold', color: '#1E88E5', marginTop: 4 },

  card: { backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 12 },
  sectionTitle: { fontSize: 14, fontWeight: 'bold', color: '#222', marginBottom: 8 },
  text: { color: '#333', fontSize: 13 },
  textMuted: { color: '#888', fontSize: 12, marginTop: 2 },

  itemRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 8 },
  totalLabel: { fontWeight: 'bold', color: '#222' },
  totalValue: { fontWeight: 'bold', color: '#7C4DFF' },

  scanRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 },
  scanDot: { color: '#43A047', marginRight: 8, marginTop: 2 },
});

export default OrderTrackingDetails;