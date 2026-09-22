const express = require('express');
const router = express.Router();

const { sendOtp, verifyOtp, registerUser, loginUser, googleLogin, forgotPasswordSendOtp, resetPassword } = require('../controllers/authController');

router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/google-login', googleLogin);
router.post('/forgot-password-send-otp', forgotPasswordSendOtp);
router.post('/reset-password', resetPassword);

module.exports = router;