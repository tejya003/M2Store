import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../context/ThemeContext';

const SavedAddresses = ({ navigation }) => {
  const { theme } = useTheme();
  
  const [addresses, setAddresses] = useState([]);
  const [primaryId, setPrimaryId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loadingPincode, setLoadingPincode] = useState(false);

  // Form State
  const [form, setForm] = useState({
    name: '',
    mobile: '',
    pincode: '',
    address: '',
    city: '',
    state: '',
  });

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    try {
      const stored = await AsyncStorage.getItem('user_addresses');
      const storedPrimary = await AsyncStorage.getItem('primary_address_id');
      if (stored) {
        const parsed = JSON.parse(stored);
        setAddresses(parsed);
        if (storedPrimary) {
          setPrimaryId(storedPrimary);
        } else if (parsed.length > 0) {
          setPrimaryId(parsed[0].id);
          await AsyncStorage.setItem('primary_address_id', parsed[0].id);
        }
      }
    } catch (e) {
      console.log('Error loading addresses', e);
    }
  };

  // 📍 Pincode टाकल्यावर City & State शोधणारे फंक्शन
  const fetchPincodeDetails = async (pin) => {
    setForm((prev) => ({ ...prev, pincode: pin }));

    if (pin.length === 6) {
      setLoadingPincode(true);
      try {
        const response = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
        const data = await response.json();

        if (data[0].Status === 'Success') {
          const postOffice = data[0].PostOffice[0];
          setForm((prev) => ({
            ...prev,
            city: postOffice.District,
            state: postOffice.State,
          }));
        } else {
          Alert.alert('Invalid PIN Code', 'कृपया योग्य ६ अंकी पिनकोड टाका.');
        }
      } catch (error) {
        console.log('Pincode API Error:', error);
      } finally {
        setLoadingPincode(false);
      }
    }
  };

  const handleSaveAddress = async () => {
    if (!form.name || !form.mobile || !form.pincode || !form.address || !form.city) {
      Alert.alert('Error', 'कृपया सर्व आवश्यक माहिती भरा.');
      return;
    }

    try {
      const newAddress = { id: Date.now().toString(), ...form };
      const updatedList = [...addresses, newAddress];
      
      setAddresses(updatedList);
      await AsyncStorage.setItem('user_addresses', JSON.stringify(updatedList));

      if (updatedList.length === 1) {
        setPrimaryId(newAddress.id);
        await AsyncStorage.setItem('primary_address_id', newAddress.id);
      }

      setForm({ name: '', mobile: '', pincode: '', address: '', city: '', state: '' });
      setShowForm(false);
      Keyboard.dismiss();
      Alert.alert('Success', 'पत्ता यशस्वीरीत्या सेव्ह झाला!');
    } catch (error) {
      console.log('Error saving address', error);
    }
  };

  const setPrimary = async (id) => {
    setPrimaryId(id);
    await AsyncStorage.setItem('primary_address_id', id);
  };

  const deleteAddress = (id) => {
    Alert.alert('Delete Address', 'हा पत्ता काढून टाकायचा आहे का?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          const updated = addresses.filter((item) => item.id !== id);
          setAddresses(updated);
          await AsyncStorage.setItem('user_addresses', JSON.stringify(updated));
          if (primaryId === id && updated.length > 0) {
            setPrimary(updated[0].id);
          }
        },
      },
    ]);
  };

  const renderAddressCard = ({ item }) => {
    const isPrimary = item.id === primaryId;
    return (
      <View style={[styles.card, isPrimary && styles.primaryCard]}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardName}>{item.name}</Text>
          {isPrimary && (
            <View style={styles.primaryBadge}>
              <Text style={styles.primaryText}>Primary Delivery</Text>
            </View>
          )}
        </View>

        <Text style={styles.cardAddress}>{item.address}, {item.city}, {item.state} - {item.pincode}</Text>
        <Text style={styles.cardMobile}>Mobile: {item.mobile}</Text>

        <View style={styles.actionsRow}>
          {!isPrimary && (
            <TouchableOpacity style={styles.setPrimaryBtn} onPress={() => setPrimary(item.id)}>
              <Text style={styles.setPrimaryText}>Set as Primary</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.deleteBtn} onPress={() => deleteAddress(item.id)}>
            <Text style={styles.deleteText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.screen, { backgroundColor: theme.background || '#F5F5F7' }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Saved Addresses</Text>
      </View>

      <FlatList
        data={addresses}
        keyExtractor={(item) => item.id}
        renderItem={renderAddressCard}
        contentContainerStyle={{ padding: 15 }}
        ListHeaderComponent={
          <View>
            <TouchableOpacity
              style={styles.toggleFormBtn}
              onPress={() => setShowForm(!showForm)}
            >
              <Text style={styles.toggleFormBtnText}>
                {showForm ? '━ Hide Form' : '➕ Add New Address'}
              </Text>
            </TouchableOpacity>

            {showForm && (
              <View style={styles.formCard}>
                <Text style={styles.formTitle}>Enter New Address Details</Text>
                
                <TextInput
                  style={styles.input}
                  placeholder="Full Name *"
                  value={form.name}
                  onChangeText={(txt) => setForm({ ...form, name: txt })}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Mobile Number *"
                  keyboardType="numeric"
                  maxLength={10}
                  value={form.mobile}
                  onChangeText={(txt) => setForm({ ...form, mobile: txt })}
                />
                
                {/* 📍 PIN Code Input with Auto-Fetch */}
                <View style={{ position: 'relative' }}>
                  <TextInput
                    style={styles.input}
                    placeholder="Pincode (उदा. 416001) *"
                    keyboardType="numeric"
                    maxLength={6}
                    value={form.pincode}
                    onChangeText={fetchPincodeDetails}
                  />
                  {loadingPincode && (
                    <ActivityIndicator style={{ position: 'absolute', right: 12, top: 10 }} color="#6C5CE7" />
                  )}
                </View>

                <TextInput
                  style={[styles.input, { height: 60 }]}
                  placeholder="Flat, House No., Building, Street *"
                  multiline
                  value={form.address}
                  onChangeText={(txt) => setForm({ ...form, address: txt })}
                />
                
                {/* Auto Filled City and State */}
                <TextInput
                  style={[styles.input, { backgroundColor: '#EFEFEF' }]}
                  placeholder="City / District *"
                  value={form.city}
                  editable={false}
                />
                <TextInput
                  style={[styles.input, { backgroundColor: '#EFEFEF' }]}
                  placeholder="State *"
                  value={form.state}
                  editable={false}
                />

                <TouchableOpacity style={styles.saveBtn} onPress={handleSaveAddress}>
                  <Text style={styles.saveBtnText}>Save Address</Text>
                </TouchableOpacity>
              </View>
            )}

            <Text style={styles.sectionTitle}>Your Saved Addresses</Text>
          </View>
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>कोणताही पत्ता जोडलेला नाही. वर क्लिक करून नवीन पत्ता जोडा!</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, paddingTop: 40 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, paddingBottom: 10 },
  backText: { fontSize: 16, color: '#6C5CE7', fontWeight: 'bold', marginRight: 15 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#222' },

  toggleFormBtn: { backgroundColor: '#6C5CE7', paddingVertical: 12, borderRadius: 10, alignItems: 'center', marginBottom: 15 },
  toggleFormBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },

  formCard: { backgroundColor: '#fff', padding: 15, borderRadius: 12, marginBottom: 20, elevation: 2 },
  formTitle: { fontSize: 15, fontWeight: 'bold', color: '#222', marginBottom: 10 },
  input: { backgroundColor: '#F9F9F9', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, borderWidth: 1, borderColor: '#DDD', fontSize: 13, marginBottom: 10 },
  saveBtn: { backgroundColor: '#43A047', borderRadius: 8, paddingVertical: 12, alignItems: 'center', marginTop: 5 },
  saveBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },

  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#222', marginBottom: 12 },

  card: { backgroundColor: '#fff', borderRadius: 10, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: '#eee' },
  primaryCard: { borderColor: '#6C5CE7', borderWidth: 1.5, backgroundColor: '#F9F8FF' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  cardName: { fontSize: 15, fontWeight: 'bold', color: '#222' },
  primaryBadge: { backgroundColor: '#E0DBFF', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 5 },
  primaryText: { color: '#6C5CE7', fontSize: 11, fontWeight: 'bold' },
  cardAddress: { color: '#555', fontSize: 13, lineHeight: 18 },
  cardMobile: { color: '#777', fontSize: 12, marginTop: 4 },

  actionsRow: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10, gap: 15 },
  setPrimaryBtn: { paddingVertical: 4 },
  setPrimaryText: { color: '#6C5CE7', fontWeight: 'bold', fontSize: 13 },
  deleteBtn: { paddingVertical: 4 },
  deleteText: { color: '#E53935', fontSize: 13 },

  emptyText: { textAlign: 'center', marginTop: 20, color: '#888', fontSize: 13 },
});

export default SavedAddresses;