import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://m2store-backend.onrender.com/api/auth';

const getToken = async () => {
  return await AsyncStorage.getItem('token');
};

// सगळे delivery partners
export const getDeliveryPartners = async () => {
  const token = await getToken();

  const response = await fetch(`${BASE_URL}/delivery-partners`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Partners लोड होत नाहीत');
  return data;
};

// partner block / unblock
export const toggleBlockPartner = async (partnerId) => {
  const token = await getToken();

  const response = await fetch(`${BASE_URL}/delivery-partners/${partnerId}/block`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` }
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Status बदलता आला नाही');
  return data;
};