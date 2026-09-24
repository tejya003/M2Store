import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://m2store-backend.onrender.com/api/chat';

// Get all customer chats
export const getAllChats = async () => {
  const token = await AsyncStorage.getItem('token');

  const response = await fetch(`${BASE_URL}/admin`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to load customer chats');
  }

  return data;
};

// Admin sends reply
export const sendAdminReply = async (userId, message) => {
  const token = await AsyncStorage.getItem('token');

  const response = await fetch(`${BASE_URL}/admin/reply`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      userId,
      message,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to send reply');
  }

  return data;
};