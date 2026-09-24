import React, {useEffect, useState} from 'react';

import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';

import {
  getChatMessages,
  sendChatMessage,
} from '../../api/chatApi';

const HelpScreen = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  // Load messages
  const loadMessages = async () => {
    try {
      const data = await getChatMessages();
      setMessages(data);
    } catch (error) {
      console.log('Load chat error:', error);
      Alert.alert('Error', error.message || 'Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  // Send message
  const sendMessage = async () => {
    if (!message.trim()) {
      return;
    }

    try {
      setSending(true);

      const data = await sendChatMessage(message.trim());

      setMessages(prev => [...prev, data.chat]);

      setMessage('');
    } catch (error) {
      console.log('Send chat error:', error);

      Alert.alert(
        'Error',
        error.message || 'Failed to send message',
      );
    } finally {
      setSending(false);
    }
  };

  const renderMessage = ({item}) => {
    const isUser = item.sender === 'user';

    return (
      <View
        style={[
          styles.messageRow,
          isUser ? styles.userRow : styles.adminRow,
        ]}>
        <View
          style={[
            styles.messageBubble,
            isUser ? styles.userBubble : styles.adminBubble,
          ]}>
          <Text
            style={[
              styles.messageText,
              isUser && styles.userMessageText,
            ]}>
            {item.message}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={90}>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Help</Text>

        <Text style={styles.headerSubtitle}>
          Chat with our support team
        </Text>
      </View>

      {/* Chat */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2874F0" />

          <Text style={styles.loadingText}>
            Loading messages...
          </Text>
        </View>
      ) : (
        <FlatList
          data={messages}
          keyExtractor={item => item._id}
          renderItem={renderMessage}
          contentContainerStyle={styles.chatContainer}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTitle}>
                Need help?
              </Text>

              <Text style={styles.emptyText}>
                Send a message to our support team.
              </Text>
            </View>
          }
        />
      )}

      {/* Message Input */}
      <View style={styles.inputContainer}>
        <TextInput
          value={message}
          onChangeText={setMessage}
          placeholder="Type your message..."
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
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.sendText}>➤</Text>
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

  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#222',
  },

  headerSubtitle: {
    fontSize: 13,
    color: '#777',
    marginTop: 3,
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
    alignItems: 'flex-end',
  },

  adminRow: {
    alignItems: 'flex-start',
  },

  messageBubble: {
    maxWidth: '78%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
  },

  userBubble: {
    backgroundColor: '#2874F0',
    borderBottomRightRadius: 4,
  },

  adminBubble: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },

  messageText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },

  userMessageText: {
    color: '#FFFFFF',
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

  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  loadingText: {
    marginTop: 10,
    color: '#777',
    fontSize: 14,
  },

  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 6,
  },

  emptyText: {
    fontSize: 14,
    color: '#777',
  },
});

export default HelpScreen;