import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../context/ThemeContext';

const Profile = ({ navigation }) => {
  const { theme } = useTheme();
  const [user, setUser] = useState({ name: '', email: '', mobile: '' });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userStr = await AsyncStorage.getItem('user');
      if (userStr) {
        setUser(JSON.parse(userStr));
      }
    } catch (error) {
      console.log('Profile user load error:', error);
    }
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.removeItem('user');
          await AsyncStorage.removeItem('token');
          // Login स्क्रीनकडे रिडायरेक्ट करा (Navigation structure नुसार)
          navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          });
        },
      },
    ]);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background || '#F5F5F7' }]}>
      {/* Header Profile Info */}
      <View style={styles.headerBox}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200' }}
          style={styles.avatar}
        />
        <Text style={styles.userName}>{user.name || 'User Name'}</Text>
        <Text style={styles.userEmail}>{user.email || 'user@example.com'}</Text>

        <TouchableOpacity style={styles.editBtn}>
          <Text style={styles.editBtnText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Options List */}
      <View style={styles.menuContainer}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('Orders')}
        >
          <Text style={styles.menuIcon}>📦</Text>
          <Text style={styles.menuText}>My Orders</Text>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('Wishlist')}
        >
          <Text style={styles.menuIcon}>❤️</Text>
          <Text style={styles.menuText}>Wishlist</Text>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() =>
            navigation.navigate('Home', {
              screen: 'SavedAddresses',
            })
          }
        >
          <Text style={styles.menuIcon}>📍</Text>
          <Text style={styles.menuText}>Saved Addresses</Text>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuIcon}>🔒</Text>
          <Text style={styles.menuText}>Change Password</Text>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuIcon}>⚙️</Text>
          <Text style={styles.menuText}>Settings</Text>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 40 },
  headerBox: { alignItems: 'center', paddingVertical: 20, backgroundColor: '#fff', marginBottom: 15 },
  avatar: { width: 80, height: 80, borderRadius: 40, marginBottom: 10 },
  userName: { fontSize: 18, fontWeight: 'bold', color: '#222' },
  userEmail: { fontSize: 13, color: '#777', marginTop: 2 },
  editBtn: { marginTop: 12, paddingHorizontal: 15, paddingVertical: 6, borderRadius: 15, backgroundColor: '#F0EEFF' },
  editBtnText: { color: '#6C5CE7', fontSize: 12, fontWeight: '600' },

  menuContainer: { backgroundColor: '#fff', paddingHorizontal: 15 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  menuIcon: { fontSize: 18, marginRight: 15 },
  menuText: { flex: 1, fontSize: 15, color: '#333', fontWeight: '500' },
  arrow: { fontSize: 18, color: '#ccc' },

  logoutBtn: { margin: 20, backgroundColor: '#FFEBEE', borderRadius: 10, paddingVertical: 14, alignItems: 'center' },
  logoutText: { color: '#E53935', fontWeight: 'bold', fontSize: 15 },
});

export default Profile;