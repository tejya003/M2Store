const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Temporary store for otp before user registers (email -> otp)
const tempOtpStore = {};

// SEND OTP
const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    tempOtpStore[email] = { otp, expiry: Date.now() + 5 * 60 * 1000 };

    await sendEmail(email, 'Your OTP Code', `Your OTP is ${otp}. It is valid for 5 minutes.`);

    res.json({ message: 'OTP sent successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// VERIFY OTP
const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const record = tempOtpStore[email];

    if (!record) return res.status(400).json({ message: 'No OTP found, please request again' });
    if (Date.now() > record.expiry) return res.status(400).json({ message: 'OTP expired' });
    if (record.otp !== otp) return res.status(400).json({ message: 'Invalid OTP' });

    tempOtpStore[email].verified = true;
    res.json({ message: 'OTP verified successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// REGISTER
const registerUser = async (req, res) => {
  try {
    const { name, username, email, mobile, password } = req.body;

    const record = tempOtpStore[email];
    if (!record || !record.verified) {
      return res.status(400).json({ message: 'Please verify email OTP first' });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      username,
      email,
      mobile,
      password: hashedPassword,
      isEmailVerified: true
    });

    await user.save();
    delete tempOtpStore[email];

    res.status(201).json({ message: 'Registration successful' });
  } catch (err) {
    console.error('REGISTER ERROR:', err);
    res.status(500).json({ message: err.message });
  }
};

// LOGIN (username + password)
const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: 'Invalid username or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid username or password' });

    // Delivery partner असेल आणि अजून admin ने approve केलं नसेल तर login अडवा
    if (user.role === 'delivery' && !user.isApproved) {
      return res.status(403).json({ message: 'तुमचा अर्ज अजून admin कडून approve झालेला नाही' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
        officeName: user.officeName || null, // office login असेल तर त्यांचं office नाव
        vehicleType: user.vehicleType || null, // delivery partner असेल तर वाहन प्रकार
        city: user.city || null // 👈 नवीन — delivery partner ची city
      }
    });
  } catch (err) {
    console.error('LOGIN ERROR:', err);
    res.status(500).json({ message: err.message });
  }
};

// GOOGLE LOGIN
const googleLogin = async (req, res) => {
  try {
    const { idToken } = req.body;
    if (!idToken) {
      return res.status(400).json({ message: 'ID Token is required' });
    }

    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { email, name } = ticket.getPayload();

    let user = await User.findOne({ email });

    if (!user) {
      const randomUsername = email.split('@')[0] + Math.floor(1000 + Math.random() * 9000);
      user = new User({
        name,
        email,
        username: randomUsername,
        isEmailVerified: true,
        role: 'customer'
      });
      await user.save();
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Google Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        role: user.role,
      },
    });
  } catch (err) {
    console.error('Google Login Error:', err);
    res.status(500).json({ message: 'Google Sign-In failed on server' });
  }
};

// FORGOT PASSWORD - Send OTP
const forgotPasswordSendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'या email ने कुठलाही account सापडला नाही' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    tempOtpStore[email] = { otp, expiry: Date.now() + 5 * 60 * 1000, forPasswordReset: true };

    await sendEmail(email, 'Password Reset OTP', `Your password reset OTP is ${otp}. It is valid for 5 minutes.`);

    res.json({ message: 'OTP sent successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// FORGOT PASSWORD - Verify OTP and Reset Password
const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const record = tempOtpStore[email];

    if (!record) return res.status(400).json({ message: 'No OTP found, please request again' });
    if (Date.now() > record.expiry) return res.status(400).json({ message: 'OTP expired' });
    if (record.otp !== otp) return res.status(400).json({ message: 'Invalid OTP' });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    delete tempOtpStore[email];

    res.json({ message: 'Password reset successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// REGISTER — Delivery Partner
const registerDeliveryPartner = async (req, res) => {
  try {
    const { name, username, email, mobile, password, vehicleType, vehicleNumber, city, aadharNumber } = req.body;

    if (!name || !username || !email || !mobile || !password || !vehicleType || !vehicleNumber || !city || !aadharNumber) {
      return res.status(400).json({ message: 'सगळी माहिती भरणं गरजेचं आहे' });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'हा username किंवा email आधीच वापरलेला आहे' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Aadhar फोटो अपलोड झाला असेल तर त्याचा path साठव (multer मुळे req.file मिळतं)
    const aadharPhotoPath = req.file ? `/uploads/${req.file.filename}` : null;

    const user = new User({
      name,
      username,
      email,
      mobile,
      password: hashedPassword,
      role: 'delivery',
      vehicleType,
      vehicleNumber,
      city,
      aadharNumber,
      aadharPhoto: aadharPhotoPath,
      isApproved: true,
      isEmailVerified: true
    });

    await user.save();

    res.status(201).json({
      message: 'नोंदणी यशस्वी झाली! आता तुम्ही login करू शकता.'
    });
  } catch (err) {
    console.error('DELIVERY PARTNER REGISTER ERROR:', err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  sendOtp,
  verifyOtp,
  registerUser,
  loginUser,
  googleLogin,
  forgotPasswordSendOtp,
  resetPassword,
  registerDeliveryPartner
};