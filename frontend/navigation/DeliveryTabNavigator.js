import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Text, View} from 'react-native';

import DeliveryDashboard from '../screens/delivery/DeliveryDashboard';
import DeliveryOrders from '../screens/delivery/DeliveryOrders';
import DeliveryTracking from '../screens/delivery/DeliveryTracking';
import DeliveryProfile from '../screens/delivery/DeliveryProfile';

const Tab = createBottomTabNavigator();

const TabIcon = ({icon, focused}) => {
  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Text
        style={{
          fontSize: 23,
          opacity: focused ? 1 : 0.55,
        }}>
        {icon}
      </Text>
    </View>
  );
};

const DeliveryTabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="DeliveryHome"
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: '#2874F0',
        tabBarInactiveTintColor: '#777777',
        tabBarStyle: {
          height: 65,
          paddingBottom: 7,
          paddingTop: 5,
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          backgroundColor: '#FFFFFF',
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}>

      <Tab.Screen
        name="DeliveryHome"
        component={DeliveryDashboard}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({focused}) => (
            <TabIcon icon="🏠" focused={focused} />
          ),
        }}
      />

      <Tab.Screen
        name="DeliveryOrders"
        component={DeliveryOrders}
        options={{
          tabBarLabel: 'Deliveries',
          tabBarIcon: ({focused}) => (
            <TabIcon icon="📦" focused={focused} />
          ),
        }}
      />

      <Tab.Screen
        name="DeliveryTracking"
        component={DeliveryTracking}
        options={{
          tabBarLabel: 'Tracking',
          tabBarIcon: ({focused}) => (
            <TabIcon icon="🗺️" focused={focused} />
          ),
        }}
      />

      <Tab.Screen
        name="DeliveryProfile"
        component={DeliveryProfile}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({focused}) => (
            <TabIcon icon="👤" focused={focused} />
          ),
        }}
      />

    </Tab.Navigator>
  );
};

export default DeliveryTabNavigator;