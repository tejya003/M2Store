import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { registerDeliveryPartner } from '../../api/authApi';

const DeliveryPartnerRegister = ({ navigation }) => {
  const { theme } = useTheme();
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name || !username || !email || !mobile || !password || !vehicleType || !vehicleNumber) {
      Alert.alert('Error', 'सगळी माहिती भरा');
      return;
    }

    setLoading(true);
    try {
      const res = await registerDeliveryPartner(name, username, email, mobile, password, vehicleType, vehicleNumber);
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

  return (
    <ScrollView style={{ backgroundColor: theme.background }} contentContainerStyle={{ padding: 20 }}>
      <Text style={[styles.title, { color: theme.text }]}>Delivery Partner अर्ज</Text>

      <TextInput placeholder="पूर्ण नाव" placeholderTextColor={theme.placeholder} style={inputStyle} value={name} onChangeText={setName} />
      <TextInput placeholder="Username" placeholderTextColor={theme.placeholder} style={inputStyle} value={username} onChangeText={setUsername} autoCapitalize="none" />
      <TextInput placeholder="Email" placeholderTextColor={theme.placeholder} style={inputStyle} value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
      <TextInput placeholder="Mobile नंबर" placeholderTextColor={theme.placeholder} style={inputStyle} value={mobile} onChangeText={setMobile} keyboardType="phone-pad" />
      <TextInput placeholder="Password" placeholderTextColor={theme.placeholder} style={inputStyle} value={password} onChangeText={setPassword} secureTextEntry />
      <TextInput placeholder="वाहन प्रकार (उदा. Bike, Auto)" placeholderTextColor={theme.placeholder} style={inputStyle} value={vehicleType} onChangeText={setVehicleType} />
      <TextInput placeholder="वाहन क्रमांक" placeholderTextColor={theme.placeholder} style={inputStyle} value={vehicleNumber} onChangeText={setVehicleNumber} autoCapitalize="characters" />

      <TouchableOpacity
        style={[styles.submitBtn, { backgroundColor: theme.primary }]}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitBtnText}>अर्ज सादर करा</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  input: { borderWidth: 1, borderRadius: 8, padding: 12, marginBottom: 12 },
  submitBtn: { padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 8 },
  submitBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
});

export default DeliveryPartnerRegister;