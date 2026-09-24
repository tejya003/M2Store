const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  mobile: { type: String },
  password: { type: String },
  role: { type: String, default: 'customer' },
  officeName: { type: String },

  otp: { type: String },
  otpExpiry: { type: Date },
  isEmailVerified: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);