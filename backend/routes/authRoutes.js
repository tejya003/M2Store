const express = require('express');
const router = express.Router();

const { sendOtp, verifyOtp, registerUser, loginUser, googleLogin, forgotPasswordSendOtp, resetPassword, registerDeliveryPartner } = require('../controllers/authController');

router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/google-login', googleLogin);
router.post('/forgot-password-send-otp', forgotPasswordSendOtp);
router.post('/reset-password', resetPassword);
router.post('/register-delivery', registerDeliveryPartner);

module.exports = router;