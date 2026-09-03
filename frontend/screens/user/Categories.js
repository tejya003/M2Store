import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { getProducts } from '../../api/productApi';

const CATEGORIES_LIST = [
  { name: 'All', image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=200' },
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

const Categories = ({ navigation }) => {
  const { theme } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
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
      console.log('Categories load error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCategory = (catName) => {
    setSelectedCategory(catName);
    if (catName === 'All') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(
        (item) => item.category?.toLowerCase() === catName.toLowerCase()
      );
      setFilteredProducts(filtered);
    }
  };

  const renderProductItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.productCard, { backgroundColor: theme.card || '#fff' }]}
      onPress={() => navigation.navigate('ProductDetails', { product: item })}
    >
      <Image
        source={{
          uri: getImageUrl(item.images && item.images.length > 0 ? item.images[0] : null),
        }}
        style={styles.productImage}
      />
      <View style={styles.productInfo}>
        <Text style={[styles.productName, { color: theme.text || '#222' }]} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.productPrice}>₹{item.price}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background || '#F5F5F7' }]}>
      <Text style={[styles.title, { color: theme.text || '#222' }]}>Categories</Text>

      {/* Horizontal Category Selector */}
      <View style={styles.categoryContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {CATEGORIES_LIST.map((cat) => {
            const isSelected = selectedCategory === cat.name;
            return (
              <TouchableOpacity
                key={cat.name}
                style={[
                  styles.categoryChip,
                  isSelected && styles.selectedChip,
                  { backgroundColor: isSelected ? '#6C5CE7' : theme.card || '#fff' },
                ]}
                onPress={() => handleSelectCategory(cat.name)}
              >
                <Image source={{ uri: cat.image }} style={styles.categoryChipImage} />
                <Text
                  style={[
                    styles.categoryChipText,
                    { color: isSelected ? '#fff' : theme.text || '#333' },
                  ]}
                >
                  {cat.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Products Grid / List */}
      {loading ? (
        <ActivityIndicator size="large" color="#6C5CE7" style={{ marginTop: 30 }} />
      ) : filteredProducts.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={{ color: theme.text || '#999', fontSize: 15 }}>
            No products in {selectedCategory}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item._id}
          renderItem={renderProductItem}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50, paddingHorizontal: 15 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 15 },

  categoryContainer: { marginBottom: 15 },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    elevation: 1,
  },
  categoryChipImage: { width: 24, height: 24, borderRadius: 12, marginRight: 8 },
  categoryChipText: { fontSize: 13, fontWeight: '600' },

  row: { justifyContent: 'space-between', marginBottom: 12 },
  productCard: {
    width: '48%',
    borderRadius: 12,
    padding: 10,
    elevation: 2,
  },
  productImage: { width: '100%', height: 120, borderRadius: 10, backgroundColor: '#eee' },
  productInfo: { marginTop: 8 },
  productName: { fontSize: 13, fontWeight: '600' },
  productPrice: { fontSize: 14, color: '#6C5CE7', fontWeight: 'bold', marginTop: 4 },

  emptyBox: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default Categories;