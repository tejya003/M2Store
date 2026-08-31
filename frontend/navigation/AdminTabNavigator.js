import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Dashboard from '../screens/admin/Dashboard';
import ProductList from '../screens/admin/ProductList';
import AddEditProduct from '../screens/admin/AddEditProduct';
import CustomersList from '../screens/admin/CustomersList';
import CustomerOrders from '../screens/admin/CustomerOrders';
import OrdersList from '../screens/admin/OrdersList';
import More from '../screens/admin/More';

const Tab = createBottomTabNavigator();
const ProductsStack = createNativeStackNavigator();
const UsersStack = createNativeStackNavigator();

const ProductsStackScreen = () => (
  <ProductsStack.Navigator screenOptions={{ headerShown: false }}>
    <ProductsStack.Screen name="ProductList" component={ProductList} />
    <ProductsStack.Screen name="AddEditProduct" component={AddEditProduct} />
  </ProductsStack.Navigator>
);

const UsersStackScreen = () => (
  <UsersStack.Navigator screenOptions={{ headerShown: false }}>
    <UsersStack.Screen name="CustomersList" component={CustomersList} />
    <UsersStack.Screen name="CustomerOrders" component={CustomerOrders} />
  </UsersStack.Navigator>
);

const ICONS = {
  Dashboard: '🏠',
  Products: '📦',
  Users: '👥',
  Orders: '🛒',
  More: '⋯',
};

const AdminTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: () => <Text style={{ fontSize: 18 }}>{ICONS[route.name]}</Text>,
        tabBarActiveTintColor: '#1E88E5',
      })}
    >
      <Tab.Screen name="Dashboard" component={Dashboard} />
      <Tab.Screen name="Products" component={ProductsStackScreen} />
      <Tab.Screen name="Users" component={UsersStackScreen} />
      <Tab.Screen name="Orders" component={OrdersList} />
      <Tab.Screen name="More" component={More} />
    </Tab.Navigator>
  );
};

export default AdminTabNavigator;