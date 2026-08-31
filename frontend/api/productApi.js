import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://192.168.1.2:5000/api/products';

const getToken = async () => {
  return await AsyncStorage.getItem('token');
};

// GET all products (public)
export const getProducts = async () => {
  const response = await fetch(BASE_URL);
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to load products');
  return data;
};

// DELETE product (admin)
export const deleteProduct = async (id) => {
  const token = await getToken();

  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to delete product');
  return data;
};

// CREATE product (admin) - formData includes name, description, price, category, stock, image
export const createProduct = async (formData) => {
  const token = await getToken();

  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    },
    body: formData
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to create product');
  return data;
};

// UPDATE product (admin)
export const updateProduct = async (id, formData) => {
  const token = await getToken();

  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    },
    body: formData
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to update product');
  return data;
};