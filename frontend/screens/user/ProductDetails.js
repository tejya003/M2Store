import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  Dimensions,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { addToCart } from '../../utils/cartStorage';
import { getWishlist, addToWishlist, removeFromWishlist } from '../../utils/wishlistStorage';
 
const ProductDetails = ({ route, navigation }) => {
  const { product } = route.params;
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [inWishlist, setInWishlist] = useState(false);
  const [imageZoomVisible, setImageZoomVisible] = useState(false);
 
  const productId = product._id || product.productId;
 
  // Dynamic Image URL Handler (Direct HTTPS or fallback)
  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/300';
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    return `https://m2store-backend.onrender.com${imagePath}`;
  };
 
  const checkWishlistStatus = async () => {
    try {
      const list = await getWishlist();
      const exists = (list || []).some((item) => (item._id || item.productId) === productId);
      setInWishlist(exists);
    } catch (error) {
      console.log('Wishlist status check error:', error);
    }
  };
 
  useFocusEffect(
    useCallback(() => {
      checkWishlistStatus();
    }, [])
  );
 
  const handleToggleWishlist = async () => {
    try {
      if (inWishlist) {
        await removeFromWishlist(productId);
        setInWishlist(false);
      } else {
        await addToWishlist(product);
        setInWishlist(true);
      }
    } catch (error) {
      console.log('Toggle wishlist error:', error);
    }
  };
 
  const handleAddToCart = async () => {
    try {
      setAdding(true);
      await addToCart(product, quantity);
      Alert.alert('Added', `${product.name} added to cart`, [
        { text: 'Continue Shopping', style: 'cancel' },
        { text: 'Go to Cart', onPress: () => navigation.navigate('Cart') },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Could not add to cart');
    } finally {
      setAdding(false);
    }
  };
 
  const handleBuyNow = async () => {
    await addToCart(product, quantity);
    navigation.navigate('Cart');
  };
 
  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
 
        <TouchableOpacity
          style={styles.wishlistButton}
          onPress={handleToggleWishlist}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.wishlistIcon}>{inWishlist ? '❤️' : '♡'}</Text>
        </TouchableOpacity>
 
        {product.images && product.images.length > 0 ? (
          <TouchableOpacity activeOpacity={0.9} onPress={() => setImageZoomVisible(true)}>
            <Image
              source={{ uri: getImageUrl(product.images[0]) }}
              style={styles.image}
            />
          </TouchableOpacity>
        ) : (
          <View style={[styles.image, styles.noImage]} />
        )}
 
        <View style={styles.content}>
          <Text style={styles.name}>{product.name}</Text>
 
          <View style={styles.ratingRow}>
            <Text style={styles.rating}>★ {product.ratingsAverage || 0}</Text>
            <Text style={styles.ratingCount}>({product.ratingsCount || 0} ratings)</Text>
          </View>
 
          <Text style={styles.price}>₹{product.price}</Text>
 
          <Text
            style={[
              styles.stockText,
              { color: product.stock > 0 ? '#43A047' : '#E53935' },
            ]}
          >
            {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
          </Text>
 
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{product.description || 'No description available'}</Text>
 
          <Text style={styles.sectionTitle}>Quantity</Text>
          <View style={styles.quantityRow}>
            <TouchableOpacity
              style={styles.qtyButton}
              onPress={() => setQuantity((q) => Math.max(1, q - 1))}
            >
              <Text style={styles.qtyButtonText}>−</Text>
            </TouchableOpacity>
            <Text style={styles.qtyValue}>{quantity}</Text>
            <TouchableOpacity
              style={styles.qtyButton}
              onPress={() => setQuantity((q) => Math.min(product.stock, q + 1))}
            >
              <Text style={styles.qtyButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
 
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.cartButton, adding && styles.disabled]}
          disabled={adding || product.stock === 0}
          onPress={handleAddToCart}
        >
          <Text style={styles.cartButtonText}>Add to Cart</Text>
        </TouchableOpacity>
 
        <TouchableOpacity
          style={[styles.buyButton, product.stock === 0 && styles.disabled]}
          disabled={product.stock === 0}
          onPress={handleBuyNow}
        >
          <Text style={styles.buyButtonText}>Buy Now</Text>
        </TouchableOpacity>
      </View>
 
      <Modal visible={imageZoomVisible} transparent={true} animationType="fade">
        <TouchableOpacity
          style={styles.zoomOverlay}
          activeOpacity={1}
          onPress={() => setImageZoomVisible(false)}
        >
          <Image
            source={{ uri: getImageUrl(product.images?.[0]) }}
            style={styles.zoomedImage}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </Modal>
    </View>
  );
};
 
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff' },
  backButton: { position: 'absolute', top: 40, left: 15, zIndex: 10, backgroundColor: '#fff', borderRadius: 20, width: 36, height: 36, justifyContent: 'center', alignItems: 'center', elevation: 3 },
  backIcon: { fontSize: 18 },
  wishlistButton: { position: 'absolute', top: 40, right: 15, zIndex: 10, backgroundColor: '#fff', borderRadius: 20, width: 36, height: 36, justifyContent: 'center', alignItems: 'center', elevation: 3 },
  wishlistIcon: { fontSize: 18 },
  image: { width: '100%', height: 320, backgroundColor: '#f5f5f5' },
  noImage: { backgroundColor: '#eee' },
  content: { padding: 20 },
  name: { fontSize: 20, fontWeight: 'bold', color: '#222' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  rating: { color: '#F9A825', fontWeight: '600' },
  ratingCount: { color: '#999', marginLeft: 6, fontSize: 12 },
  price: { fontSize: 24, fontWeight: 'bold', color: '#6C5CE7', marginTop: 10 },
  stockText: { marginTop: 6, fontSize: 13, fontWeight: '600' },
  sectionTitle: { fontSize: 15, fontWeight: 'bold', color: '#222', marginTop: 20, marginBottom: 8 },
  description: { color: '#555', lineHeight: 20 },
  quantityRow: { flexDirection: 'row', alignItems: 'center' },
  qtyButton: { width: 36, height: 36, borderRadius: 8, backgroundColor: '#F0EEFF', justifyContent: 'center', alignItems: 'center' },
  qtyButtonText: { fontSize: 18, color: '#6C5CE7', fontWeight: 'bold' },
  qtyValue: { fontSize: 16, fontWeight: '600', marginHorizontal: 20 },
 
  bottomBar: { flexDirection: 'row', padding: 15, borderTopWidth: 1, borderTopColor: '#eee', backgroundColor: '#fff' },
  cartButton: { flex: 1, backgroundColor: '#F0EEFF', borderRadius: 10, paddingVertical: 14, alignItems: 'center', marginRight: 10 },
  cartButtonText: { color: '#6C5CE7', fontWeight: 'bold' },
  buyButton: { flex: 1, backgroundColor: '#6C5CE7', borderRadius: 10, paddingVertical: 14, alignItems: 'center' },
  buyButtonText: { color: '#fff', fontWeight: 'bold' },
  disabled: { opacity: 0.5 },
 
  zoomOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  zoomedImage: {
    width: Dimensions.get('window').width,
    height: '80%',
  },
});
 
export default ProductDetails;