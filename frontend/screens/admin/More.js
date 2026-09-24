import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import {useTheme} from '../../context/ThemeContext';

const More = ({navigation}) => {
  const {theme} = useTheme();

  const openManageDelivery = () => {
    navigation
      .getParent()
      ?.getParent()
      ?.navigate('ManageDelivery');
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.background,
        },
      ]}>

      {/* Manage Offices */}
      <TouchableOpacity
        style={[
          styles.item,
          {
            backgroundColor: theme.inputBackground,
            borderColor: theme.border,
          },
        ]}
        onPress={() => navigation.navigate('ManageOffices')}>

        <Text style={styles.icon}>
          🏢
        </Text>

        <Text
          style={[
            styles.itemText,
            {
              color: theme.text,
            },
          ]}>
          Manage Offices
        </Text>

      </TouchableOpacity>

      {/* Manage Delivery */}
      <TouchableOpacity
        style={[
          styles.item,
          {
            backgroundColor: theme.inputBackground,
            borderColor: theme.border,
            marginTop: 12,
          },
        ]}
        onPress={openManageDelivery}>

        <Text style={styles.icon}>
          🚚
        </Text>

        <Text
          style={[
            styles.itemText,
            {
              color: theme.text,
            },
          ]}>
          Manage Delivery
        </Text>

      </TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    paddingTop: 50,
  },

  item: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
  },

  icon: {
    fontSize: 20,
    marginRight: 12,
  },

  itemText: {
    fontSize: 15,
    fontWeight: '600',
  },
});

export default More;