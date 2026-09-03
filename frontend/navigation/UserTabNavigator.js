import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeStack from './HomeStack';
import Search from '../screens/user/Search';
import CartStack from './CartStack';
import OrdersStack from './OrdersStack';
import Profile from '../screens/user/Profile';

const Tab = createBottomTabNavigator();

const ICONS = {
  Home: '🏠',
  Search: '🔍',
  Cart: '🛒',
  Orders: '📦',
  Profile: '👤',
};

const UserTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: () => <Text style={{ fontSize: 18 }}>{ICONS[route.name]}</Text>,
        tabBarActiveTintColor: '#6C5CE7',
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Search" component={Search} />
      <Tab.Screen name="Cart" component={CartStack} />
      <Tab.Screen name="Orders" component={OrdersStack} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
};

export default UserTabNavigator;