import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MyOrders from '../screens/user/MyOrders';
import OrderDetails from '../screens/user/OrderDetails';

const Stack = createNativeStackNavigator();

const OrdersStackScreen = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="MyOrdersMain" component={MyOrders} />
    <Stack.Screen name="OrderDetails" component={OrderDetails} />
  </Stack.Navigator>
);

export default OrdersStackScreen;