import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AvailableOrders from '../screens/delivery/AvailableOrders';
import MyDeliveries from '../screens/delivery/MyDeliveries';

const Tab = createBottomTabNavigator();

const DeliveryTabNavigator = () => {
  return (
    <Tab.Navigator screenOptions={{ headerShown: true }}>
      <Tab.Screen
        name="AvailableOrders"
        component={AvailableOrders}
        options={{ title: 'उपलब्ध Orders' }}
      />
      <Tab.Screen
        name="MyDeliveries"
        component={MyDeliveries}
        options={{ title: 'माझ्या Deliveries' }}
      />
    </Tab.Navigator>
  );
};

export default DeliveryTabNavigator;