import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Linking,
} from 'react-native';

const SHOP_NAME = 'M2 Store';
const SHOP_ADDRESS = 'Mahalaxmi Pride, Rajarampuri lane 6, Takala Side, Kolhapur, Maharashtra, India 416008';

// 👇 तुमचा backend IP + port इथे टाका (BASE_URL सारखाच, पण /api/admin शिवाय)
const SERVER_ROOT = 'http://192.168.1.2:5000';

const Invoice = ({ route, navigation }) => {
  const { order } = route.params;
  const [generating, setGenerating] = useState(false);

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return (
      d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) +
      ', ' +
      d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    );
  };

  // PDF आता backend तयार करतो — इथे फक्त तो URL उघडायचा
  const handlePrintOrShare = async () => {
    try {
      setGenerating(true);
      const url = `${SERVER_ROOT}/api/invoice/${order._id}`;
      const supported = await Linking.canOpenURL(url);
      if (!supported) {
        Alert.alert('Error', 'Invoice link उघडता येत नाही.');
        return;
      }
      await Linking.openURL(url);
    } catch (error) {
      Alert.alert('Error', 'Invoice उघडताना अडचण आली: ' + error.message);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Invoice</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <Text style={styles.shopName}>{SHOP_NAME}</Text>
          <Text style={styles.shopAddress}>{SHOP_ADDRESS}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Order #{order._id.slice(-6).toUpperCase()}</Text>
          <Text style={styles.infoText}>Order Date: {formatDate(order.createdAt)}</Text>
          <Text style={styles.infoText}>Confirmed On: {formatDate(order.confirmedAt)}</Text>
          <Text style={styles.infoText}>Status: {order.orderStatus}</Text>
          <Text style={styles.infoText}>
            Expected Delivery: {order.expectedDeliveryDays ? `${order.expectedDeliveryDays} days` : '—'}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Customer Details</Text>
          <Text style={styles.infoText}>{order.shippingAddress?.fullName || order.user?.name}</Text>
          <Text style={styles.infoText}>{order.shippingAddress?.mobile}</Text>
          <Text style={styles.infoText}>
            {order.shippingAddress?.addressLine}, {order.shippingAddress?.city} - {order.shippingAddress?.pincode}
          </Text>
        </View>

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

        <TouchableOpacity
          style={[styles.printButton, generating && styles.disabledButton]}
          onPress={handlePrintOrShare}
          disabled={generating}
        >
          {generating ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.printButtonText}>🖨️ Print / Save Invoice</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F5F5F7', paddingTop: 40 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, paddingBottom: 10 },
  backText: { fontSize: 16, color: '#6C5CE7', fontWeight: 'bold', marginRight: 15 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#222' },
  container: { padding: 15, paddingBottom: 40 },

  card: { backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 12 },
  shopName: { fontSize: 20, fontWeight: 'bold', color: '#6C5CE7', textAlign: 'center' },
  shopAddress: { fontSize: 12, color: '#666', textAlign: 'center', marginTop: 4 },

  sectionTitle: { fontSize: 14, fontWeight: 'bold', color: '#222', marginBottom: 8 },
  infoText: { color: '#555', fontSize: 13, marginBottom: 3 },

  itemRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  itemName: { color: '#444', fontSize: 13, flex: 1 },
  itemPrice: { color: '#222', fontWeight: '600', fontSize: 13 },
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 8 },
  totalLabel: { fontWeight: 'bold', color: '#222' },
  totalValue: { fontWeight: 'bold', color: '#6C5CE7' },

  printButton: { backgroundColor: '#43A047', borderRadius: 10, paddingVertical: 14, alignItems: 'center', marginTop: 10 },
  disabledButton: { opacity: 0.6 },
  printButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
});

export default Invoice;