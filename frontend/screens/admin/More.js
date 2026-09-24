import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

const More = ({ navigation }) => {
  const { theme } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <TouchableOpacity
        style={[styles.item, { backgroundColor: theme.inputBackground, borderColor: theme.border }]}
        onPress={() => navigation.navigate('ManageOffices')}
      >
        <Text style={{ fontSize: 20, marginRight: 12 }}>🏢</Text>
        <Text style={[styles.itemText, { color: theme.text }]}>Manage Offices</Text>
      </TouchableOpacity>

      {/* 👇 नवीन */}
      <TouchableOpacity
        style={[styles.item, { backgroundColor: theme.inputBackground, borderColor: theme.border }]}
        onPress={() => navigation.navigate('DeliveryPartnersList')}
      >
        <Text style={{ fontSize: 20, marginRight: 12 }}>🏍️</Text>
        <Text style={[styles.itemText, { color: theme.text }]}>Delivery Partners</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, paddingTop: 50 },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12, // 👈 नवीन: दोन बटणांमध्ये अंतर
  },
  itemText: { fontSize: 15, fontWeight: '600' },
});

export default More;