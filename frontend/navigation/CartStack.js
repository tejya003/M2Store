import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Cart from '../screens/user/Cart';
import Checkout from '../screens/user/Checkout';
import OrderSuccess from '../screens/user/OrderSuccess';

const Stack = createNativeStackNavigator();

const CartStackScreen = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="CartMain" component={Cart} />
    <Stack.Screen name="Checkout" component={Checkout} />
    <Stack.Screen name="OrderSuccess" component={OrderSuccess} />
  </Stack.Navigator>
);

export default CartStackScreen;