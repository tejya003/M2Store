import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  TextInput,
  Modal,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import MapView, { Marker } from 'react-native-maps';
import { getAllOrders, updateOrderStatus } from '../../api/orderApi';

const STATUS_TABS = ['All', 'Processing', 'Delivered', 'Cancelled'];

const isProcessing = (status) => ['pending', 'confirmed', 'shipped', 'out for delivery'].includes(status?.toLowerCase());

const STATUS_COLORS = {
  pending: { bg: '#FFF3E0', text: '#F57C00' },
  confirmed: { bg: '#E3F2FD', text: '#1E88E5' },
  shipped: { bg: '#F3E5F5', text: '#8E24AA' },
  'out for delivery': { bg: '#FFF9C4', text: '#F9A825' },
  delivered: { bg: '#E8F5E9', text: '#43A047' },
  cancelled: { bg: '#FFEBEE', text: '#E53935' },
};

// तुमच्या दुकानाचं location (backend मधल्या utils/distance.js सारखंच)
const SHOP_LOCATION = {
  latitude: 16.69641589335331,
  longitude: 74.24761239962677,
};

const OrdersList = ({ navigation }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Action menu modal साठी state (Alert.alert च्या ऐवजी)
  const [showActionMenu, setShowActionMenu] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Confirm झाल्यावर दाखवायचा Map + Days popup साठी state
  const [showMapModal, setShowMapModal] = useState(false);
  const [mapOrder, setMapOrder] = useState(null);
  const [daysLoading, setDaysLoading] = useState(true);

  const loadOrders = async () => {
    try {
      const data = await getAllOrders();
      setOrders(data);
    } catch (error) {
      Alert.alert('Error', error.message || 'ऑर्डर्स लोड करताना अडचण आली.');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      loadOrders();
    }, [])
  );

  const handleStatusChange = (id, newStatus, order) => {
    Alert.alert('Update Status', `ही ऑर्डर '${newStatus}' म्हणून मार्क करायची का?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Confirm',
        onPress: async () => {
          try {
            await updateOrderStatus(id, newStatus);
            const updatedOrder = { ...order, orderStatus: newStatus };
            setOrders((prev) =>
              prev.map((o) => (o._id === id ? updatedOrder : o))
            );

            if (newStatus === 'confirmed') {
              // Success Alert ऐवजी Map + Days popup दाखवा
              setMapOrder(updatedOrder);
              setDaysLoading(true);
              setShowMapModal(true);
              setTimeout(() => setDaysLoading(false), 5000);
            } else {
              Alert.alert('Success', `ऑर्डर स्टेटस '${newStatus}' वर अपडेट झाला.`);
            }
          } catch (error) {
            Alert.alert('Error', error.message || 'स्टेटस अपडेट झाला नाही.');
          }
        },
      },
    ]);
  };

  const openStatusMenu = (order) => {
    setSelectedOrder(order);
    setShowActionMenu(true);
  };

  const handleMenuAction = (action) => {
    setShowActionMenu(false);
    const order = selectedOrder;

    if (action === 'print') {
      navigation.navigate('Invoice', { order });
    } else if (action === 'close') {
      // काही नाही, फक्त बंद कर
    } else {
      handleStatusChange(order._id, action, order);
    }
  };

  const filteredOrders = orders.filter((o) => {
    let matchesTab = true;
    const currentStatus = o.orderStatus?.toLowerCase();

    if (activeTab === 'Processing') matchesTab = isProcessing(currentStatus);
    else if (activeTab === 'Delivered') matchesTab = currentStatus === 'delivered';
    else if (activeTab === 'Cancelled') matchesTab = currentStatus === 'cancelled';

    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      query === '' ||
      o._id.toLowerCase().includes(query) ||
      (o.user?.name || '').toLowerCase().includes(query);

    return matchesTab && matchesSearch;
  });

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return (
      d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) +
      ', ' +
      d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    );
  };

  const renderItem = ({ item }) => {
    const statusKey = item.orderStatus?.toLowerCase() || 'pending';
    const colors = STATUS_COLORS[statusKey] || { bg: '#eee', text: '#555' };

    return (
      <TouchableOpacity style={styles.card} onPress={() => openStatusMenu(item)}>
        <View style={styles.iconBox}>
          <Text style={{ fontSize: 18 }}>🛍️</Text>
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.orderId}>#{item._id.slice(-6).toUpperCase()}</Text>
          <Text style={styles.date}>{formatDate(item.createdAt)}</Text>
          <Text style={styles.customer}>{item.user?.name || 'Unknown User'}</Text>
        </View>

        <View style={{ alignItems: 'flex-end' }}>
          <Text style={styles.amount}>₹{item.totalAmount}</Text>
          <View style={[styles.statusPill, { backgroundColor: colors.bg }]}>
            <Text style={[styles.statusText, { color: colors.text }]}>{item.orderStatus}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const mapHasLocation = mapOrder?.shippingAddress?.latitude && mapOrder?.shippingAddress?.longitude;

  return (
    <View style={styles.screen}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Orders List</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={() => setShowSearch((prev) => !prev)}>
            <Text style={styles.headerIcon}>🔍</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              Alert.alert(
                'Help',
                'ऑर्डरचा स्टेटस बदलण्यासाठी ऑर्डर कार्डवर क्लिक करा. फिल्टर करण्यासाठी टॅब्स वापरा.'
              )
            }
          >
            <Text style={styles.headerIcon}>❓</Text>
          </TouchableOpacity>
        </View>
      </View>

      {showSearch && (
        <TextInput
          placeholder="Search by order ID or customer..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchInput}
          placeholderTextColor="#999"
          autoFocus
        />
      )}

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsRow}>
        {STATUS_TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {loading ? (
        <ActivityIndicator size="large" color="#7C4DFF" style={{ marginTop: 30 }} />
      ) : (
        <FlatList
          data={filteredOrders}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 40 }}
          ListEmptyComponent={<Text style={styles.emptyText}>कोणतीही ऑर्डर सापडली नाही 📦</Text>}
        />
      )}

      {/* Action Menu Modal — Alert.alert च्या ऐवजी (Android वर max 3 buttons मर्यादा टाळण्यासाठी) */}
      <Modal visible={showActionMenu} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowActionMenu(false)}
        >
          <View style={styles.actionMenuBox}>
            <Text style={styles.actionMenuTitle}>
              Order #{selectedOrder?._id?.slice(-6).toUpperCase()}
            </Text>

            <TouchableOpacity style={styles.actionItem} onPress={() => handleMenuAction('confirmed')}>
              <Text style={styles.actionItemText}>✅ Confirmed</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionItem} onPress={() => handleMenuAction('shipped')}>
              <Text style={styles.actionItemText}>📦 Shipped</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionItem} onPress={() => handleMenuAction('out for delivery')}>
              <Text style={styles.actionItemText}>🚚 Out for Delivery</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionItem} onPress={() => handleMenuAction('delivered')}>
              <Text style={styles.actionItemText}>🏠 Delivered</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionItem} onPress={() => handleMenuAction('cancelled')}>
              <Text style={[styles.actionItemText, { color: '#E53935' }]}>❌ Cancelled</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionItem} onPress={() => handleMenuAction('print')}>
              <Text style={[styles.actionItemText, { color: '#43A047', fontWeight: 'bold' }]}>🖨️ Print Invoice</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionItem, { borderBottomWidth: 0, marginTop: 5 }]}
              onPress={() => setShowActionMenu(false)}
            >
              <Text style={[styles.actionItemText, { color: '#999', textAlign: 'center' }]}>Close</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Confirm झाल्यावरचा Map + Days Modal */}
      <Modal visible={showMapModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.mapModalBox}>
            <Text style={styles.modalTitle}>
              Order #{mapOrder?._id?.slice(-6).toUpperCase()} Confirmed
            </Text>

            {mapHasLocation ? (
              <MapView
                style={styles.mapModalMap}
                initialRegion={{
                  latitude: mapOrder.shippingAddress.latitude,
                  longitude: mapOrder.shippingAddress.longitude,
                  latitudeDelta: 0.05,
                  longitudeDelta: 0.05,
                }}
              >
                <Marker
                  coordinate={{
                    latitude: mapOrder.shippingAddress.latitude,
                    longitude: mapOrder.shippingAddress.longitude,
                  }}
                  title="Delivery Location"
                  pinColor="#1E88E5"
                />
                <Marker coordinate={SHOP_LOCATION} title="M2 Store" pinColor="#43A047" />
              </MapView>
            ) : (
              <Text style={styles.noLocationText}>या order साठी location उपलब्ध नाही</Text>
            )}

            <View style={styles.daysBox}>
              {daysLoading ? (
                <View style={styles.daysLoadingRow}>
                  <ActivityIndicator size="small" color="#7C4DFF" />
                  <Text style={styles.daysCalcText}>Days calculate होत आहेत...</Text>
                </View>
              ) : (
                <Text style={styles.daysResultText}>
                  Expected Delivery: {mapOrder?.expectedDeliveryDays || '-'} days
                </Text>
              )}
            </View>

            <TouchableOpacity
              style={styles.mapModalCloseBtn}
              onPress={() => setShowMapModal(false)}
            >
              <Text style={styles.mapModalCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F5F5F7', padding: 15, paddingTop: 50 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  headerIcons: { flexDirection: 'row' },
  headerIcon: { fontSize: 18, marginLeft: 14 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#222' },
  searchInput: { backgroundColor: '#fff', borderRadius: 10, paddingHorizontal: 12, height: 44, marginBottom: 12, borderWidth: 1, borderColor: '#eee', fontSize: 14, color: '#222' },

  tabsRow: { marginBottom: 15, maxHeight: 40 },
  tab: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, backgroundColor: '#fff', marginRight: 8, borderWidth: 1, borderColor: '#eee' },
  activeTab: { backgroundColor: '#7C4DFF', borderColor: '#7C4DFF' },
  tabText: { color: '#555', fontSize: 13, textTransform: 'capitalize' },
  activeTabText: { color: '#fff', fontWeight: '600' },

  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, padding: 12, marginBottom: 10, borderWidth: 1, borderColor: '#EEE' },
  iconBox: { width: 40, height: 40, borderRadius: 10, backgroundColor: '#F0EEFF', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  orderId: { fontWeight: 'bold', fontSize: 14, color: '#222' },
  date: { fontSize: 11, color: '#999', marginTop: 2 },
  customer: { fontSize: 12, color: '#666', marginTop: 2 },
  amount: { fontWeight: 'bold', fontSize: 14, color: '#222' },
  statusPill: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10, marginTop: 6 },
  statusText: { fontSize: 10, fontWeight: '600', textTransform: 'capitalize' },

  emptyText: { textAlign: 'center', color: '#999', marginTop: 30 },

  // Modal styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalTitle: { fontSize: 15, fontWeight: 'bold', color: '#222', textAlign: 'center', marginBottom: 10 },

  // Action Menu styles
  actionMenuBox: { backgroundColor: '#fff', borderRadius: 14, padding: 10, width: '80%' },
  actionMenuTitle: { fontSize: 15, fontWeight: 'bold', color: '#222', textAlign: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#eee' },
  actionItem: { paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#f5f5f5' },
  actionItemText: { fontSize: 15, color: '#333', textAlign: 'center' },

  // Map + Days Modal styles
  mapModalBox: { backgroundColor: '#fff', borderRadius: 14, padding: 15, width: '88%' },
  mapModalMap: { width: '100%', height: 200, borderRadius: 10, marginBottom: 10 },
  noLocationText: { color: '#999', textAlign: 'center', padding: 20 },
  daysBox: { marginBottom: 12, alignItems: 'center' },
  daysLoadingRow: { flexDirection: 'row', alignItems: 'center' },
  daysCalcText: { marginLeft: 8, color: '#555', fontSize: 13 },
  daysResultText: { fontSize: 15, fontWeight: '600', color: '#1E88E5' },
  mapModalCloseBtn: { backgroundColor: '#7C4DFF', borderRadius: 8, paddingVertical: 10, alignItems: 'center' },
  mapModalCloseText: { color: '#fff', fontWeight: '600' },
});

export default OrdersList