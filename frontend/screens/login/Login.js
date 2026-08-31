import React, { useState, useEffect } from 'react';

import {
  View,
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

import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { loginUser, googleLoginApi } from '../../api/authApi';

const LoginScreen = ({ navigation }) => {
  const { t } = useLanguage();
  const { theme } = useTheme();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Configure Google Sign-In on component mount
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '1060370686827-7s9h8qlbk7cm67016mbea13iltg59ska.apps.googleusercontent.com',
    });
  }, []);

  // Standard Username / Password Login
  const handleLogin = async () => {
    Keyboard.dismiss();

    if (username.trim() === '') {
      Alert.alert('Error', 'Please enter your username');
      return;
    }

    if (password.trim() === '') {
      Alert.alert('Error', 'Please enter your password');
      return;
    }

    try {
      setIsLoggingIn(true);

      const data = await loginUser(username.trim(), password);

      await AsyncStorage.setItem('token', data.token);
      await AsyncStorage.setItem('user', JSON.stringify(data.user));

      if (data.user.role === 'admin') {
        navigation.reset({ index: 0, routes: [{ name: 'AdminDashboard' }] });
      } else {
        navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Login failed');
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Google Sign-In Handler
  const handleGoogleSignIn = async () => {
    Keyboard.dismiss();
    try {
      setIsLoggingIn(true);
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const idToken = userInfo.data?.idToken || userInfo.idToken;

      if (idToken) {
        const res = await googleLoginApi(idToken);
        if (res.token) {
          await AsyncStorage.setItem('token', res.token);
          await AsyncStorage.setItem('user', JSON.stringify(res.user));

          if (res.user.role === 'admin') {
            navigation.reset({ index: 0, routes: [{ name: 'AdminDashboard' }] });
          } else {
            navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
          }
        } else {
          Alert.alert('Error', res.message || 'Google Login failed');
        }
      } else {
        Alert.alert('Error', 'Unable to get Google ID Token');
      }
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      Alert.alert('Error', 'Google Sign-In was cancelled or failed');
    } finally {
      setIsLoggingIn(false);
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
          contentContainerStyle={[
            styles.container,
            { backgroundColor: theme.background },
          ]}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        >

          {/* ================= LOGO ================= */}

          <View style={styles.logoContainer}>

            {/* Shopping Bag Handle */}
            <View style={styles.bagHandle} />

            {/* Cart */}
            <View style={styles.cartBody}>
              <View style={styles.cartLine1} />
              <View style={styles.cartLine2} />

              {/* M2 Text */}
              <View style={styles.m2Container}>
                <Text style={styles.mText}>M</Text>
                <Text style={styles.twoText}>2</Text>
              </View>

              {/* Wheels */}
              <View style={styles.wheelContainer}>
                <View style={styles.wheel} />
                <View style={styles.wheel} />
              </View>
            </View>

          </View>

          {/* ================= M2 STORE ================= */}

          <View style={styles.storeNameContainer}>
            <Text style={styles.m2StoreBlue}>M2</Text>
            <Text style={styles.m2StoreOrange}> STORE</Text>
          </View>

          {/* ================= WELCOME ================= */}

          <Text style={[styles.welcomeText, { color: theme.text }]}>
            Welcome to M2 Store
          </Text>

          <Text style={[styles.loginSubText, { color: theme.placeholder }]}>
            Login to continue
          </Text>

          {/* ================= USERNAME ================= */}

          <View
            style={[
              styles.inputContainer,
              {
                backgroundColor: theme.inputBackground,
                borderColor: theme.border,
              },
            ]}
          >
            <Text style={styles.inputIcon}>👤</Text>

            <TextInput
              placeholder={t.enterUsername || 'Enter Username'}
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              autoCorrect={false}
              style={[
                styles.input,
                {
                  color: theme.inputText,
                },
              ]}
              placeholderTextColor={theme.placeholder}
            />
          </View>

          {/* ================= PASSWORD ================= */}

          <View
            style={[
              styles.inputContainer,
              {
                backgroundColor: theme.inputBackground,
                borderColor: theme.border,
              },
            ]}
          >
            <Text style={styles.inputIcon}>🔒</Text>

            <TextInput
              placeholder={t.enterPassword || 'Enter Password'}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={true}
              autoCapitalize="none"
              style={[
                styles.input,
                {
                  color: theme.inputText,
                },
              ]}
              placeholderTextColor={theme.placeholder}
            />

            <Text style={styles.eyeIcon}>◉</Text>
          </View>

          {/* ================= LOGIN BUTTON ================= */}

          <TouchableOpacity
            style={[
              styles.loginButton,
              isLoggingIn && styles.disabledButton,
            ]}
            disabled={isLoggingIn}
            onPress={handleLogin}
          >
            <Text style={styles.buttonText}>
              {isLoggingIn ? 'Logging in...' : t.login || 'Login'}
            </Text>
          </TouchableOpacity>

          {/* ================= OR DIVIDER ================= */}

          <View style={styles.dividerContainer}>
            <View style={[styles.dividerLine, { backgroundColor: theme.border || '#ccc' }]} />
            <Text style={[styles.dividerText, { color: theme.placeholder || '#777' }]}>OR</Text>
            <View style={[styles.dividerLine, { backgroundColor: theme.border || '#ccc' }]} />
          </View>

          {/* ================= GOOGLE SIGN-IN BUTTON ================= */}

          <TouchableOpacity
            style={[
              styles.googleButton,
              isLoggingIn && styles.disabledButton,
            ]}
            disabled={isLoggingIn}
            onPress={handleGoogleSignIn}
          >
            <Text style={styles.googleIcon}>G</Text>
            <Text style={styles.googleButtonText}>Sign in with Google</Text>
          </TouchableOpacity>

          {/* ================= REGISTER ================= */}

          <TouchableOpacity
            onPress={() => navigation.navigate('Register')}
          >
            <Text
              style={[
                styles.registerText,
                { color: theme.primary },
              ]}
            >
              {t.noAccountRegister || "Don't have an account? Register"}
            </Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({

  keyboardContainer: {
    flex: 1,
  },

  container: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 30,
  },

  /* ================= LOGO ================= */

  logoContainer: {
    alignItems: 'center',
    marginBottom: 8,
    marginTop: 5,
  },

  cartBody: {
    width: 145,
    height: 90,
    borderBottomWidth: 9,
    borderLeftWidth: 9,
    borderRightWidth: 9,
    borderColor: '#1976D2',
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    position: 'relative',
    alignItems: 'center',
  },

  bagHandle: {
    position: 'absolute',
    width: 55,
    height: 35,
    borderWidth: 6,
    borderBottomWidth: 0,
    borderColor: '#F57C00',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    top: -20,
    zIndex: 2,
  },

  m2Container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
  },

  mText: {
    fontSize: 48,
    fontWeight: '900',
    color: '#1976D2',
    fontStyle: 'italic',
  },

  twoText: {
    fontSize: 48,
    fontWeight: '900',
    color: '#F57C00',
    fontStyle: 'italic',
  },

  wheelContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: -34,
    width: 95,
    justifyContent: 'space-between',
  },

  wheel: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#1976D2',
  },

  /* ================= STORE NAME ================= */

  storeNameContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 28,
  },

  m2StoreBlue: {
    fontSize: 36,
    fontWeight: '900',
    color: '#1976D2',
  },

  m2StoreOrange: {
    fontSize: 36,
    fontWeight: '900',
    color: '#F57C00',
  },

  /* ================= WELCOME ================= */

  welcomeText: {
    fontSize: 23,
    fontWeight: '800',
    textAlign: 'center',
    marginTop: 18,
  },

  loginSubText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 35,
  },

  /* ================= INPUT ================= */

  inputContainer: {
    width: '100%',
    height: 56,
    borderWidth: 1,
    borderRadius: 9,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    paddingHorizontal: 12,
  },

  inputIcon: {
    fontSize: 21,
    marginRight: 10,
  },

  input: {
    flex: 1,
    height: 54,
    fontSize: 15,
  },

  eyeIcon: {
    fontSize: 21,
    color: '#555',
    marginLeft: 5,
  },

  /* ================= BUTTON ================= */

  loginButton: {
    width: '100%',
    height: 55,
    backgroundColor: '#1E88E5',
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
  },

  disabledButton: {
    opacity: 0.6,
  },

  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  /* ================= DIVIDER ================= */

  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 18,
  },

  dividerLine: {
    flex: 1,
    height: 1,
  },

  dividerText: {
    marginHorizontal: 10,
    fontSize: 14,
    fontWeight: '600',
  },

  /* ================= GOOGLE BUTTON ================= */

  googleButton: {
    width: '100%',
    height: 55,
    backgroundColor: '#4285F4',
    borderRadius: 7,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  googleIcon: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '900',
    marginRight: 10,
  },

  googleButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  /* ================= REGISTER ================= */

  registerText: {
    textAlign: 'center',
    marginTop: 22,
    fontSize: 14,
    fontWeight: '600',
  },
});

export default LoginScreen;