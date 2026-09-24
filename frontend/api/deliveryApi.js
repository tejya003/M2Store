import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://m2store-backend.onrender.com/api/admin/delivery';

const getToken = async () => {
  return await AsyncStorage.getItem('token');
};

export const createDeliveryUser = async (
  name,
  username,
  password,
) => {
  const token = await getToken();

  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name,
      username,
      password,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || 'Failed to create delivery user',
    );
  }

  return data;
};