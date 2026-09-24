const Chat = require('../models/Chat');

// ==================== CUSTOMER ====================

// Send message
const sendMessage = async (req, res) => {
  try {
    const {message} = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        message: 'Message is required',
      });
    }

    const chat = await Chat.create({
      userId: req.user._id,
      sender: 'user',
      message: message.trim(),
    });

    res.status(201).json({
      message: 'Message sent successfully',
      chat,
    });
  } catch (error) {
    console.log('Send chat error:', error);

    res.status(500).json({
      message: 'Failed to send message',
    });
  }
};

// Get logged-in user's messages
const getUserMessages = async (req, res) => {
  try {
    const chats = await Chat.find({
      userId: req.user._id,
    }).sort({createdAt: 1});

    res.status(200).json(chats);
  } catch (error) {
    console.log('Get user chats error:', error);

    res.status(500).json({
      message: 'Failed to get messages',
    });
  }
};

// ==================== ADMIN ====================

// Get all customer chats
const getAllChats = async (req, res) => {
  try {
    const chats = await Chat.find()
      .populate('userId', 'name username email mobile')
      .sort({createdAt: 1});

    res.status(200).json(chats);
  } catch (error) {
    console.log('Get all chats error:', error);

    res.status(500).json({
      message: 'Failed to get customer chats',
    });
  }
};

// Admin sends reply
const adminReply = async (req, res) => {
  try {
    const {userId, message} = req.body;

    if (!userId) {
      return res.status(400).json({
        message: 'User ID is required',
      });
    }

    if (!message || !message.trim()) {
      return res.status(400).json({
        message: 'Message is required',
      });
    }

    const chat = await Chat.create({
      userId,
      sender: 'admin',
      message: message.trim(),
    });

    res.status(201).json({
      message: 'Reply sent successfully',
      chat,
    });
  } catch (error) {
    console.log('Admin reply error:', error);

    res.status(500).json({
      message: 'Failed to send reply',
    });
  }
};

module.exports = {
  sendMessage,
  getUserMessages,
  getAllChats,
  adminReply,
};