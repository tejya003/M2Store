import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../context/ThemeContext';
import { createOfficeUser, getAllOfficeUsers } from '../../api/officeApi';

const ManageOffices = ({ navigation }) => {
  const { theme } = useTheme();

  const [officeName, setOfficeName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [offices, setOffices] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadOffices = async () => {
    try {
      const data = await getAllOfficeUsers();
      setOffices(data);
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      loadOffices();
    }, [])
  );

  const handleCreate = async () => {
    if (!officeName.trim() || !username.trim() || !password.trim()) {
      Alert.alert('Error', 'सगळे बॉक्स भरा');
      return;
    }

    try {
      setSubmitting(true);
      await createOfficeUser(officeName.trim() + ' Office', username.trim(), password.trim(), officeName.trim());
      Alert.alert('Success', `'${officeName}' साठी login तयार झाला.\n\nUsername: ${username}\nPassword: ${password}`);
      setOfficeName('');
      setUsername('');
      setPassword('');
      loadOffices();
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const renderOffice = ({ item }) => (
    <View style={[styles.officeCard, { backgroundColor: theme.inputBackground, borderColor: theme.border }]}>
      <Text style={[styles.officeCardTitle, { color: theme.text }]}>📍 {item.officeName}</Text>
      <Text style={{ color: theme.placeholder, fontSize: 12, marginTop: 2 }}>Username: {item.username}</Text>
    </View>
  );

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ color: theme.primary, fontWeight: 'bold', fontSize: 16 }}>← Back</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.text }]}>Manage Offices</Text>
      </View>

      <View style={[styles.formCard, { backgroundColor: theme.inputBackground, borderColor: theme.border }]}>
        <Text style={[styles.formTitle, { color: theme.text }]}>नवीन Office Login बनवा</Text>

        <TextInput
          placeholder="Office चं नाव (उदा. Solapur)"
          value={officeName}
          onChangeText={setOfficeName}
          style={[styles.input, { color: theme.inputText, borderColor: theme.border }]}
          placeholderTextColor={theme.placeholder}
        />
        <TextInput
          placeholder="Username (उदा. solapur_office)"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          style={[styles.input, { color: theme.inputText, borderColor: theme.border }]}
          placeholderTextColor={theme.placeholder}
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          autoCapitalize="none"
          style={[styles.input, { color: theme.inputText, borderColor: theme.border }]}
          placeholderTextColor={theme.placeholder}
        />

        <TouchableOpacity
          style={[styles.createButton, submitting && { opacity: 0.6 }]}
          onPress={handleCreate}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.createButtonText}>Login तयार करा</Text>
          )}
        </TouchableOpacity>
      </View>

      <Text style={[styles.listTitle, { color: theme.text }]}>सध्याचे Offices</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#7C4DFF" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={offices}
          keyExtractor={(item) => item._id}
          renderItem={renderOffice}
          contentContainerStyle={{ paddingBottom: 30 }}
          ListEmptyComponent={
            <Text style={{ color: theme.placeholder, textAlign: 'center', marginTop: 15 }}>
              अजून कुठलंही office login बनवलेलं नाही
            </Text>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, padding: 15, paddingTop: 45 },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginLeft: 15 },

  formCard: { borderWidth: 1, borderRadius: 14, padding: 16, marginBottom: 20 },
  formTitle: { fontSize: 15, fontWeight: 'bold', marginBottom: 12 },
  input: { borderWidth: 1, borderRadius: 8, height: 46, paddingHorizontal: 12, marginBottom: 10, fontSize: 14 },
  createButton: { backgroundColor: '#7C4DFF', borderRadius: 10, paddingVertical: 13, alignItems: 'center', marginTop: 4 },
  createButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },

  listTitle: { fontSize: 15, fontWeight: 'bold', marginBottom: 10 },
  officeCard: { borderWidth: 1, borderRadius: 10, padding: 12, marginBottom: 8 },
  officeCardTitle: { fontWeight: 'bold', fontSize: 14 },
});

export default ManageOffices;