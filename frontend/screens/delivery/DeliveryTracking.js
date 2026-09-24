import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const DeliveryTracking = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>🗺️</Text>

      <Text style={styles.title}>Delivery Tracking</Text>

      <Text style={styles.subtitle}>
        Your active delivery tracking will appear here.
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

  icon: {
    fontSize: 50,
    marginBottom: 15,
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

export default DeliveryTracking;