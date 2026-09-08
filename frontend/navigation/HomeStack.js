import React from 'react';

import {createNativeStackNavigator} from '@react-navigation/native-stack';

import Home from '../screens/user/Home';
import ProductDetails from '../screens/user/ProductDetails';
import SavedAddresses from '../screens/user/SavedAddresses';
import Categories from '../screens/user/Categories';
import Wishlist from '../screens/user/Wishlist';

const Stack = createNativeStackNavigator();

const HomeStackScreen = () => (
  <Stack.Navigator screenOptions={{headerShown: false}}>

    <Stack.Screen
      name="HomeMain"
      component={Home}
    />

    <Stack.Screen
      name="ProductDetails"
      component={ProductDetails}
    />

    <Stack.Screen
      name="SavedAddresses"
      component={SavedAddresses}
    />

    <Stack.Screen
      name="Categories"
      component={Categories}
    />

    <Stack.Screen
      name="Wishlist"
      component={Wishlist}
    />

  </Stack.Navigator>
);

export default HomeStackScreen;