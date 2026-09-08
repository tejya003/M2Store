import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { useTheme } from '../../context/ThemeContext';
import { getCustomerOrders } from '../../api/customerApi';

// तुमच्या दुकानाचं location (backend मधल्या utils/distance.js सारखंच)
const SHOP_LOCATION = {
  latitude: 16.69641589335331,
  longitude: 74.24761239962677,
};

const CustomerOrders = ({ route }) => {
  const { theme } = useTheme();
  const { customer } = route.params;

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null); // 👈 कोणतं order card उघडं आहे ते
  const [daysLoading, setDaysLoading] = useState(false); // 👈 map उघडल्यावर 5 sec calculating

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

  const toggleExpand = (id) => {
    setExpandedId((prev) => {
      const next = prev === id ? null : id;
      if (next) {
        setDaysLoading(true);
        setTimeout(() => setDaysLoading(false), 5000);
      }
      return next;
    });
  };

  const renderItem = ({ item }) => {
    const isExpanded = expandedId === item._id;
    const hasLocation = item.shippingAddress?.latitude && item.shippingAddress?.longitude;

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => toggleExpand(item._id)}
        style={[styles.card, { backgroundColor: theme.inputBackground, borderColor: theme.border }]}
      >
        <View style={styles.rowBetween}>
          <Text style={[styles.orderId, { color: theme.text }]}>#{item._id.slice(-6).toUpperCase()}</Text>
          <Text style={styles.amount}>₹{item.totalAmount}</Text>
        </View>
        <Text style={{ color: theme.placeholder, marginTop: 4, textTransform: 'capitalize' }}>
          Status: {item.orderStatus}
        </Text>

        {isExpanded && (
          <View style={styles.mapWrapper}>
            {hasLocation ? (
              <MapView
                style={styles.map}
                initialRegion={{
                  latitude: item.shippingAddress.latitude,
                  longitude: item.shippingAddress.longitude,
                  latitudeDelta: 0.05,
                  longitudeDelta: 0.05,
                }}
                scrollEnabled={true}
                zoomEnabled={true}
              >
                <Marker
                  coordinate={{
                    latitude: item.shippingAddress.latitude,
                    longitude: item.shippingAddress.longitude,
                  }}
                  title="Delivery Location"
                  description={item.shippingAddress?.addressLine}
                  pinColor="#1E88E5"
                />
                <Marker
                  coordinate={SHOP_LOCATION}
                  title="M2 Store"
                  pinColor="#43A047"
                />
                <Polyline
                  coordinates={[
                    SHOP_LOCATION,
                    { latitude: item.shippingAddress.latitude, longitude: item.shippingAddress.longitude },
                  ]}
                  strokeColor="#6C5CE7"
                  strokeWidth={2}
                />
              </MapView>
            ) : (
              <Text style={{ color: theme.placeholder, padding: 10, textAlign: 'center' }}>
                या order साठी location उपलब्ध नाही
              </Text>
            )}

            <View style={styles.daysBox}>
              {daysLoading ? (
                <View style={styles.daysLoadingRow}>
                  <ActivityIndicator size="small" color={theme.primary} />
                  <Text style={[styles.daysCalcText, { color: theme.placeholder }]}>
                    Days calculate होत आहेत...
                  </Text>
                </View>
              ) : item.expectedDeliveryDays ? (
                <Text style={{ color: theme.placeholder }}>
                  Expected Delivery: {item.expectedDeliveryDays} days
                </Text>
              ) : null}
            </View>
          </View>
        )}
      </TouchableOpacity>
    );
  };

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
  mapWrapper: { marginTop: 10, borderRadius: 10, overflow: 'hidden' },
  map: { width: '100%', height: 200 },
  daysBox: { marginTop: 8, alignItems: 'center' },
  daysLoadingRow: { flexDirection: 'row', alignItems: 'center' },
  daysCalcText: { marginLeft: 8, fontSize: 13 },
});

export default CustomerOrders;