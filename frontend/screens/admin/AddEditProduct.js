import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { useTheme } from '../../context/ThemeContext';
import { createProduct, updateProduct } from '../../api/productApi';

const IMAGE_BASE = 'http://192.168.1.2:5000';

const AddEditProduct = ({ navigation, route }) => {
  const { theme } = useTheme();
  const existingProduct = route.params?.product;
  const isEditMode = !!existingProduct;

  const [name, setName] = useState(existingProduct?.name || '');
  const [description, setDescription] = useState(existingProduct?.description || '');
  const [price, setPrice] = useState(existingProduct ? String(existingProduct.price) : '');
  const [category, setCategory] = useState(existingProduct?.category || '');
  const [stock, setStock] = useState(existingProduct ? String(existingProduct.stock) : '');

  const [selectedImage, setSelectedImage] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const existingImageUrl =
    existingProduct?.images && existingProduct.images.length > 0
      ? `${IMAGE_BASE}${existingProduct.images[0]}`
      : null;

  const pickImage = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 0.7 }, (response) => {
      if (response.didCancel) return;
      if (response.errorMessage) {
        Alert.alert('Error', response.errorMessage);
        return;
      }
      if (response.assets && response.assets.length > 0) {
        setSelectedImage(response.assets[0]);
      }
    });
  };

  const handleSave = async () => {
    if (name.trim() === '' || price.trim() === '' || stock.trim() === '') {
      Alert.alert('Error', 'Name, price and stock are required');
      return;
    }

    try {
      setIsSaving(true);

      const formData = new FormData();
      formData.append('name', name.trim());
      formData.append('description', description.trim());
      formData.append('price', price.trim());
      formData.append('category', category.trim());
      formData.append('stock', stock.trim());

      if (selectedImage) {
        formData.append('image', {
          uri: selectedImage.uri,
          type: selectedImage.type || 'image/jpeg',
          name: selectedImage.fileName || 'product.jpg',
        });
      }

      if (isEditMode) {
        await updateProduct(existingProduct._id, formData);
        Alert.alert('Success', 'Product updated successfully');
      } else {
        await createProduct(formData);
        Alert.alert('Success', 'Product added successfully');
      }

      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>
        {isEditMode ? 'Edit Product' : 'Add Product'}
      </Text>

      <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
        {selectedImage ? (
          <Image source={{ uri: selectedImage.uri }} style={styles.previewImage} />
        ) : existingImageUrl ? (
          <Image source={{ uri: existingImageUrl }} style={styles.previewImage} />
        ) : (
          <View style={[styles.previewImage, styles.noImage, { borderColor: theme.border }]}>
            <Text style={{ color: theme.placeholder }}>Tap to select image</Text>
          </View>
        )}
      </TouchableOpacity>

      <TextInput
        placeholder="Product name"
        value={name}
        onChangeText={setName}
        style={[styles.input, { backgroundColor: theme.inputBackground, color: theme.inputText, borderColor: theme.border }]}
        placeholderTextColor={theme.placeholder}
      />

      <TextInput
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        multiline
        style={[styles.input, styles.textArea, { backgroundColor: theme.inputBackground, color: theme.inputText, borderColor: theme.border }]}
        placeholderTextColor={theme.placeholder}
      />

      <TextInput
        placeholder="Price"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
        style={[styles.input, { backgroundColor: theme.inputBackground, color: theme.inputText, borderColor: theme.border }]}
        placeholderTextColor={theme.placeholder}
      />

      <TextInput
        placeholder="Category"
        value={category}
        onChangeText={setCategory}
        style={[styles.input, { backgroundColor: theme.inputBackground, color: theme.inputText, borderColor: theme.border }]}
        placeholderTextColor={theme.placeholder}
      />

      <TextInput
        placeholder="Stock quantity"
        value={stock}
        onChangeText={setStock}
        keyboardType="numeric"
        style={[styles.input, { backgroundColor: theme.inputBackground, color: theme.inputText, borderColor: theme.border }]}
        placeholderTextColor={theme.placeholder}
      />

      <TouchableOpacity
        style={[styles.saveButton, isSaving && styles.disabledButton]}
        disabled={isSaving}
        onPress={handleSave}
      >
        <Text style={styles.saveButtonText}>
          {isSaving ? 'Saving...' : isEditMode ? 'Update Product' : 'Add Product'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 60 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  imagePicker: { alignItems: 'center', marginBottom: 20 },
  previewImage: { width: 140, height: 140, borderRadius: 10 },
  noImage: { alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderStyle: 'dashed' },
  input: { height: 50, borderWidth: 1, borderRadius: 8, paddingHorizontal: 15, marginBottom: 15, fontSize: 15 },
  textArea: { height: 90, paddingTop: 12 },
  saveButton: { backgroundColor: '#1E88E5', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  disabledButton: { opacity: 0.6 },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default AddEditProduct;