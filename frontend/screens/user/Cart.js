import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { getCart, updateCartQuantity, removeFromCart } from '../../utils/cartStorage';

const Cart = ({ navigation }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [primaryAddress, setPrimaryAddress] = useState(null);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/150';
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    return `http://192.168.1.11:5000${imagePath}`;
  };

  const loadCartAndAddress = async () => {
    // 🛒 Cart Items Load करणे
    const data = await getCart();
    setCart(data);

    // 📍 Primary Address Load करणे
    try {
      const storedAddresses = await AsyncStorage.getItem('user_addresses');
      const storedPrimaryId = await AsyncStorage.getItem('primary_address_id');
      
      if (storedAddresses) {
        const addresses = JSON.parse(storedAddresses);
        if (storedPrimaryId) {
          const selected = addresses.find((addr) => addr.id === storedPrimaryId);
          setPrimaryAddress(selected || addresses[0]);
        } else if (addresses.length > 0) {
          setPrimaryAddress(addresses[0]);
        }
      }
    } catch (e) {
      console.log('Address fetch error', e);
    }

    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      loadCartAndAddress();
    }, [])
  );

  const handleQuantityChange = async (productId, newQty) => {
    if (newQty <= 0) {
      handleRemove(productId);
      return;
    }
    const updated = await updateCartQuantity(productId, newQty);
    setCart(updated);
  };

  const handleRemove = (productId) => {
    Alert.alert('Remove Item', 'Do you want to remove this item?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: async () => {
          const updated = await removeFromCart(productId);
          setCart(updated);
        },
      },
    ]);
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryCharge = subtotal > 500 || subtotal === 0 ? 0 : 40;
  const total = subtotal + deliveryCharge;

  const renderItem = ({ item }) => (
    <View style={styles.cartItem}>
      {item.image ? (
        <Image source={{ uri: getImageUrl(item.image) }} style={styles.itemImage} />
      ) : (
        <View style={[styles.itemImage, styles.noImage]} />
      )}

      <View style={styles.itemInfo}>
        <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.itemPrice}>₹{item.price}</Text>

        <View style={styles.qtyRow}>
          <TouchableOpacity
            style={styles.qtyButton}
            onPress={() => handleQuantityChange(item.productId, item.quantity - 1)}
          >
            <Text style={styles.qtyButtonText}>−</Text>
          </TouchableOpacity>
          <Text style={styles.qtyValue}>{item.quantity}</Text>
          <TouchableOpacity
            style={styles.qtyButton}
            onPress={() => handleQuantityChange(item.productId, item.quantity + 1)}
          >
            <Text style={styles.qtyButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity onPress={() => handleRemove(item.productId)}>
        <Text style={styles.removeText}>Remove</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) return null;

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>My Cart</Text>

      {cart.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Your cart is empty 🛒</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={cart}
            keyExtractor={(item) => item.productId}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 20 }}
            ListHeaderComponent={
              /* 📍 Primary Address Section inside Cart Header */
              <View style={styles.addressBox}>
                <View style={styles.addressHeader}>
                  <Text style={styles.addressTitle}>📍 Deliver To:</Text>
                  <TouchableOpacity 
                    onPress={() => navigation.navigate('Home', { screen: 'SavedAddresses' })}
                  >
                    <Text style={styles.changeAddressText}>Change</Text>
                  </TouchableOpacity>
                </View>

                {primaryAddress ? (
                  <View style={{ marginTop: 4 }}>
                    <Text style={styles.addressName}>{primaryAddress.name} ({primaryAddress.mobile})</Text>
                    <Text style={styles.addressDetails}>
                      {primaryAddress.address}, {primaryAddress.city}, {primaryAddress.state} - {primaryAddress.pincode}
                    </Text>
                  </View>
                ) : (
                  <TouchableOpacity 
                    style={styles.addAddressBtn} 
                    onPress={() => navigation.navigate('Home', { screen: 'SavedAddresses' })}
                  >
                    <Text style={styles.addAddressBtnText}>+ Add Delivery Address</Text>
                  </TouchableOpacity>
                )}
              </View>
            }
          />

          {/* Bill Summary */}
          <View style={styles.summaryBox}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>₹{subtotal}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Delivery Charge</Text>
              <Text style={styles.summaryValue}>
                {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
              </Text>
            </View>
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total Amount</Text>
              <Text style={styles.totalValue}>₹{total}</Text>
            </View>

            <TouchableOpacity
              style={styles.checkoutButton}
              onPress={() => {
                if (!primaryAddress) {
                  Alert.alert('Address Required', 'कृपया आधी डिलिव्हरी पत्ता निवडा.');
                  return;
                }
                navigation.navigate('Checkout', { address: primaryAddress, cart, total });
              }}
            >
              <Text style={styles.checkoutButtonText}>Proceed to Checkout ›</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F5F5F7', paddingTop: 50, paddingHorizontal: 15 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#222', marginBottom: 15 },

  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: '#999', fontSize: 15 },

  /* Address Box Styling */
  addressBox: { backgroundColor: '#fff', borderRadius: 12, padding: 12, marginBottom: 15, borderLeftWidth: 4, borderLeftColor: '#6C5CE7' },
  addressHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  addressTitle: { fontSize: 14, fontWeight: 'bold', color: '#222' },
  changeAddressText: { color: '#6C5CE7', fontWeight: 'bold', fontSize: 13 },
  addressName: { fontSize: 13, fontWeight: 'bold', color: '#333' },
  addressDetails: { fontSize: 12, color: '#666', marginTop: 2, lineHeight: 16 },
  addAddressBtn: { marginTop: 6, paddingVertical: 6 },
  addAddressBtnText: { color: '#E53935', fontWeight: 'bold', fontSize: 13 },

  cartItem: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 12, padding: 10, marginBottom: 10, alignItems: 'center' },
  itemImage: { width: 60, height: 60, borderRadius: 10, marginRight: 12 },
  noImage: { backgroundColor: '#eee' },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 14, fontWeight: '600', color: '#222' },
  itemPrice: { fontSize: 13, color: '#6C5CE7', fontWeight: 'bold', marginTop: 2 },

  qtyRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  qtyButton: { width: 28, height: 28, borderRadius: 6, backgroundColor: '#F0EEFF', justifyContent: 'center', alignItems: 'center' },
  qtyButtonText: { fontSize: 16, color: '#6C5CE7', fontWeight: 'bold' },
  qtyValue: { marginHorizontal: 12, fontSize: 14, fontWeight: '600' },

  removeText: { color: '#E53935', fontSize: 12, fontWeight: '600' },

  summaryBox: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 20 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  summaryLabel: { color: '#666' },
  summaryValue: { color: '#222', fontWeight: '600' },
  totalRow: { borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 8, marginTop: 4 },
  totalLabel: { fontSize: 16, fontWeight: 'bold', color: '#222' },
  totalValue: { fontSize: 16, fontWeight: 'bold', color: '#6C5CE7' },

  checkoutButton: { backgroundColor: '#6C5CE7', borderRadius: 10, paddingVertical: 14, alignItems: 'center', marginTop: 10 },
  checkoutButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
});

export default Cart;