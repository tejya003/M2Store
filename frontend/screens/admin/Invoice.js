import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
  Linking,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import Barcode from 'react-native-barcode-svg';

const SHOP_NAME = 'M2 Store';
const SHOP_ADDRESS = 'Mahalaxmi Pride, Rajarampuri Lane 6, Takala Side, Kolhapur, Maharashtra 416008';

// तुमचा tracking base URL इथे टाका
const TRACK_BASE_URL = 'https://m2store.example.com/order';

// 👇 तुमचा backend server root — emulator: 10.0.2.2, खरा फोन: laptop चा wifi IP
const SERVER_ROOT = 'https://m2store-backend.onrender.com';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const RECEIPT_WIDTH = Math.min(SCREEN_WIDTH - 32, 384);

const Invoice = ({ route, navigation }) => {
  const { order } = route.params;

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return (
      d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) +
      ', ' +
      d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    );
  };

  const orderIdShort = order._id.slice(-6).toUpperCase();
  const trackingUrl = `${TRACK_BASE_URL}/${order._id}`;

  // Print/Download — backend च्या खऱ्या HTTP URL ला Chrome मध्ये उघडतो
  const handlePrintOrShare = async () => {
    try {
      const invoiceUrl = `${SERVER_ROOT}/api/orders/${order._id}/invoice-html`;
      await Linking.openURL(invoiceUrl);
    } catch (error) {
      Alert.alert('Error', 'Invoice उघडताना अडचण आली: ' + error.message);
    }
  };

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Invoice</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={[styles.receipt, { width: RECEIPT_WIDTH }]}>
          <View style={styles.shopBlock}>
            <Text style={styles.shopName}>{SHOP_NAME}</Text>
            <Text style={styles.shopAddress}>{SHOP_ADDRESS}</Text>
          </View>

          <View style={styles.orderTagWrap}>
            <View style={styles.orderTag}>
              <Text style={styles.orderTagText}>ORDER #{orderIdShort}</Text>
            </View>
          </View>

          <View style={styles.block}>
            <Text style={styles.blockTitle}>customer</Text>
            <View style={styles.row}>
              <Text style={styles.k}>Name</Text>
              <Text style={styles.v} numberOfLines={1}>
                {order.shippingAddress?.fullName || order.user?.name}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.k}>Mobile</Text>
              <Text style={styles.v}>{order.shippingAddress?.mobile}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.k}>Address</Text>
              <Text style={styles.v} numberOfLines={2}>
                {order.shippingAddress?.addressLine}, {order.shippingAddress?.city} - {order.shippingAddress?.pincode}
              </Text>
            </View>
          </View>

          <View style={styles.block}>
            <Text style={styles.blockTitle}>order</Text>
            <View style={styles.row}>
              <Text style={styles.k}>Date</Text>
              <Text style={styles.v}>{formatDate(order.createdAt)}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.k}>Status</Text>
              <Text style={styles.v}>{order.orderStatus}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.k}>Delivery</Text>
              <Text style={styles.v}>
                {order.expectedDeliveryDays ? `${order.expectedDeliveryDays} days` : '—'}
              </Text>
            </View>
          </View>

          <View style={styles.block}>
            <Text style={styles.blockTitle}>items</Text>
            {order.items.map((item, index) => (
              <View key={index} style={styles.row}>
                <Text style={styles.k} numberOfLines={1}>
                  {item.name} × {item.quantity}
                </Text>
                <Text style={styles.v}>₹{item.price * item.quantity}</Text>
              </View>
            ))}
          </View>

          <View style={styles.divider} />

          <View style={[styles.row, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>₹{order.totalAmount}</Text>
          </View>

          <View style={styles.codesBlock}>
            <View style={styles.codeItem}>
              <View style={styles.qrWrap}>
                <QRCode value={trackingUrl} size={110} color="#000000" backgroundColor="#ffffff" />
              </View>
              <Text style={styles.codeLabel}>SCAN TO TRACK ORDER</Text>
            </View>

            <View style={styles.codeItem}>
              <Barcode
                value={orderIdShort}
                format="CODE128"
                height={50}
                singleBarWidth={1.5}
                lineColor="#000000"
                backgroundColor="transparent"
              />
              <Text style={styles.codeLabel}>ORDER #{orderIdShort}</Text>
            </View>
          </View>

          <Text style={styles.footer}>Thank you for shopping with {SHOP_NAME}</Text>
        </View>

        <TouchableOpacity style={styles.printButton} onPress={handlePrintOrShare}>
          <Text style={styles.printButtonText}>🖨️ Print / Download Invoice</Text>
        </TouchableOpacity>

        <Text style={styles.helperText}>
          Chrome मध्ये उघडेल — आपोआप Print dialog उघडेल, तिथे "Save as PDF" निवडून डाउनलोड करा
        </Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#e9e7df', paddingTop: 40 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, paddingBottom: 10 },
  backText: { fontSize: 16, color: '#000000', fontWeight: 'bold', marginRight: 15 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#000000' },
  scrollContainer: { alignItems: 'center', padding: 16, paddingBottom: 40 },

  receipt: {
    backgroundColor: '#fbfaf6',
    paddingVertical: 22,
    paddingHorizontal: 18,
    borderRadius: 2,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },

  shopBlock: {
    alignItems: 'center',
    paddingBottom: 14,
    marginBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    borderStyle: 'dashed',
  },
  shopName: { fontSize: 20, fontWeight: 'bold', color: '#000000', letterSpacing: 0.5 },
  shopAddress: { fontSize: 11, color: '#000000', textAlign: 'center', marginTop: 4, lineHeight: 16 },

  orderTagWrap: { alignItems: 'center', marginBottom: 14 },
  orderTag: {
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 2,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  orderTagText: { color: '#000000', fontWeight: 'bold', fontSize: 11 },

  block: { marginBottom: 14 },
  blockTitle: { fontSize: 10, color: '#000000', marginBottom: 6 },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  k: { color: '#000000', fontSize: 12.5, flexShrink: 1 },
  v: { color: '#000000', fontSize: 12.5, textAlign: 'right', maxWidth: '60%' },

  divider: {
    borderTopWidth: 1,
    borderTopColor: '#000000',
    borderStyle: 'dashed',
    marginVertical: 12,
  },

  totalRow: { marginBottom: 4 },
  totalLabel: { fontWeight: 'bold', fontSize: 14, color: '#000000' },
  totalValue: { fontWeight: 'bold', fontSize: 14, color: '#000000' },

  codesBlock: {
    alignItems: 'center',
    marginTop: 18,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#000000',
    borderStyle: 'dashed',
  },
  codeItem: { alignItems: 'center', marginBottom: 16 },
  qrWrap: { backgroundColor: '#fff', padding: 6 },
  codeLabel: { fontSize: 9.5, letterSpacing: 1, color: '#000000', marginTop: 6 },

  footer: { textAlign: 'center', marginTop: 4, fontSize: 10, color: '#000000' },

  printButton: {
    backgroundColor: '#43A047',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 30,
    alignItems: 'center',
    marginTop: 20,
  },
  printButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  helperText: { fontSize: 11, color: '#000000', textAlign: 'center', marginTop: 10, paddingHorizontal: 20 },
});

export default Invoice;