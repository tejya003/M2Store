const express = require('express');
const router = express.Router();

const { sendOtp, verifyOtp, registerUser, loginUser, googleLogin } = require('../controllers/authController');

router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/google-login', googleLogin);

module.exports = router;