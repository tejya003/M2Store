import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../screens/login/Login';
import RegisterScreen from '../screens/login/Register';
import ForgotPasswordScreen from '../screens/login/ForgotPassword';
import AdminTabNavigator from './AdminTabNavigator';
import UserTabNavigator from './UserTabNavigator';
import Checkout from '../screens/user/Checkout';
import OrderSuccess from '../screens/user/OrderSuccess';
import OfficeScan from '../screens/office/OfficeScan';
import OrderTrackingDetails from '../screens/office/OrderTrackingDetails';

// 👇 नवीन: Delivery Partner संबंधित screens
import DeliveryPartnerInfo from '../screens/delivery/DeliveryPartnerInfo';
import DeliveryPartnerRegister from '../screens/delivery/DeliveryPartnerRegister';
import DeliveryTabNavigator from './DeliveryTabNavigator';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="AdminDashboard" component={AdminTabNavigator} />
        <Stack.Screen name="Home" component={UserTabNavigator} />
        <Stack.Screen name="OfficeScan" component={OfficeScan} />

        <Stack.Screen name="OrderTrackingDetails" component={OrderTrackingDetails} />

        <Stack.Screen name="Checkout" component={Checkout} />
        <Stack.Screen name="OrderSuccess" component={OrderSuccess} />

        {/* 👇 नवीन: Delivery Partner संबंधित screens */}
        <Stack.Screen name="DeliveryPartnerInfo" component={DeliveryPartnerInfo} />
        <Stack.Screen name="DeliveryPartnerRegister" component={DeliveryPartnerRegister} />
        <Stack.Screen name="DeliveryDashboard" component={DeliveryTabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;