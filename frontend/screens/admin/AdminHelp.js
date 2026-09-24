import React, {useEffect, useMemo, useState} from 'react';

import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';

import {
  getAllChats,
  sendAdminReply,
} from '../../api/adminChatApi';

const AdminHelp = () => {
  const [chats, setChats] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  // Load all customer chats
  const loadChats = async () => {
    try {
      const data = await getAllChats();

      setChats(data);

      // Automatically select first customer
      if (data.length > 0 && !selectedUserId) {
        setSelectedUserId(data[0].userId?._id);
      }
    } catch (error) {
      console.log('Load admin chats error:', error);

      Alert.alert(
        'Error',
        error.message || 'Failed to load customer chats',
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChats();
  }, []);

  // Get unique customers
  const customers = useMemo(() => {
    const map = new Map();

    chats.forEach(chat => {
      if (chat.userId?._id) {
        map.set(chat.userId._id, chat.userId);
      }
    });

    return Array.from(map.values());
  }, [chats]);

  // Messages of selected customer
  const selectedMessages = useMemo(() => {
    if (!selectedUserId) {
      return [];
    }

    return chats.filter(
      chat => chat.userId?._id === selectedUserId,
    );
  }, [chats, selectedUserId]);

  const selectedCustomer = customers.find(
    customer => customer._id === selectedUserId,
  );

  // Send admin reply
  const sendMessage = async () => {
    if (!selectedUserId) {
      Alert.alert('Select Customer', 'Please select a customer first.');
      return;
    }

    if (!message.trim()) {
      return;
    }

    try {
      setSending(true);

      const data = await sendAdminReply(
        selectedUserId,
        message.trim(),
      );

      setChats(prev => [...prev, data.chat]);

      setMessage('');
    } catch (error) {
      console.log('Admin reply error:', error);

      Alert.alert(
        'Error',
        error.message || 'Failed to send reply',
      );
    } finally {
      setSending(false);
    }
  };

  const renderCustomer = ({item}) => {
    const active = item._id === selectedUserId;

    return (
      <TouchableOpacity
        style={[
          styles.customerItem,
          active && styles.activeCustomer,
        ]}
        onPress={() => setSelectedUserId(item._id)}>

        <View style={styles.customerAvatar}>
          <Text style={styles.avatarText}>
            {item.name?.charAt(0)?.toUpperCase() || 'U'}
          </Text>
        </View>

        <View style={styles.customerInfo}>
          <Text style={styles.customerName}>
            {item.name || item.username}
          </Text>

          <Text style={styles.customerEmail}>
            {item.email}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderMessage = ({item}) => {
    const isAdmin = item.sender === 'admin';

    return (
      <View
        style={[
          styles.messageRow,
          isAdmin ? styles.adminRow : styles.userRow,
        ]}>

        <View
          style={[
            styles.messageBubble,
            isAdmin
              ? styles.adminBubble
              : styles.userBubble,
          ]}>

          <Text style={styles.senderName}>
            {isAdmin ? 'You (Admin)' : 'Customer'}
          </Text>

          <Text
            style={[
              styles.messageText,
              isAdmin && styles.adminMessageText,
            ]}>
            {item.message}
          </Text>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          size="large"
          color="#2874F0"
        />

        <Text style={styles.loadingText}>
          Loading customer chats...
        </Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={
        Platform.OS === 'ios'
          ? 'padding'
          : 'height'
      }>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>
          Help
        </Text>

        <Text style={styles.subtitle}>
          Customer Support Chat
        </Text>
      </View>

      {/* Customer List */}
      <View style={styles.customerSection}>
        <Text style={styles.sectionTitle}>
          Customers
        </Text>

        {customers.length === 0 ? (
          <Text style={styles.noCustomerText}>
            No customer messages yet.
          </Text>
        ) : (
          <FlatList
            data={customers}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={item => item._id}
            renderItem={renderCustomer}
            contentContainerStyle={
              styles.customerList
            }
          />
        )}
      </View>

      {/* Selected Customer */}
      {selectedCustomer && (
        <View style={styles.selectedCustomer}>
          <Text style={styles.selectedName}>
            {selectedCustomer.name}
          </Text>

          <Text style={styles.selectedEmail}>
            {selectedCustomer.email}
          </Text>
        </View>
      )}

      {/* Messages */}
      <FlatList
        data={selectedMessages}
        keyExtractor={item => item._id}
        renderItem={renderMessage}
        contentContainerStyle={styles.chatContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No messages from this customer.
            </Text>
          </View>
        }
      />

      {/* Reply Input */}
      <View style={styles.inputContainer}>
        <TextInput
          value={message}
          onChangeText={setMessage}
          placeholder="Reply to customer..."
          placeholderTextColor="#999"
          style={styles.input}
          multiline
          editable={!sending}
        />

        <TouchableOpacity
          style={[
            styles.sendButton,
            sending && styles.disabledButton,
          ]}
          onPress={sendMessage}
          disabled={sending}>

          {sending ? (
            <ActivityIndicator
              size="small"
              color="#FFFFFF"
            />
          ) : (
            <Text style={styles.sendText}>
              ➤
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F9',
  },

  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F7F7F9',
  },

  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#777',
  },

  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },

  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#222',
  },

  subtitle: {
    fontSize: 13,
    color: '#777',
    marginTop: 3,
  },

  customerSection: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
    paddingHorizontal: 15,
    marginBottom: 8,
  },

  customerList: {
    paddingHorizontal: 10,
  },

  customerItem: {
    width: 150,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
  },

  activeCustomer: {
    borderColor: '#2874F0',
    backgroundColor: '#EEF5FF',
  },

  customerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#2874F0',
    alignItems: 'center',
    justifyContent: 'center',
  },

  avatarText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  customerInfo: {
    flex: 1,
    marginLeft: 8,
  },

  customerName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#333',
  },

  customerEmail: {
    fontSize: 9,
    color: '#777',
    marginTop: 2,
  },

  noCustomerText: {
    paddingHorizontal: 15,
    paddingBottom: 5,
    color: '#777',
    fontSize: 13,
  },

  selectedCustomer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#EEEEEE',
  },

  selectedName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#222',
  },

  selectedEmail: {
    fontSize: 11,
    color: '#777',
    marginTop: 2,
  },

  chatContainer: {
    padding: 15,
    paddingBottom: 20,
    flexGrow: 1,
  },

  messageRow: {
    width: '100%',
    marginBottom: 12,
  },

  userRow: {
    alignItems: 'flex-start',
  },

  adminRow: {
    alignItems: 'flex-end',
  },

  messageBubble: {
    maxWidth: '78%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
  },

  userBubble: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EEEEEE',
    borderBottomLeftRadius: 4,
  },

  adminBubble: {
    backgroundColor: '#2874F0',
    borderBottomRightRadius: 4,
  },

  senderName: {
    fontSize: 11,
    fontWeight: '700',
    color: '#777',
    marginBottom: 4,
  },

  messageText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },

  adminMessageText: {
    color: '#FFFFFF',
  },

  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 50,
  },

  emptyText: {
    color: '#777',
    fontSize: 14,
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },

  input: {
    flex: 1,
    minHeight: 45,
    maxHeight: 100,
    backgroundColor: '#F2F3F5',
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    color: '#222',
    marginRight: 8,
  },

  sendButton: {
    width: 45,
    height: 45,
    borderRadius: 23,
    backgroundColor: '#2874F0',
    alignItems: 'center',
    justifyContent: 'center',
  },

  disabledButton: {
    opacity: 0.6,
  },

  sendText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
  },
});

export default AdminHelp;