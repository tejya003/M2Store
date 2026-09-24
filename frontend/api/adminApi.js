import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://m2store-backend.onrender.com/api/admin';

const getToken = async () => {
  return await AsyncStorage.getItem('token');
};

export const getDashboardStats = async () => {
  const token = await getToken();

  const response = await fetch(`${BASE_URL}/dashboard-stats`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to load dashboard stats');
  return data;
};

// ==============================
// DELIVERY PARTNERS
// ==============================

export const getDeliveryPartners = async () => {
  const token = await getToken();

  const response = await fetch(`${BASE_URL}/delivery`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to load delivery partners');
  }

  return data;
};

export const createDeliveryPartner = async deliveryData => {
  const token = await getToken();

  const response = await fetch(`${BASE_URL}/delivery`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(deliveryData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to create delivery partner');
  }

  return data;
};