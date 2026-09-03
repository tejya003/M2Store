import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://192.168.1.11:5000/api/admin/customers';

const getToken = async () => {
  return await AsyncStorage.getItem('token');
};

export const getAllCustomers = async () => {
  const token = await getToken();

  const response = await fetch(BASE_URL, {
    headers: { Authorization: `Bearer ${token}` }
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to load customers');
  return data;
};

export const getCustomerOrders = async (id) => {
  const token = await getToken();

  const response = await fetch(`${BASE_URL}/${id}/orders`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to load customer orders');
  return data;
};