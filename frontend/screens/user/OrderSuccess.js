import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const OrderSuccess = ({ navigation }) => {
  return (
    <View style={styles.screen}>
      <Text style={styles.icon}>✅</Text>
      <Text style={styles.title}>Order Placed Successfully!</Text>
      <Text style={styles.subtitle}>Your order has been received and is being processed.</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Orders')}
      >
        <Text style={styles.buttonText}>View My Orders</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.secondaryButtonText}>Continue Shopping</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 30, backgroundColor: '#fff' },
  icon: { fontSize: 60, marginBottom: 20 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#222', textAlign: 'center' },
  subtitle: { fontSize: 14, color: '#666', textAlign: 'center', marginTop: 10, marginBottom: 30 },
  button: { backgroundColor: '#6C5CE7', borderRadius: 10, paddingVertical: 14, paddingHorizontal: 30, marginBottom: 12 },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  secondaryButton: { paddingVertical: 10 },
  secondaryButtonText: { color: '#6C5CE7', fontWeight: '600' },
});

export default OrderSuccess;