import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getProducts } from '../../api/productApi';

// Unsplash Direct Images for Categories (Zero IP reliance)
const CATEGORIES = [
  { name: 'Electronics', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=200' },
  { name: 'Fashion Men', image: 'https://images.unsplash.com/photo-1516826957135-700dedea698c?w=200' },
  { name: 'Fashion Women', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=200' },
  { name: 'Home Kitchen', image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=200' },
  { name: 'Books', image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=200' },
  { name: 'Beauty', image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=200' },
  { name: 'Sports', image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=200' },
  { name: 'Toys', image: 'https://images.unsplash.com/photo-1533230393619-3fdd062eb142?w=200' },
  { name: 'Furniture', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200' },
  { name: 'Grocery', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200' },
];

const Home = ({ navigation }) => {
  const [userName, setUserName] = useState('');
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const userStr = await AsyncStorage.getItem('user');
        if (userStr) {
          const user = JSON.parse(userStr);
          setUserName(user.name);
        }

        const data = await getProducts();
        setProducts(data || []);
        setFilteredProducts(data || []);
      } catch (error) {
        console.log('Home load error:', error.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Search Logic for Live Filtering
  const handleSearch = (text) => {
    setSearch(text);
    if (text.trim() === '') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(
        (product) =>
          product.name.toLowerCase().includes(text.toLowerCase()) ||
          product.category?.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  };

  // Helper function to resolve absolute URL or fallbacks safely
  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/150';
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    return `http://192.168.1.11:5000${imagePath}`;
  };

  const displayProducts = search.trim() !== '' ? filteredProducts : products.slice(0, 10);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ paddingBottom: 30 }}>
      {/* Purple Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.welcomeText}>Welcome back,</Text>
            <Text style={styles.userName}>{userName || 'User'} 👋</Text>
          </View>
          <Text style={styles.bell}>🔔</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            placeholder="Search for products..."
            value={search}
            onChangeText={handleSearch}
            style={styles.searchInput}
            placeholderTextColor="#999"
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => handleSearch('')}>
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Categories Section */}
      {search.trim() === '' && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Categories</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Categories')}>
              <Text style={styles.viewAll}>View all</Text>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat.name}
                style={styles.categoryItem}
                onPress={() => navigation.navigate('Categories', { categoryName: cat.name })}
              >
                <Image source={{ uri: cat.image }} style={styles.categoryImage} />
                <Text style={styles.categoryName} numberOfLines={1}>
                  {cat.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Featured / Searched Products Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {search.trim() !== '' ? `Search Results (${filteredProducts.length})` : 'Featured Products'}
          </Text>
          {search.trim() === '' && (
            <TouchableOpacity onPress={() => navigation.navigate('Search')}>
              <Text style={styles.viewAll}>View all</Text>
            </TouchableOpacity>
          )}
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#6C5CE7" style={{ marginTop: 20 }} />
        ) : displayProducts.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>No products found 🔍</Text>
          </View>
        ) : (
          <ScrollView horizontal={search.trim() === ''} showsHorizontalScrollIndicator={false}>
            <View style={search.trim() !== '' ? styles.gridContainer : styles.rowContainer}>
              {displayProducts.map((product) => (
                <TouchableOpacity
                  key={product._id}
                  style={search.trim() !== '' ? styles.productCardGrid : styles.productCard}
                  onPress={() => navigation.navigate('ProductDetails', { product })}
                >
                  <View style={styles.productImageBox}>
                    {product.images && product.images.length > 0 ? (
                      <Image
                        source={{ uri: getImageUrl(product.images[0]) }}
                        style={styles.productImage}
                      />
                    ) : (
                      <View style={[styles.productImage, styles.noImage]} />
                    )}
                    <Text style={styles.heartIcon}>♡</Text>
                  </View>

                  <Text style={styles.productName} numberOfLines={1}>
                    {product.name}
                  </Text>
                  <View style={styles.productMeta}>
                    <Text style={styles.productPrice}>₹{product.price}</Text>
                    <Text style={styles.productRating}>★ {product.ratingsAverage || 0}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F5F5F7' },

  header: {
    backgroundColor: '#6C5CE7',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 },
  welcomeText: { color: '#E0DFFF', fontSize: 13 },
  userName: { color: '#fff', fontSize: 20, fontWeight: 'bold', marginTop: 2 },
  bell: { fontSize: 20 },

  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 46,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 14, color: '#222' },
  clearIcon: { color: '#999', fontSize: 16, paddingHorizontal: 5 },

  section: { paddingHorizontal: 20, marginTop: 20 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 17, fontWeight: 'bold', color: '#222' },
  viewAll: { color: '#6C5CE7', fontWeight: '600', fontSize: 13 },

  categoryItem: { alignItems: 'center', marginRight: 16, width: 70 },
  categoryImage: { width: 55, height: 55, borderRadius: 14, marginBottom: 6, backgroundColor: '#eee' },
  categoryName: { fontSize: 11, color: '#333', textAlign: 'center' },

  rowContainer: { flexDirection: 'row' },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },

  productCard: { width: 140, marginRight: 14 },
  productCardGrid: { width: '48%', marginBottom: 15 },

  productImageBox: { position: 'relative' },
  productImage: { width: '100%', height: 140, borderRadius: 12, backgroundColor: '#eee' },
  noImage: { backgroundColor: '#eee' },
  heartIcon: { position: 'absolute', top: 8, right: 8, fontSize: 18, color: '#fff' },
  productName: { fontSize: 13, fontWeight: '600', color: '#222', marginTop: 8 },
  productMeta: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  productPrice: { fontSize: 13, fontWeight: 'bold', color: '#222' },
  productRating: { fontSize: 12, color: '#F9A825' },

  emptyBox: { paddingVertical: 30, alignItems: 'center' },
  emptyText: { color: '#888', fontSize: 14 },
});

export default Home;