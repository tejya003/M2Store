import React, { useRef, useState } from 'react';

import {
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Alert,
    Keyboard,
    TouchableWithoutFeedback,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';

import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { registerUser, sendOtp, verifyOtp } from '../../api/authApi';

const RegisterScreen = ({ navigation }) => {
    const { t } = useLanguage();
    const { theme } = useTheme();

    const scrollViewRef = useRef(null);

    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [mobile, setMobile] = useState('');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);

    const [isRegistering, setIsRegistering] = useState(false);
    const [isSendingOtp, setIsSendingOtp] = useState(false);
    const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

    const isValidEmail = (value) => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(value.trim());
    };

    const scrollToBottom = () => {
        setTimeout(() => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 300);
    };

    // SEND OTP
    const handleSendOtp = async () => {
        Keyboard.dismiss();

        if (email.trim() === '') {
            Alert.alert('Error', 'Please enter your email');
            return;
        }
        if (!isValidEmail(email)) {
            Alert.alert('Error', 'Please enter a valid email address');
            return;
        }

        try {
            setIsSendingOtp(true);
            const data = await sendOtp(email.trim());

            setOtpSent(true);
            setOtpVerified(false);
            setOtp('');

            Alert.alert('Success', data.message || 'OTP sent successfully');
        } catch (error) {
            Alert.alert('Error', error.message || 'Unable to connect to server');
        } finally {
            setIsSendingOtp(false);
        }
    };

    // VERIFY OTP
    const handleVerifyOtp = async () => {
        Keyboard.dismiss();

        if (otp.trim() === '') {
            Alert.alert('Error', 'Please enter OTP');
            return;
        }
        if (!/^[0-9]{6}$/.test(otp.trim())) {
            Alert.alert('Error', 'Please enter a valid 6 digit OTP');
            return;
        }

        try {
            setIsVerifyingOtp(true);
            const data = await verifyOtp(email.trim(), otp.trim());

            setOtpVerified(true);
            Alert.alert('Success', data.message || 'OTP verified successfully');
        } catch (error) {
            setOtpVerified(false);
            Alert.alert('Error', error.message || 'Invalid OTP');
        } finally {
            setIsVerifyingOtp(false);
        }
    };

    // REGISTER
    const handleRegister = async () => {
        Keyboard.dismiss();

        if (name.trim() === '') {
            Alert.alert('Error', 'Please enter your name');
            return;
        }
        if (username.trim() === '') {
            Alert.alert('Error', 'Please enter a username');
            return;
        }
        if (email.trim() === '') {
            Alert.alert('Error', 'Please enter your email');
            return;
        }
        if (!isValidEmail(email)) {
            Alert.alert('Error', 'Please enter a valid email address');
            return;
        }
        if (mobile.trim() === '') {
            Alert.alert('Error', 'Please enter your mobile number');
            return;
        }
        if (!/^[0-9]{10}$/.test(mobile.trim())) {
            Alert.alert('Error', 'Please enter a valid 10 digit mobile number');
            return;
        }
        if (password.trim() === '') {
            Alert.alert('Error', 'Please enter your password');
            return;
        }
        if (confirmPassword.trim() === '') {
            Alert.alert('Error', 'Please confirm your password');
            return;
        }
        if (password !== confirmPassword) {
            Alert.alert('Error', 'Password and Confirm Password do not match');
            return;
        }
        if (!otpVerified) {
            Alert.alert('Error', 'Please verify your email OTP first');
            return;
        }

        try {
            setIsRegistering(true);

            const data = await registerUser(
                name.trim(),
                username.trim(),
                email.trim(),
                mobile.trim(),
                password
            );

            Alert.alert('Success', 'Account created successfully', [
                { text: 'OK', onPress: () => navigation.goBack() },
            ]);
        } catch (error) {
            Alert.alert('Error', error.message || 'Registration failed');
        } finally {
            setIsRegistering(false);
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView
                style={styles.keyboardContainer}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            >
                <ScrollView
                    ref={scrollViewRef}
                    contentContainerStyle={[styles.container, { backgroundColor: theme.background }]}
                    keyboardShouldPersistTaps="handled"
                    keyboardDismissMode="on-drag"
                    showsVerticalScrollIndicator={true}
                >
                    <Text style={[styles.title, { color: theme.text }]}>{t.createAccount}</Text>

                    <TextInput
                        placeholder={t.enterName}
                        value={name}
                        onChangeText={setName}
                        autoCapitalize="words"
                        style={[styles.input, { backgroundColor: theme.inputBackground, color: theme.inputText, borderColor: theme.border }]}
                        placeholderTextColor={theme.placeholder}
                    />

                    <TextInput
                        placeholder={t.enterUsername}
                        value={username}
                        onChangeText={setUsername}
                        autoCapitalize="none"
                        autoCorrect={false}
                        style={[styles.input, { backgroundColor: theme.inputBackground, color: theme.inputText, borderColor: theme.border }]}
                        placeholderTextColor={theme.placeholder}
                    />

                    <TextInput
                        placeholder={t.enterEmail}
                        value={email}
                        onChangeText={(text) => {
                            setEmail(text);
                            setOtpSent(false);
                            setOtpVerified(false);
                            setOtp('');
                        }}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                        style={[styles.input, { backgroundColor: theme.inputBackground, color: theme.inputText, borderColor: theme.border }]}
                        placeholderTextColor={theme.placeholder}
                    />

                    <TextInput
                        placeholder="Enter Mobile Number"
                        value={mobile}
                        onChangeText={(text) => setMobile(text.replace(/[^0-9]/g, ''))}
                        keyboardType="phone-pad"
                        maxLength={10}
                        style={[styles.input, { backgroundColor: theme.inputBackground, color: theme.inputText, borderColor: theme.border }]}
                        placeholderTextColor={theme.placeholder}
                    />

                    <TouchableOpacity
                        style={[styles.otpButton, isSendingOtp && styles.disabledButton]}
                        onPress={handleSendOtp}
                        disabled={isSendingOtp}
                    >
                        <Text style={styles.buttonText}>{isSendingOtp ? 'Sending OTP...' : t.getOtp}</Text>
                    </TouchableOpacity>

                    {otpSent && (
                        <>
                            <TextInput
                                placeholder={t.enterOtp}
                                value={otp}
                                onChangeText={(text) => {
                                    setOtp(text.replace(/[^0-9]/g, ''));
                                    setOtpVerified(false);
                                }}
                                keyboardType="number-pad"
                                maxLength={6}
                                style={[styles.input, { backgroundColor: theme.inputBackground, color: theme.inputText, borderColor: theme.border }]}
                                placeholderTextColor={theme.placeholder}
                            />

                            {!otpVerified && (
                                <TouchableOpacity
                                    style={[styles.otpButton, isVerifyingOtp && styles.disabledButton]}
                                    onPress={handleVerifyOtp}
                                    disabled={isVerifyingOtp}
                                >
                                    <Text style={styles.buttonText}>{isVerifyingOtp ? 'Verifying...' : t.verifyOtp}</Text>
                                </TouchableOpacity>
                            )}

                            {otpVerified && <Text style={styles.verifiedText}>✓ Email OTP Verified</Text>}
                        </>
                    )}

                    <TextInput
                        placeholder={t.enterPassword}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={true}
                        autoCapitalize="none"
                        onFocus={scrollToBottom}
                        style={[styles.input, { backgroundColor: theme.inputBackground, color: theme.inputText, borderColor: theme.border }]}
                        placeholderTextColor={theme.placeholder}
                    />

                    <TextInput
                        placeholder={t.confirmPassword}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry={true}
                        autoCapitalize="none"
                        onFocus={scrollToBottom}
                        style={[styles.input, { backgroundColor: theme.inputBackground, color: theme.inputText, borderColor: theme.border }]}
                        placeholderTextColor={theme.placeholder}
                    />

                    <TouchableOpacity
                        style={[styles.registerButton, isRegistering && styles.disabledButton]}
                        disabled={isRegistering}
                        onPress={handleRegister}
                    >
                        <Text style={styles.buttonText}>{isRegistering ? 'Registering...' : t.register}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => {
                            Keyboard.dismiss();
                            navigation.goBack();
                        }}
                    >
                        <Text style={[styles.loginText, { color: theme.primary }]}>{t.alreadyAccountLogin}</Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    keyboardContainer: { flex: 1 },

    container: { flexGrow: 1, justifyContent: 'center', padding: 25, paddingBottom: 100 },

    title: { fontSize: 30, fontWeight: 'bold', textAlign: 'center', marginBottom: 35 },

    input: { width: '100%', height: 50, borderWidth: 1, borderRadius: 8, paddingHorizontal: 15, marginBottom: 15, fontSize: 16 },

    otpButton: { backgroundColor: '#1E88E5', padding: 14, borderRadius: 8, alignItems: 'center', marginBottom: 15 },

    registerButton: { backgroundColor: '#1E88E5', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },

    disabledButton: { opacity: 0.6 },

    verifiedText: { color: 'green', fontSize: 16, fontWeight: 'bold', marginBottom: 15 },

    buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },

    loginText: { textAlign: 'center', marginTop: 25, fontSize: 14, fontWeight: 'bold' },
});

export default RegisterScreen;