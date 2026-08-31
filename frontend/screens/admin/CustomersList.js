import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../context/ThemeContext';
import { getAllCustomers } from '../../api/customerApi';

const CustomersList = ({ navigation }) => {
  const { theme } = useTheme();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadCustomers = async () => {
    try {
      const data = await getAllCustomers();
      setCustomers(data);
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      loadCustomers();
    }, [])
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: theme.inputBackground, borderColor: theme.border }]}
      onPress={() => navigation.navigate('CustomerOrders', { customer: item })}
    >
      <Text style={[styles.name, { color: theme.text }]}>{item.name}</Text>
      <Text style={{ color: theme.placeholder }}>@{item.username}</Text>
      <Text style={{ color: theme.placeholder }}>{item.email}</Text>
      <Text style={{ color: theme.placeholder }}>{item.mobile}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Customers</Text>

      <FlatList
        data={customers}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 40 }}
        ListEmptyComponent={
          <Text style={{ color: theme.placeholder, textAlign: 'center', marginTop: 30 }}>
            No customers yet
          </Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 15 },
  card: { borderWidth: 1, borderRadius: 10, padding: 14, marginBottom: 10 },
  name: { fontSize: 16, fontWeight: '600', marginBottom: 3 },
});

export default CustomersList;