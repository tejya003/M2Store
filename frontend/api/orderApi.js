import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://192.168.1.2:5000/api/orders';

const getToken = async () => {
  return await AsyncStorage.getItem('token');
};

export const createOrder = async (orderData) => {
  const token = await getToken();

  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(orderData),
  });

  const text = await response.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch (e) {
    throw new Error(`Server Route Error: URL तपासा (${response.status})`);
  }

  if (!response.ok) throw new Error(data.message || 'Failed to create order');
  return data;
};

export const getAllOrders = async () => {
  const token = await getToken();

  const response = await fetch(BASE_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to load orders');
  return data;
};

export const updateOrderStatus = async (id, orderStatus, expectedDeliveryDays) => {
  const token = await getToken();

  const body = { orderStatus };
  if (expectedDeliveryDays) {
    body.expectedDeliveryDays = expectedDeliveryDays;
  }

  const response = await fetch(`${BASE_URL}/${id}/status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to update status');
  return data;
};

export const getMyOrders = async () => {
  const token = await getToken();

  const response = await fetch(`${BASE_URL}/my-orders`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to load orders');
  return data;
};