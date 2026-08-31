const express = require('express');
const router = express.Router();
const isAdmin = require('../middleware/isAdmin');
const { getAllCustomers, getCustomerOrders } = require('../controllers/userManagementController');

router.get('/', isAdmin, getAllCustomers);
router.get('/:id/orders', isAdmin, getCustomerOrders);

module.exports = router;