import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import RazorpayCheckout from 'react-native-razorpay';
import { createOrder } from '../../api/orderApi';
import { createRazorpayOrder, verifyPayment } from '../../api/paymentApi';
import { clearCart } from '../../utils/cartStorage';

const Checkout = ({ route, navigation }) => {
  const { address, cart, total } = route.params || {};
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [loading, setLoading] = useState(false);

  const buildOrderData = (paymentStatusOverride) => {
    const orderItems = cart.map((item) => ({
      product: item.productId,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
    }));

    return {
      items: orderItems,
      totalAmount: total,
      shippingAddress: {
        fullName: address?.name,
        mobile: address?.mobile,
        addressLine: address?.address,
        city: address?.city,
        pincode: address?.pincode,
      },
      paymentMethod: paymentStatusOverride,
    };
  };

  const handleCODOrder = async () => {
    try {
      setLoading(true);
      await createOrder(buildOrderData('COD'));
      await clearCart();
      navigation.replace('OrderSuccess');
    } catch (error) {
      Alert.alert('Error', error.message || 'Could not place order');
    } finally {
      setLoading(false);
    }
  };

  const handleOnlinePayment = async () => {
    try {
      setLoading(true);

      // Step 1: create Razorpay order via backend
      const rzpOrder = await createRazorpayOrder(total);

      const options = {
        description: 'M2 Store Order Payment',
        currency: rzpOrder.currency,
        key: rzpOrder.keyId,
        amount: rzpOrder.amount,
        order_id: rzpOrder.orderId,
        name: 'M2 Store',
        prefill: {
          name: address?.name || '',
          contact: address?.mobile || '',
        },
        theme: { color: '#6C5CE7' },
      };

      setLoading(false);

      RazorpayCheckout.open(options)
        .then(async (data) => {
          setLoading(true);
          try {
            // Step 2: verify payment signature via backend
            await verifyPayment({
              razorpay_order_id: data.razorpay_order_id,
              razorpay_payment_id: data.razorpay_payment_id,
              razorpay_signature: data.razorpay_signature,
            });

            // Step 3: create the order in our database
            await createOrder(buildOrderData('Online'));
            await clearCart();
            navigation.replace('OrderSuccess');
          } catch (err) {
            Alert.alert('Error', err.message || 'Payment verification failed');
          } finally {
            setLoading(false);
          }
        })
        .catch((error) => {
          Alert.alert('Payment Cancelled', error.description || 'Payment was not completed');
        });
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', error.message || 'Could not start payment');
    }
  };

  const handlePlaceOrder = () => {
    if (paymentMethod === 'Online') {
      handleOnlinePayment();
    } else {
      handleCODOrder();
    }
  };

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.sectionTitle}>Delivery Address</Text>
        <View style={styles.card}>
          <Text style={styles.name}>{address?.name} ({address?.mobile})</Text>
          <Text style={styles.addressText}>
            {address?.address}, {address?.city} - {address?.pincode}
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Select Payment Method</Text>
        <TouchableOpacity
          style={[styles.paymentCard, paymentMethod === 'COD' && styles.selectedPayment]}
          onPress={() => setPaymentMethod('COD')}
        >
          <Text style={styles.paymentText}>💵 Cash on Delivery (COD)</Text>
          {paymentMethod === 'COD' && <Text style={styles.radio}>🔘</Text>}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.paymentCard, paymentMethod === 'Online' && styles.selectedPayment]}
          onPress={() => setPaymentMethod('Online')}
        >
          <Text style={styles.paymentText}>💳 Pay Online (UPI / Card / Netbanking)</Text>
          {paymentMethod === 'Online' && <Text style={styles.radio}>🔘</Text>}
        </TouchableOpacity>

        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>Total Payable Amount:</Text>
          <Text style={styles.totalAmount}>₹{total}</Text>
        </View>

        <TouchableOpacity
          style={styles.placeOrderBtn}
          onPress={handlePlaceOrder}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.placeOrderText}>
              {paymentMethod === 'Online' ? 'Pay Now ›' : 'Confirm & Place Order ›'}
            </Text>
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
  container: { padding: 15 },
  sectionTitle: { fontSize: 15, fontWeight: 'bold', color: '#222', marginTop: 15, marginBottom: 8 },
  card: { backgroundColor: '#fff', borderRadius: 10, padding: 12, marginBottom: 10 },
  name: { fontSize: 14, fontWeight: 'bold', color: '#222' },
  addressText: { fontSize: 12, color: '#666', marginTop: 4 },
  paymentCard: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#fff', padding: 14, borderRadius: 10, marginBottom: 10, borderWidth: 1, borderColor: '#DDD' },
  selectedPayment: { borderColor: '#6C5CE7', backgroundColor: '#F0EEFF' },
  paymentText: { fontSize: 14, fontWeight: '600', color: '#222' },
  radio: { fontSize: 14, color: '#6C5CE7' },
  totalCard: { backgroundColor: '#fff', borderRadius: 10, padding: 15, flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 },
  totalLabel: { fontSize: 15, color: '#444', fontWeight: '600' },
  totalAmount: { fontSize: 18, fontWeight: 'bold', color: '#6C5CE7' },
  placeOrderBtn: { backgroundColor: '#43A047', borderRadius: 10, paddingVertical: 14, alignItems: 'center', marginTop: 25 },
  placeOrderText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});

export default Checkout;