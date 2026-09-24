import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import DeliveryDashboard from '../screens/delivery/DeliveryDashboard';

const Stack = createNativeStackNavigator();

const DeliveryStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="DeliveryDashboard"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen
        name="DeliveryDashboard"
        component={DeliveryDashboard}
      />
    </Stack.Navigator>
  );
};

export default DeliveryStack;