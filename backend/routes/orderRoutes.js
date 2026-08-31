const express = require('express');
const router = express.Router();
const isAdmin = require('../middleware/isAdmin');
const { getAllOrders, updateOrderStatus } = require('../controllers/orderController');

router.get('/', isAdmin, getAllOrders);
router.put('/:id/status', isAdmin, updateOrderStatus);

module.exports = router;