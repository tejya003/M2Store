const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const isAuth = require('../middleware/isAuth');

const {
  sendOtp,
  verifyOtp,
  registerUser,
  loginUser,
  googleLogin,
  forgotPasswordSendOtp,
  resetPassword,
  registerDeliveryPartner,
  getAllDeliveryPartners,
  toggleBlockPartner
} = require('../controllers/authController');

// फक्त 'admin' role च्या users ला परवानगी
const isAdminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access only' });
  }
  next();
};

router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/google-login', googleLogin);
router.post('/forgot-password-send-otp', forgotPasswordSendOtp);
router.post('/reset-password', resetPassword);
router.post('/register-delivery', upload.single('aadharPhoto'), registerDeliveryPartner);

// Admin: सगळे delivery partners
router.get('/delivery-partners', isAuth, isAdminOnly, getAllDeliveryPartners);

// Admin: partner block / unblock
router.post('/delivery-partners/:id/block', isAuth, isAdminOnly, toggleBlockPartner);

module.exports = router;