import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  Alert, ActivityIndicator, RefreshControl
} from 'react-native';
import { getDeliveryPartners, toggleBlockPartner } from '../../api/adminDeliveryApi';

const DeliveryPartnersList = () => {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadPartners = useCallback(async () => {
    try {
      const data = await getDeliveryPartners();
      setPartners(data);
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadPartners();
  }, [loadPartners]);

  const handleToggle = (partner) => {
    const action = partner.isBlocked ? 'unblock' : 'block';
    Alert.alert(
      'खात्री करा',
      `${partner.name} ला ${action} करायचं का?`,
      [
        { text: 'रद्द करा', style: 'cancel' },
        {
          text: 'हो',
          onPress: async () => {
            try {
              const res = await toggleBlockPartner(partner._id);
              setPartners((prev) =>
                prev.map((p) =>
                  p._id === partner._id ? { ...p, isBlocked: res.isBlocked } : p
                )
              );
            } catch (err) {
              Alert.alert('Error', err.message);
            }
          }
        }
      ]
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.line}>📞 {item.mobile}</Text>
        <Text style={styles.line}>📍 {item.city}</Text>
        <Text style={styles.line}>🏍️ {item.vehicleType} — {item.vehicleNumber}</Text>
        <Text style={[styles.status, item.isBlocked ? styles.blocked : styles.active]}>
          {item.isBlocked ? 'Blocked' : 'Active'}
        </Text>
      </View>
      <TouchableOpacity
        style={[styles.btn, item.isBlocked ? styles.unblockBtn : styles.blockBtn]}
        onPress={() => handleToggle(item)}
      >
        <Text style={styles.btnText}>{item.isBlocked ? 'Unblock' : 'Block'}</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1d4ed8" />
      </View>
    );
  }

  return (
    <FlatList
      style={styles.container}
      data={partners}
      keyExtractor={(item) => item._id}
      renderItem={renderItem}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => { setRefreshing(true); loadPartners(); }}
        />
      }
      ListEmptyComponent={<Text style={styles.empty}>अजून कुणीही delivery partner नाही</Text>}
      contentContainerStyle={{ padding: 12 }}
    />
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: {
    backgroundColor: '#fff', borderRadius: 10, padding: 14, marginBottom: 10,
    flexDirection: 'row', alignItems: 'center', elevation: 2
  },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  line: { fontSize: 13, color: '#444', marginBottom: 2 },
  status: { fontSize: 12, fontWeight: 'bold', marginTop: 4 },
  active: { color: '#15803d' },
  blocked: { color: '#dc2626' },
  btn: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 6 },
  blockBtn: { backgroundColor: '#dc2626' },
  unblockBtn: { backgroundColor: '#15803d' },
  btnText: { color: '#fff', fontWeight: 'bold' },
  empty: { textAlign: 'center', marginTop: 40, color: '#666' }
});

export default DeliveryPartnersList;