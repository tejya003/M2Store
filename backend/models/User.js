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

  // 👇 नवीन: Delivery Partner साठी
  vehicleType: { type: String },       // उदा. "Bike", "Auto"
  vehicleNumber: { type: String },
  isApproved: { type: Boolean, default: false } // delivery role साठी default false ठेवू (controller मध्ये)

}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);