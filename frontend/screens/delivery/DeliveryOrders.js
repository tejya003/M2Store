import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const DeliveryOrders = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Deliveries</Text>
      <Text style={styles.subtitle}>
        Assigned delivery orders will appear here.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FB',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#222',
  },

  subtitle: {
    fontSize: 14,
    color: '#777',
    marginTop: 8,
    textAlign: 'center',
  },
});

export default DeliveryOrders;