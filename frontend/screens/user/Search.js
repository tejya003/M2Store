import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { getProducts } from '../../api/productApi';

const Search = ({ navigation }) => {
  const { theme } = useTheme();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Dynamic Image URL Handler
  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/150';
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    return `http://192.168.1.11:5000${imagePath}`;
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data || []);
      setFilteredProducts(data || []);
    } catch (error) {
      console.log('Search load error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
    if (text.trim() === '') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(
        (item) =>
          item.name?.toLowerCase().includes(text.toLowerCase()) ||
          item.category?.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  };

  // Product Click Handler (Fix for Nested Navigation)
  const handleProductPress = (item) => {
    navigation.navigate('Home', {
      screen: 'ProductDetails',
      params: { product: item },
    });
  };

  const renderProductItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: theme.card || '#fff' }]}
      onPress={() => handleProductPress(item)}
    >
      <Image
        source={{
          uri: getImageUrl(item.images && item.images.length > 0 ? item.images[0] : null),
        }}
        style={styles.image}
      />
      <View style={styles.info}>
        <Text style={[styles.name, { color: theme.text || '#222' }]} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.category}>{item.category}</Text>
        <Text style={styles.price}>₹{item.price}</Text>
      </View>
      <Text style={styles.rating}>★ {item.ratingsAverage || 0}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background || '#F5F5F7' }]}>
      {/* Search Input Box */}
      <View style={styles.searchBox}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          placeholder="Search products, categories..."
          value={searchQuery}
          onChangeText={handleSearch}
          style={styles.searchInput}
          placeholderTextColor="#999"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => handleSearch('')}>
            <Text style={styles.clearIcon}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Results List */}
      {loading ? (
        <ActivityIndicator size="large" color="#6C5CE7" style={{ marginTop: 30 }} />
      ) : filteredProducts.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={{ color: theme.text || '#999', fontSize: 15 }}>No products found 🔍</Text>
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item._id || item.id}
          renderItem={renderProductItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50, paddingHorizontal: 15 },

  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    marginBottom: 15,
    elevation: 2,
  },
  searchIcon: { marginRight: 8, fontSize: 16 },
  searchInput: { flex: 1, fontSize: 14, color: '#222' },
  clearIcon: { color: '#999', fontSize: 16, paddingHorizontal: 5 },

  emptyBox: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  card: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
    alignItems: 'center',
    elevation: 1,
  },
  image: { width: 65, height: 65, borderRadius: 10, marginRight: 12, backgroundColor: '#eee' },
  info: { flex: 1 },
  name: { fontSize: 14, fontWeight: '600' },
  category: { fontSize: 11, color: '#888', marginTop: 2 },
  price: { fontSize: 14, color: '#6C5CE7', fontWeight: 'bold', marginTop: 4 },
  rating: { fontSize: 12, color: '#F9A825', fontWeight: '600' },
});

export default Search;