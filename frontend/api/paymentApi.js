import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://192.168.1.11:5000/api/payment';

const getToken = async () => {
  return await AsyncStorage.getItem('token');
};

export const createRazorpayOrder = async (amount) => {
  const token = await getToken();

  const response = await fetch(`${BASE_URL}/create-order`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ amount })
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to create payment order');
  return data;
};

export const verifyPayment = async (paymentData) => {
  const token = await getToken();

  const response = await fetch(`${BASE_URL}/verify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(paymentData)
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Payment verification failed');
  return data;
};