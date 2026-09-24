import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';

import {useTheme} from '../../context/ThemeContext';
import {createDeliveryUser} from '../../api/deliveryApi';

const ManageDelivery = ({navigation}) => {
  const {theme} = useTheme();

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleCreate = async () => {
    if (!name.trim() || !username.trim() || !password.trim()) {
      Alert.alert('Error', 'सगळे बॉक्स भरा');
      return;
    }

    try {
      setSubmitting(true);

      await createDeliveryUser(
        name.trim(),
        username.trim(),
        password.trim(),
      );

      Alert.alert(
        'Success',
        `Delivery login तयार झाला.\n\nName: ${name}\nUsername: ${username}\nPassword: ${password}`,
      );

      setName('');
      setUsername('');
      setPassword('');
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View
      style={[
        styles.screen,
        {backgroundColor: theme.background},
      ]}>

      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text
            style={[
              styles.backText,
              {color: theme.primary},
            ]}>
            ← Back
          </Text>
        </TouchableOpacity>

        <Text
          style={[
            styles.title,
            {color: theme.text},
          ]}>
          Delivery Account
        </Text>
      </View>

      <View
        style={[
          styles.formCard,
          {
            backgroundColor: theme.inputBackground,
            borderColor: theme.border,
          },
        ]}>

        <Text
          style={[
            styles.formTitle,
            {color: theme.text},
          ]}>
          नवीन Delivery Login बनवा
        </Text>

        <TextInput
          placeholder="Delivery Partner Name"
          value={name}
          onChangeText={setName}
          style={[
            styles.input,
            {
              color: theme.inputText,
              borderColor: theme.border,
            },
          ]}
          placeholderTextColor={theme.placeholder}
        />

        <TextInput
          placeholder="Username (उदा. delivery1)"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          autoCorrect={false}
          style={[
            styles.input,
            {
              color: theme.inputText,
              borderColor: theme.border,
            },
          ]}
          placeholderTextColor={theme.placeholder}
        />

        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          autoCapitalize="none"
          secureTextEntry
          style={[
            styles.input,
            {
              color: theme.inputText,
              borderColor: theme.border,
            },
          ]}
          placeholderTextColor={theme.placeholder}
        />

        <TouchableOpacity
          style={[
            styles.createButton,
            submitting && styles.disabledButton,
          ]}
          onPress={handleCreate}
          disabled={submitting}>

          {submitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.createButtonText}>
              Delivery Login तयार करा
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 15,
    paddingTop: 45,
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },

  backText: {
    fontWeight: 'bold',
    fontSize: 16,
  },

  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 15,
  },

  formCard: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
  },

  formTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
  },

  input: {
    borderWidth: 1,
    borderRadius: 8,
    height: 48,
    paddingHorizontal: 12,
    marginBottom: 11,
    fontSize: 14,
  },

  createButton: {
    backgroundColor: '#2874F0',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 5,
  },

  disabledButton: {
    opacity: 0.6,
  },

  createButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
});

export default ManageDelivery;