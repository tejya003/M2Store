import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  Image,
} from 'react-native';
import { getDashboardStats } from '../../api/adminApi';
import { getAllOrders } from '../../api/orderApi';

const STATUS_COLORS = {
  pending: { bg: '#FFF3E0', text: '#F57C00' },
  confirmed: { bg: '#E3F2FD', text: '#1E88E5' },
  shipped: { bg: '#F3E5F5', text: '#8E24AA' },
  delivered: { bg: '#E8F5E9', text: '#43A047' },
  cancelled: { bg: '#FFEBEE', text: '#E53935' },
};

const AdminDashboard = ({ navigation }) => {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      const statsData = await getDashboardStats();
      setStats(statsData);

      const orders = await getAllOrders();
      setRecentOrders(orders.slice(0, 5));
    } catch (error) {
      console.log('Dashboard load error:', error.message);
    }
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      await loadData();
      setLoading(false);
    })();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#1E88E5" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={{ paddingBottom: 30 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Purple Header */}
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome back,</Text>
        <Text style={styles.adminText}>Admin 👋</Text>

        <View style={styles.storeCard}>
          <Image
            source={require('../../assets/logo.png')}
            style={styles.watermarkLogo}
            resizeMode="contain"
          />
          <Image
            source={require('../../assets/logo.png')}
            style={styles.storeIconImage}
            resizeMode="contain"
          />
          <View>
            <Text style={styles.storeName}>M2 Store</Text>
            <Text style={styles.storeSub}>Admin Panel</Text>
          </View>
        </View>
      </View>

      {/* Overview */}
      <View style={styles.body}>
        <Text style={styles.sectionTitle}>Overview</Text>

        <View style={styles.cardRow}>
          <TouchableOpacity
            style={[styles.card, { backgroundColor: '#EDE7F6' }]}
            onPress={() => navigation.navigate('Products')}
          >
            <Text style={styles.cardIcon}>📦</Text>
            <Text style={styles.cardValue}>{stats?.totalProducts ?? 0}</Text>
            <Text style={styles.cardLabel}>Total Products</Text>
            <Text style={styles.viewAll}>View all →</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.card, { backgroundColor: '#E8F5E9' }]}
            onPress={() => navigation.navigate('Users')}
          >
            <Text style={styles.cardIcon}>👥</Text>
            <Text style={styles.cardValue}>{stats?.totalUsers ?? 0}</Text>
            <Text style={styles.cardLabel}>Total Users</Text>
            <Text style={[styles.viewAll, { color: '#43A047' }]}>View all →</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.cardRow}>
          <TouchableOpacity
            style={[styles.card, { backgroundColor: '#FFF3E0' }]}
            onPress={() => navigation.navigate('Orders')}
          >
            <Text style={styles.cardIcon}>🛒</Text>
            <Text style={styles.cardValue}>{stats?.totalOrders ?? 0}</Text>
            <Text style={styles.cardLabel}>Total Orders</Text>
            <Text style={[styles.viewAll, { color: '#F57C00' }]}>View all →</Text>
          </TouchableOpacity>

          <View style={[styles.card, { backgroundColor: '#E3F2FD' }]}>
            <Text style={styles.cardIcon}>💲</Text>
            <Text style={styles.cardValue}>₹{stats?.totalSales ?? 0}</Text>
            <Text style={styles.cardLabel}>Total Sales</Text>
          </View>
        </View>

        {/* Recent Orders */}
        <View style={styles.recentHeader}>
          <Text style={styles.sectionTitle}>Recent Orders</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Orders')}>
            <Text style={styles.viewAllLink}>View all</Text>
          </TouchableOpacity>
        </View>

        {recentOrders.length === 0 ? (
          <Text style={styles.emptyText}>No orders yet</Text>
        ) : (
          recentOrders.map((order) => {
            const colors = STATUS_COLORS[order.orderStatus] || { bg: '#eee', text: '#555' };
            return (
              <View key={order._id} style={styles.orderRow}>
                <View style={styles.orderIconBox}>
                  <Text>🛍️</Text>
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={styles.orderId}>#{order._id.slice(-6).toUpperCase()}</Text>
                  <Text style={styles.orderCustomer}>{order.user?.name || 'Unknown'}</Text>
                </View>

                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.orderAmount}>₹{order.totalAmount}</Text>
                  <View style={[styles.statusPill, { backgroundColor: colors.bg }]}>
                    <Text style={[styles.statusPillText, { color: colors.text }]}>
                      {order.orderStatus}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F5F5F7' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  header: { backgroundColor: '#6C5CE7', paddingTop: 50, paddingHorizontal: 20, paddingBottom: 30, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  welcomeText: { color: '#E0DFFF', fontSize: 14 },
  adminText: { color: '#fff', fontSize: 22, fontWeight: 'bold', marginTop: 2, marginBottom: 18 },

  storeCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: 12, overflow: 'hidden', position: 'relative' },
  watermarkLogo: { position: 'absolute', right: -10, top: -10, width: 90, height: 90, opacity: 0.15 },
  storeIconImage: { width: 34, height: 34, marginRight: 12 },
  storeIcon: { fontSize: 22, marginRight: 12 },
  storeName: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  storeSub: { color: '#E0DFFF', fontSize: 12 },

  body: { padding: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#222', marginBottom: 12 },

  cardRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 14 },
  card: { flex: 1, marginHorizontal: 5, borderRadius: 14, padding: 16 },
  cardIcon: { fontSize: 22, marginBottom: 8 },
  cardValue: { fontSize: 24, fontWeight: 'bold', color: '#222' },
  cardLabel: { fontSize: 12, color: '#555', marginTop: 2 },
  viewAll: { fontSize: 12, color: '#7C4DFF', marginTop: 10, fontWeight: '600' },

  recentHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, marginBottom: 8 },
  viewAllLink: { color: '#7C4DFF', fontWeight: '600', fontSize: 13 },

  orderRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, padding: 12, marginBottom: 10 },
  orderIconBox: { width: 38, height: 38, borderRadius: 10, backgroundColor: '#F0EEFF', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  orderId: { fontWeight: 'bold', fontSize: 14, color: '#222' },
  orderCustomer: { fontSize: 12, color: '#777', marginTop: 2 },
  orderAmount: { fontWeight: 'bold', fontSize: 14, color: '#222' },
  statusPill: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10, marginTop: 4 },
  statusPillText: { fontSize: 10, fontWeight: '600', textTransform: 'capitalize' },

  emptyText: { textAlign: 'center', color: '#999', marginVertical: 20 },
});

export default AdminDashboard;