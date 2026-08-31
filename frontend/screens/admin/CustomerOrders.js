import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { getCustomerOrders } from '../../api/customerApi';

const CustomerOrders = ({ route }) => {
  const { theme } = useTheme();
  const { customer } = route.params;

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await getCustomerOrders(customer._id);
        setOrders(data);
      } catch (error) {
        Alert.alert('Error', error.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const renderItem = ({ item }) => (
    <View style={[styles.card, { backgroundColor: theme.inputBackground, borderColor: theme.border }]}>
      <View style={styles.rowBetween}>
        <Text style={[styles.orderId, { color: theme.text }]}>#{item._id.slice(-6).toUpperCase()}</Text>
        <Text style={styles.amount}>₹{item.totalAmount}</Text>
      </View>
      <Text style={{ color: theme.placeholder, marginTop: 4, textTransform: 'capitalize' }}>
        Status: {item.orderStatus}
      </Text>
    </View>
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
      <Text style={[styles.title, { color: theme.text }]}>{customer.name}'s Orders</Text>

      <FlatList
        data={orders}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 40 }}
        ListEmptyComponent={
          <Text style={{ color: theme.placeholder, textAlign: 'center', marginTop: 30 }}>
            This customer has no orders yet
          </Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
  card: { borderWidth: 1, borderRadius: 10, padding: 12, marginBottom: 10 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between' },
  orderId: { fontWeight: 'bold', fontSize: 15 },
  amount: { color: '#1E88E5', fontWeight: 'bold' },
});

export default CustomerOrders;