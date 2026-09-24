const express = require('express');

const isAuth = require('../middleware/isAuth');
const isAdmin = require('../middleware/isAdmin');

const {
  sendMessage,
  getUserMessages,
  getAllChats,
  adminReply,
} = require('../controllers/chatController');

const router = express.Router();

// ==================== CUSTOMER ====================

// Customer sends message
router.post('/', isAuth, sendMessage);

// Customer gets own messages
router.get('/', isAuth, getUserMessages);


// ==================== ADMIN ====================

// Admin gets all customer chats
router.get('/admin', isAdmin, getAllChats);

// Admin replies to customer
router.post('/admin/reply', isAdmin, adminReply);

module.exports = router;