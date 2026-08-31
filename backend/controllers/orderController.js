const Order = require('../models/Order');

// GET all orders (admin) - includes user info
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name username email mobile')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE order status (admin)
const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;

    const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(orderStatus)) {
      return res.status(400).json({ message: 'Invalid order status' });
    }

    const updated = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: 'Order not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getAllOrders, updateOrderStatus };