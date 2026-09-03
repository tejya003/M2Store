import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../context/ThemeContext';
import { getWishlist, removeFromWishlist } from '../../utils/wishlistStorage'; // तुमच्या storage file चा path तपासा

const Wishlist = ({ navigation }) => {
  const { theme } = useTheme();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  // Dynamic Image URL Handler (Direct HTTPS or local fallback)
  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/150';
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    return `http://192.168.1.11:5000${imagePath}`;
  };

  const loadWishlist = async () => {
    try {
      if (typeof getWishlist === 'function') {
        const data = await getWishlist();
        setWishlist(data || []);
      }
    } catch (error) {
      console.log('Wishlist load error:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadWishlist();
    }, [])
  );

  const handleRemove = (productId) => {
    Alert.alert('Remove Item', 'Remove from wishlist?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: async () => {
          if (typeof removeFromWishlist === 'function') {
            const updated = await removeFromWishlist(productId);
            setWishlist(updated || []);
          }
        },
      },
    ]);
  };

  const renderItem = ({ item }) => {
    const imageUrl = item.images && item.images.length > 0 ? item.images[0] : item.image;

    return (
      <TouchableOpacity
        style={[styles.card, { backgroundColor: theme.card || '#fff' }]}
        onPress={() => navigation.navigate('ProductDetails', { product: item })}
      >
        <Image
          source={{ uri: getImageUrl(imageUrl) }}
          style={styles.image}
        />

        <View style={styles.info}>
          <Text style={[styles.name, { color: theme.text || '#222' }]} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.price}>₹{item.price}</Text>
        </View>

        <TouchableOpacity onPress={() => handleRemove(item._id || item.productId)} style={styles.removeBtn}>
          <Text style={styles.removeIcon}>❤️</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background || '#F5F5F7' }]}>
      <Text style={[styles.title, { color: theme.text || '#222' }]}>My Wishlist</Text>

      {wishlist.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={{ color: theme.text || '#999', fontSize: 15 }}>Your wishlist is empty ❤️</Text>
        </View>
      ) : (
        <FlatList
          data={wishlist}
          keyExtractor={(item) => item._id || item.productId}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50, paddingHorizontal: 15 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 15 },
  emptyBox: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
    alignItems: 'center',
    elevation: 2,
  },
  image: { width: 70, height: 70, borderRadius: 10, marginRight: 12, backgroundColor: '#eee' },
  info: { flex: 1 },
  name: { fontSize: 14, fontWeight: '600' },
  price: { fontSize: 14, color: '#6C5CE7', fontWeight: 'bold', marginTop: 4 },
  removeBtn: { padding: 8 },
  removeIcon: { fontSize: 18 },
});

export default Wishlist;