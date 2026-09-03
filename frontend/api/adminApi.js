import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://192.168.1.11:5000/api/admin';

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