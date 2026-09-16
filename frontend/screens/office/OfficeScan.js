import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { scanOrderApi } from '../../api/scanApi';

const OfficeScan = ({ navigation }) => {
  const [officeName, setOfficeName] = useState('');
  const [scanInput, setScanInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [lastResult, setLastResult] = useState(null);

  const inputRef = useRef(null);

  useEffect(() => {
    (async () => {
      const userStr = await AsyncStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        setOfficeName(user.officeName || 'Unknown Office');
      }
    })();
  }, []);

  const extractOrderId = (raw) => {
    const trimmed = raw.trim();
    const parts = trimmed.split('/');
    return parts[parts.length - 1];
  };

  const handleScan = async (rawValue) => {
    const value = rawValue ?? scanInput;
    if (!value.trim()) return;

    const orderId = extractOrderId(value);
    setScanInput('');

    try {
      setLoading(true);
      const result = await scanOrderApi(orderId, officeName);
      setLastResult(result);

      if (result.isFinalDestination) {
        Alert.alert('✅ शेवटचं ठिकाण', `हा order '${officeName}' इथे पोहोचला — इथून customer कडे जाईल.`);
      } else {
        Alert.alert('✅ Scan झालं', `पुढे पाठवा: ${result.nextOffice}`);
      }
    } catch (error) {
      setLastResult(null);
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.officeLabel}>📍 Office</Text>
        <Text style={styles.officeName}>{officeName || '...'}</Text>
      </View>

      <View style={styles.scanBox}>
        <Text style={styles.scanLabel}>Order Scan करा</Text>
        <TextInput
          ref={inputRef}
          value={scanInput}
          onChangeText={setScanInput}
          onSubmitEditing={() => handleScan()}
          placeholder="इथे scan करा किंवा Order ID टाका"
          style={styles.scanInput}
          autoFocus
          blurOnSubmit={false}
          returnKeyType="done"
        />
        {loading && <ActivityIndicator size="small" color="#7C4DFF" style={{ marginTop: 10 }} />}
      </View>

      {lastResult && !loading && (
        <View
          style={[
            styles.resultCard,
            { backgroundColor: lastResult.isFinalDestination ? '#E8F5E9' : '#E3F2FD' },
          ]}
        >
          <Text style={styles.resultOrderId}>
            Order #{lastResult.order?._id?.slice(-6)?.toUpperCase()}
          </Text>

          {lastResult.isFinalDestination ? (
            <Text style={styles.resultFinal}>🏠 हे शेवटचं ठिकाण आहे — customer कडे पाठवा</Text>
          ) : (
            <>
              <Text style={styles.resultText}>इथे पोहोचला: {lastResult.currentOffice}</Text>
              <Text style={styles.resultNext}>➡️ पुढे पाठवा: {lastResult.nextOffice}</Text>
            </>
          )}

          <TouchableOpacity
            style={styles.viewDetailsButton}
            onPress={() => navigation.navigate('OrderTrackingDetails', { result: lastResult })}
          >
            <Text style={styles.viewDetailsText}>View Details  ›</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F5F5F7', padding: 20 },
  header: { alignItems: 'center', marginTop: 20, marginBottom: 30 },
  officeLabel: { fontSize: 14, color: '#777' },
  officeName: { fontSize: 26, fontWeight: 'bold', color: '#7C4DFF', marginTop: 4 },

  scanBox: { backgroundColor: '#fff', borderRadius: 14, padding: 18, elevation: 2 },
  scanLabel: { fontSize: 14, color: '#555', marginBottom: 10, fontWeight: '600' },
  scanInput: {
    borderWidth: 1.5,
    borderColor: '#7C4DFF',
    borderRadius: 10,
    height: 50,
    paddingHorizontal: 14,
    fontSize: 16,
  },

  resultCard: { borderRadius: 14, padding: 18, marginTop: 20 },
  resultOrderId: { fontSize: 16, fontWeight: 'bold', color: '#222', marginBottom: 8 },
  resultText: { fontSize: 14, color: '#444', marginBottom: 4 },
  resultNext: { fontSize: 20, fontWeight: 'bold', color: '#1E88E5', marginTop: 6 },
  resultFinal: { fontSize: 18, fontWeight: 'bold', color: '#43A047' },
  viewDetailsButton: { marginTop: 14, backgroundColor: '#fff', borderRadius: 8, paddingVertical: 10, alignItems: 'center' },
  viewDetailsText: { color: '#7C4DFF', fontWeight: 'bold', fontSize: 13 },

  logoutButton: {
    marginTop: 'auto',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E53935',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  logoutText: { color: '#E53935', fontWeight: 'bold', fontSize: 15 },
});

export default OfficeScan;