import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://m2store-backend.onrender.com/api/delivery';

const getToken = async () => {
  return await AsyncStorage.getItem('token');
};

// उपलब्ध orders ची यादी (कुणीही अजून घेतलेला नाही)
export const getAvailableOrders = async () => {
  const token = await getToken();

  const response = await fetch(`${BASE_URL}/available`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Orders लोड होत नाहीत');
  return data;
};

// एखादा order स्वतःकडे accept करणं
export const acceptOrder = async (orderId) => {
  const token = await getToken();

  const response = await fetch(`${BASE_URL}/${orderId}/accept`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Order accept करता आला नाही');
  return data;
};

// स्वतः accept केलेल्या orders ची यादी
export const getMyDeliveries = async () => {
  const token = await getToken();

  const response = await fetch(`${BASE_URL}/my-deliveries`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Deliveries लोड होत नाहीत');
  return data;
};

// order delivered म्हणून mark करणं
export const markDelivered = async (orderId) => {
  const token = await getToken();

  const response = await fetch(`${BASE_URL}/${orderId}/delivered`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Delivered mark करता आला नाही');
  return data;
};