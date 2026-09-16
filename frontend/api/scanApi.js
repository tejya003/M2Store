import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http:// 192.168.1.9:5000/api/orders'; // ⚠️ तुमच्या backend च्या IP प्रमाणे बदला (authApi.js मध्ये वापरलेलाच IP)

const getToken = async () => {
  return await AsyncStorage.getItem('token');
};

// Order ला एका office वर scan करतं
export const scanOrderApi = async (orderId, office) => {
  const token = await getToken();

  const response = await fetch(`${BASE_URL}/${orderId}/scan`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ office })
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Scan करताना अडचण आली');
  return data;
};

// एका order ची पूर्ण tracking माहिती
export const getOrderTrackingApi = async (orderId) => {
  const token = await getToken();

  const response = await fetch(`${BASE_URL}/${orderId}/tracking`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Tracking माहिती मिळाली नाही');
  return data;
};