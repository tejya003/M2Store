import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Modal,
  FlatList,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { registerDeliveryPartner } from '../../api/authApi';

// routeConfig.js मधल्या cities वरून बनवलेली यादी (Display नावं)
const CITIES = [
  'Kolhapur', 'Ichalkaranji', 'Gadhinglaj',
  'Sangli', 'Miraj', 'Solapur', 'Pandharpur', 'Osmanabad', 'Latur',
  'Satara', 'Karad', 'Pune', 'Pimpri-Chinchwad', 'Ahmednagar',
  'Ratnagiri', 'Sindhudurg', 'Kudal', 'Raigad', 'Alibaug',
  'Mumbai', 'Thane', 'Navi Mumbai', 'Palghar',
  'Nashik', 'Dhule', 'Nandurbar', 'Jalgaon',
  'Aurangabad', 'Jalna', 'Beed', 'Parbhani', 'Hingoli', 'Nanded',
  'Buldhana', 'Akola', 'Washim', 'Amravati', 'Yavatmal', 'Wardha',
  'Nagpur', 'Bhandara', 'Gondia', 'Chandrapur', 'Gadchiroli',
];

const VEHICLE_TYPES = ['Bike', 'Electric Scooty', 'Auto', 'Other'];

const DeliveryPartnerRegister = ({ navigation }) => {
  const { theme } = useTheme();
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [city, setCity] = useState('');
  const [aadharNumber, setAadharNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const [cityModalVisible, setCityModalVisible] = useState(false);
  const [vehicleModalVisible, setVehicleModalVisible] = useState(false);

  const handleSubmit = async () => {
    if (!name || !username || !email || !mobile || !password || !vehicleType || !vehicleNumber || !city || !aadharNumber) {
      Alert.alert('Error', 'सगळी माहिती भरा');
      return;
    }

    setLoading(true);
    try {
      const res = await registerDeliveryPartner({
        name, username, email, mobile, password,
        vehicleType, vehicleNumber, city, aadharNumber,
      });
      Alert.alert('झालं', res.message, [
        { text: 'ठीक आहे', onPress: () => navigation.navigate('Login') }
      ]);
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = [
    styles.input,
    { backgroundColor: theme.inputBackground, color: theme.inputText, borderColor: theme.border }
  ];

  const dropdownStyle = [
    styles.input,
    styles.dropdown,
    { backgroundColor: theme.inputBackground, borderColor: theme.border }
  ];

  return (
    <ScrollView style={{ backgroundColor: theme.background }} contentContainerStyle={{ padding: 20 }}>
      <Text style={[styles.title, { color: theme.text }]}>Delivery Partner अर्ज</Text>

      <TextInput placeholder="पूर्ण नाव" placeholderTextColor={theme.placeholder} style={inputStyle} value={name} onChangeText={setName} />
      <TextInput placeholder="Username" placeholderTextColor={theme.placeholder} style={inputStyle} value={username} onChangeText={setUsername} autoCapitalize="none" />
      <TextInput placeholder="Email" placeholderTextColor={theme.placeholder} style={inputStyle} value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
      <TextInput placeholder="Mobile नंबर" placeholderTextColor={theme.placeholder} style={inputStyle} value={mobile} onChangeText={setMobile} keyboardType="phone-pad" />
      <TextInput placeholder="Password" placeholderTextColor={theme.placeholder} style={inputStyle} value={password} onChangeText={setPassword} secureTextEntry />

      {/* City Dropdown */}
      <TouchableOpacity style={dropdownStyle} onPress={() => setCityModalVisible(true)}>
        <Text style={{ color: city ? theme.inputText : theme.placeholder }}>
          {city || 'तुमची City / Hub निवडा'}
        </Text>
      </TouchableOpacity>

      {/* Vehicle Type Dropdown */}
      <TouchableOpacity style={dropdownStyle} onPress={() => setVehicleModalVisible(true)}>
        <Text style={{ color: vehicleType ? theme.inputText : theme.placeholder }}>
          {vehicleType || 'वाहन प्रकार निवडा'}
        </Text>
      </TouchableOpacity>

      <TextInput placeholder="वाहन क्रमांक" placeholderTextColor={theme.placeholder} style={inputStyle} value={vehicleNumber} onChangeText={setVehicleNumber} autoCapitalize="characters" />

      <TextInput placeholder="Aadhar कार्ड नंबर" placeholderTextColor={theme.placeholder} style={inputStyle} value={aadharNumber} onChangeText={setAadharNumber} keyboardType="number-pad" maxLength={12} />

      <TouchableOpacity
        style={[styles.submitBtn, { backgroundColor: theme.primary }]}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitBtnText}>अर्ज सादर करा</Text>}
      </TouchableOpacity>

      {/* ============ CITY MODAL ============ */}
      <Modal visible={cityModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.background }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>City निवडा</Text>
            <FlatList
              data={CITIES}
              keyExtractor={(item) => item}
              style={{ maxHeight: 400 }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => {
                    setCity(item);
                    setCityModalVisible(false);
                  }}
                >
                  <Text style={{ color: theme.text, fontSize: 15 }}>{item}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setCityModalVisible(false)}>
              <Text style={{ color: theme.primary, fontWeight: 'bold' }}>बंद करा</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ============ VEHICLE TYPE MODAL ============ */}
      <Modal visible={vehicleModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.background }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>वाहन प्रकार निवडा</Text>
            <FlatList
              data={VEHICLE_TYPES}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => {
                    setVehicleType(item);
                    setVehicleModalVisible(false);
                  }}
                >
                  <Text style={{ color: theme.text, fontSize: 15 }}>{item}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setVehicleModalVisible(false)}>
              <Text style={{ color: theme.primary, fontWeight: 'bold' }}>बंद करा</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  input: { borderWidth: 1, borderRadius: 8, padding: 12, marginBottom: 12 },
  dropdown: { justifyContent: 'center' },
  submitBtn: { padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 8 },
  submitBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
    maxHeight: '70%',
  },
  modalTitle: { fontSize: 17, fontWeight: 'bold', marginBottom: 12, textAlign: 'center' },
  modalItem: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalCloseBtn: {
    marginTop: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
});

export default DeliveryPartnerRegister;