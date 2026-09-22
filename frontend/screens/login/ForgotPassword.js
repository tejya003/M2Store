import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Keyboard,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { forgotPasswordSendOtp, resetPassword } from '../../api/authApi';

const ForgotPasswordScreen = ({ navigation }) => {
  const { theme } = useTheme();

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [otpSent, setOtpSent] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const handleSendOtp = async () => {
    Keyboard.dismiss();
    if (email.trim() === '') {
      Alert.alert('Error', 'Please enter your email');
      return;
    }

    try {
      setIsSendingOtp(true);
      const data = await forgotPasswordSendOtp(email.trim());
      setOtpSent(true);
      Alert.alert('Success', data.message || 'OTP sent successfully');
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to send OTP');
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleResetPassword = async () => {
    Keyboard.dismiss();

    if (otp.trim() === '') {
      Alert.alert('Error', 'Please enter OTP');
      return;
    }
    if (newPassword.trim() === '') {
      Alert.alert('Error', 'Please enter new password');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    try {
      setIsResetting(true);
      await resetPassword(email.trim(), otp.trim(), newPassword);
      Alert.alert('Success', 'Password reset successfully', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to reset password');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={[styles.container, { backgroundColor: theme.background }]}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={[styles.title, { color: theme.text }]}>Forgot Password</Text>

      <TextInput
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        editable={!otpSent}
        keyboardType="email-address"
        autoCapitalize="none"
        style={[styles.input, { backgroundColor: theme.inputBackground, color: theme.inputText, borderColor: theme.border }]}
        placeholderTextColor={theme.placeholder}
      />

      {!otpSent && (
        <TouchableOpacity
          style={[styles.button, isSendingOtp && styles.disabledButton]}
          onPress={handleSendOtp}
          disabled={isSendingOtp}
        >
          <Text style={styles.buttonText}>{isSendingOtp ? 'Sending OTP...' : 'Send OTP'}</Text>
        </TouchableOpacity>
      )}

      {otpSent && (
        <>
          <TextInput
            placeholder="Enter OTP"
            value={otp}
            onChangeText={(text) => setOtp(text.replace(/[^0-9]/g, ''))}
            keyboardType="number-pad"
            maxLength={6}
            style={[styles.input, { backgroundColor: theme.inputBackground, color: theme.inputText, borderColor: theme.border }]}
            placeholderTextColor={theme.placeholder}
          />

          <TextInput
            placeholder="New Password"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
            autoCapitalize="none"
            style={[styles.input, { backgroundColor: theme.inputBackground, color: theme.inputText, borderColor: theme.border }]}
            placeholderTextColor={theme.placeholder}
          />

          <TextInput
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            autoCapitalize="none"
            style={[styles.input, { backgroundColor: theme.inputBackground, color: theme.inputText, borderColor: theme.border }]}
            placeholderTextColor={theme.placeholder}
          />

          <TouchableOpacity
            style={[styles.button, isResetting && styles.disabledButton]}
            onPress={handleResetPassword}
            disabled={isResetting}
          >
            <Text style={styles.buttonText}>{isResetting ? 'Resetting...' : 'Reset Password'}</Text>
          </TouchableOpacity>
        </>
      )}

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={[styles.backText, { color: theme.primary }]}>Back to Login</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: 'center', padding: 25 },
  title: { fontSize: 26, fontWeight: 'bold', textAlign: 'center', marginBottom: 30 },
  input: { height: 50, borderWidth: 1, borderRadius: 8, paddingHorizontal: 15, marginBottom: 15, fontSize: 15 },
  button: { backgroundColor: '#1E88E5', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 5 },
  disabledButton: { opacity: 0.6 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  backText: { textAlign: 'center', marginTop: 22, fontSize: 14, fontWeight: 'bold' },
});

export default ForgotPasswordScreen;