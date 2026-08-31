import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://192.168.1.2:5000/api/orders';

const getToken = async () => {
  return await AsyncStorage.getItem('token');
};

export const getAllOrders = async () => {
  const token = await getToken();

  const response = await fetch(BASE_URL, {
    headers: { Authorization: `Bearer ${token}` }
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to load orders');
  return data;
};

export const updateOrderStatus = async (id, orderStatus) => {
  const token = await getToken();

  const response = await fetch(`${BASE_URL}/${id}/status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ orderStatus })
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to update status');
  return data;
};