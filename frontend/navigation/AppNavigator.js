import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../screens/login/Login';
import RegisterScreen from '../screens/login/Register';
import AdminTabNavigator from './AdminTabNavigator';
import UserTabNavigator from './UserTabNavigator';
import Checkout from '../screens/user/Checkout';
import OrderSuccess from '../screens/user/OrderSuccess';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="AdminDashboard" component={AdminTabNavigator} />
        <Stack.Screen name="Home" component={UserTabNavigator} />
        
        <Stack.Screen name="Checkout" component={Checkout} />
        <Stack.Screen name="OrderSuccess" component={OrderSuccess} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;