const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  mobile: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, default: 'customer' },
  officeName: { type: String },

  otp: { type: String },
  otpExpiry: { type: Date },
  isEmailVerified: { type: Boolean, default: false },

  // Delivery Partner साठी
  vehicleType: { type: String },      
  vehicleNumber: { type: String },
  isApproved: { type: Boolean, default: false },

  // 👇 नवीन: Delivery Partner साठी अजून माहिती
  city: { type: String },           
  aadharNumber: { type: String },
  aadharPhoto: { type: String }        
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);