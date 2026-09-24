import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import LoginScreen from '../screens/login/Login';
import RegisterScreen from '../screens/login/Register';
import ForgotPasswordScreen from '../screens/login/ForgotPassword';

import AdminTabNavigator from './AdminTabNavigator';
import UserTabNavigator from './UserTabNavigator';
import DeliveryTabNavigator from './DeliveryTabNavigator';

import Checkout from '../screens/user/Checkout';
import OrderSuccess from '../screens/user/OrderSuccess';

import OfficeScan from '../screens/office/OfficeScan';
import OrderTrackingDetails from '../screens/office/OrderTrackingDetails';

import ManageDelivery from '../screens/admin/ManageDelivery';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
        }}>

        {/* Login */}
        <Stack.Screen
          name="Login"
          component={LoginScreen}
        />

        {/* Register */}
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
        />

        {/* Forgot Password */}
        <Stack.Screen
          name="ForgotPassword"
          component={ForgotPasswordScreen}
        />

        {/* Admin */}
        <Stack.Screen
          name="AdminDashboard"
          component={AdminTabNavigator}
        />

        {/* Manage Delivery Account */}
        <Stack.Screen
          name="ManageDelivery"
          component={ManageDelivery}
        />

        {/* User */}
        <Stack.Screen
          name="Home"
          component={UserTabNavigator}
        />

        {/* Delivery Panel */}
        <Stack.Screen
          name="DeliveryDashboard"
          component={DeliveryTabNavigator}
        />

        {/* Office */}
        <Stack.Screen
          name="OfficeScan"
          component={OfficeScan}
        />

        <Stack.Screen
          name="OrderTrackingDetails"
          component={OrderTrackingDetails}
        />

        {/* User Checkout */}
        <Stack.Screen
          name="Checkout"
          component={Checkout}
        />

        {/* Order Success */}
        <Stack.Screen
          name="OrderSuccess"
          component={OrderSuccess}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;