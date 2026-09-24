import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

const DeliveryDashboard = ({navigation}) => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Delivery Panel</Text>
          <Text style={styles.headerSubtitle}>Welcome, Delivery Partner</Text>
        </View>

        <View style={styles.profileCircle}>
          <Text style={styles.profileText}>D</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}>

        {/* Status */}
        <View style={styles.statusCard}>
          <View>
            <Text style={styles.statusLabel}>Delivery Status</Text>
            <Text style={styles.statusValue}>● Online</Text>
          </View>

          <TouchableOpacity style={styles.statusButton}>
            <Text style={styles.statusButtonText}>Go Offline</Text>
          </TouchableOpacity>
        </View>

        {/* Statistics */}
        <Text style={styles.sectionTitle}>Today's Summary</Text>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>New Orders</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Picked Up</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Delivered</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statNumber}>₹0</Text>
            <Text style={styles.statLabel}>Today's Earnings</Text>
          </View>
        </View>

        {/* Current Order */}
        <Text style={styles.sectionTitle}>Current Order</Text>

        <View style={styles.emptyCard}>
          <Text style={styles.emptyIcon}>📦</Text>
          <Text style={styles.emptyTitle}>No Active Delivery</Text>
          <Text style={styles.emptyText}>
            New delivery orders will appear here.
          </Text>
        </View>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>

        <TouchableOpacity style={styles.actionCard}>
          <View style={styles.actionIcon}>
            <Text>📋</Text>
          </View>

          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>My Deliveries</Text>
            <Text style={styles.actionText}>
              View assigned delivery orders
            </Text>
          </View>

          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionCard}>
          <View style={styles.actionIcon}>
            <Text>👤</Text>
          </View>

          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>My Profile</Text>
            <Text style={styles.actionText}>
              Manage delivery partner profile
            </Text>
          </View>

          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FB',
  },

  header: {
    backgroundColor: '#2874F0',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 22,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  headerTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
  },

  headerSubtitle: {
    color: '#DCE8FF',
    fontSize: 13,
    marginTop: 4,
  },

  profileCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  profileText: {
    color: '#2874F0',
    fontSize: 19,
    fontWeight: '700',
  },

  content: {
    padding: 16,
    paddingBottom: 30,
  },

  statusCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 22,
    elevation: 2,
  },

  statusLabel: {
    color: '#777777',
    fontSize: 13,
  },

  statusValue: {
    color: '#16A34A',
    fontSize: 17,
    fontWeight: '700',
    marginTop: 5,
  },

  statusButton: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
  },

  statusButtonText: {
    color: '#DC2626',
    fontSize: 12,
    fontWeight: '600',
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222222',
    marginBottom: 12,
    marginTop: 4,
  },

  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },

  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 18,
    elevation: 2,
  },

  statNumber: {
    fontSize: 25,
    fontWeight: '700',
    color: '#2874F0',
  },

  statLabel: {
    fontSize: 12,
    color: '#777777',
    marginTop: 5,
  },

  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 28,
    alignItems: 'center',
    marginBottom: 22,
    elevation: 2,
  },

  emptyIcon: {
    fontSize: 40,
    marginBottom: 10,
  },

  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#333333',
  },

  emptyText: {
    fontSize: 13,
    color: '#888888',
    marginTop: 6,
    textAlign: 'center',
  },

  actionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    elevation: 2,
  },

  actionIcon: {
    width: 45,
    height: 45,
    borderRadius: 12,
    backgroundColor: '#EAF1FF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  actionContent: {
    flex: 1,
    marginLeft: 13,
  },

  actionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#333333',
  },

  actionText: {
    fontSize: 12,
    color: '#888888',
    marginTop: 3,
  },

  arrow: {
    fontSize: 28,
    color: '#999999',
  },
});

export default DeliveryDashboard;