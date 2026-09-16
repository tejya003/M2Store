import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http:// 192.168.1.9:5000/api/admin/offices'; 
const getToken = async () => {
  return await AsyncStorage.getItem('token');
};

// नवीन office login तयार करतं
export const createOfficeUser = async (name, username, password, officeName) => {
  const token = await getToken();

  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ name, username, password, officeName })
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Office login बनवता आला नाही');
  return data;
};

// सगळ्या office logins ची यादी
export const getAllOfficeUsers = async () => {
  const token = await getToken();

  const response = await fetch(BASE_URL, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'यादी मिळाली नाही');
  return data;
};