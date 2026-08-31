const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

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
    console.log('Verify OTP request:', email, otp);

    const record = tempOtpStore[email];
    console.log('Stored record:', record);

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
    console.log('Register request body:', req.body);

    const { name, username, email, mobile, password } = req.body;

    const record = tempOtpStore[email];
    console.log('OTP record:', record);

    if (!record || !record.verified) {
      return res.status(400).json({ message: 'Please verify email OTP first' });
    }

    console.log('Checking existing user...');
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    console.log('Existing user check done:', existingUser);

    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    console.log('Hashing password...');
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Password hashed');

    const user = new User({
      name,
      username,
      email,
      mobile,
      password: hashedPassword,
      isEmailVerified: true
    });

    console.log('Saving user...');
    await user.save();
    console.log('User saved successfully');

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
        role: user.role
      }
    });
  } catch (err) {
  console.error('REGISTER ERROR:', err);
  res.status(500).json({ message: err.message });
}
};

module.exports = { sendOtp, verifyOtp, registerUser, loginUser };
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Google Sign-In Function
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

    const { email, name, picture } = ticket.getPayload();

    // Check if user already exists
    let user = await User.findOne({ email });

    if (!user) {
      // Create new user if not exists
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

    // Generate JWT token
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'secretKey', {
      expiresIn: '7d',
    });

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

// module.exports मध्ये googleLogin add करा:
module.exports = {
  sendOtp,
  verifyOtp,
  registerUser,
  loginUser,
  googleLogin, // <-- हे नवीन जोडले
};