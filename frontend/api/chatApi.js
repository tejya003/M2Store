import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://m2store-backend.onrender.com/api/chat';

// Get logged-in user's chat messages
export const getChatMessages = async () => {
  const token = await AsyncStorage.getItem('token');

  const response = await fetch(BASE_URL, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to load messages');
  }

  return data;
};

// Send customer message
export const sendChatMessage = async message => {
  const token = await AsyncStorage.getItem('token');

  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      message,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to send message');
  }

  return data;
};