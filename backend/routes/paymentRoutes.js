const express = require('express');
const router = express.Router();
const isAuth = require('../middleware/isAuth');
const { createRazorpayOrder, verifyPayment } = require('../controllers/paymentController');

router.post('/create-order', isAuth, createRazorpayOrder);
router.post('/verify', isAuth, verifyPayment);

module.exports = router;