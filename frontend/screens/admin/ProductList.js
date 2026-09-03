import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getProducts, deleteProduct } from '../../api/productApi';

const IMAGE_BASE = 'http://192.168.1.11:5000';

const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  return `${IMAGE_BASE}${imagePath}`;
};

const ProductList = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const loadProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      loadProducts();
    }, [])
  );

  const handleDelete = (id) => {
    Alert.alert('Delete Product', 'Are you sure you want to delete this product?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteProduct(id);
            setProducts((prev) => prev.filter((p) => p._id !== id));
          } catch (error) {
            Alert.alert('Error', error.message);
          }
        },
      },
    ]);
  };

  const openMenu = (item) => {
    Alert.alert(item.name, 'Choose an action', [
      { text: 'Edit', onPress: () => navigation.navigate('AddEditProduct', { product: item }) },
      { text: 'Delete', style: 'destructive', onPress: () => handleDelete(item._id) },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const renderItem = ({ item }) => {
    const isActive = item.stock > 0;
    const imageUrl = item.images && item.images.length > 0 ? getImageUrl(item.images[0]) : null;

    return (
      <View style={styles.card}>
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.image} />
        ) : (
          <View style={[styles.image, styles.noImage]} />
        )}

        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.price}>₹{item.price}</Text>
          <Text style={styles.stock}>Stock: {item.stock}</Text>
        </View>

        <View style={styles.rightSection}>
          <TouchableOpacity onPress={() => openMenu(item)} style={styles.menuDots}>
            <Text style={styles.menuDotsText}>⋮</Text>
          </TouchableOpacity>

          <View style={[styles.badge, { backgroundColor: isActive ? '#E8F5E9' : '#FFEBEE' }]}>
            <Text style={{ color: isActive ? '#43A047' : '#E53935', fontSize: 11, fontWeight: '600' }}>
              {isActive ? 'Active' : 'Inactive'}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.screen}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Products</Text>
      </View>

      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            placeholder="Search products..."
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
            placeholderTextColor="#999"
          />
        </View>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddEditProduct')}
        >
          <Text style={styles.addButtonText}>+ Add Product</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#7C4DFF" style={{ marginTop: 30 }} />
      ) : (
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 40 }}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No products found</Text>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F5F5F7', padding: 15 },
  headerRow: { marginBottom: 15 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#222' },

  searchRow: { marginBottom: 15 },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 10, paddingHorizontal: 12, height: 46, marginBottom: 10, borderWidth: 1, borderColor: '#eee' },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 14, color: '#222' },
  addButton: { backgroundColor: '#7C4DFF', borderRadius: 10, height: 46, justifyContent: 'center', alignItems: 'center' },
  addButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },

  card: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 12, padding: 10, marginBottom: 12, alignItems: 'center' },
  image: { width: 55, height: 55, borderRadius: 10, marginRight: 12 },
  noImage: { backgroundColor: '#eee' },
  info: { flex: 1 },
  name: { fontSize: 15, fontWeight: '600', color: '#222' },
  price: { color: '#222', fontWeight: 'bold', marginTop: 3 },
  stock: { color: '#888', fontSize: 12, marginTop: 2 },

  rightSection: { alignItems: 'flex-end' },
  menuDots: { padding: 4 },
  menuDotsText: { fontSize: 20, color: '#888' },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10, marginTop: 6 },

  emptyText: { textAlign: 'center', color: '#999', marginTop: 30 },
});

export default ProductList;