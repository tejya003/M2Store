const bcrypt = require('bcryptjs');
const User = require('../models/User');

// नवीन delivery login तयार करण्यासाठी
// body: { name, username, password }

const createDeliveryUser = async (req, res) => {
  try {
    const { name, username, password } = req.body;

    if (!name || !username || !password) {
      return res.status(400).json({
        message: 'name, username, password सगळं गरजेचं आहे',
      });
    }

    const existing = await User.findOne({username});

    if (existing) {
      return res.status(400).json({
        message: 'हा username आधीच वापरलेला आहे',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const deliveryUser = new User({
      name,
      username,
      email: `${username}@m2store-delivery.local`,
      mobile: '0000000000',
      password: hashedPassword,
      role: 'delivery',
      isEmailVerified: true,
    });

    await deliveryUser.save();

    res.status(201).json({
      message: 'Delivery login तयार झाला',
      username,
      role: 'delivery',
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

module.exports = {
  createDeliveryUser,
};