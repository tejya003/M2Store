const express = require('express');
const router = express.Router();
const isAdmin = require('../middleware/isAdmin');
const isAuth = require('../middleware/isAuth');
const { createOrder, getMyOrders, getAllOrders, updateOrderStatus } = require('../controllers/orderController');

// Customer routes
router.post('/', isAuth, createOrder);
router.get('/my-orders', isAuth, getMyOrders);

// Admin routes
router.get('/', isAdmin, getAllOrders);
router.put('/:id/status', isAdmin, updateOrderStatus);

module.exports = router;