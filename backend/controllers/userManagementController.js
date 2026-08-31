const User = require('../models/User');
const Order = require('../models/Order');

// GET all customers
const getAllCustomers = async (req, res) => {
  try {
    const customers = await User.find({ role: 'customer' }).select('-password');
    res.json(customers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET orders of a specific customer
const getCustomerOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getAllCustomers, getCustomerOrders };