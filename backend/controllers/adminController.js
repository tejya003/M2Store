const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

// GET dashboard stats (overview)
const getDashboardStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalUsers = await User.countDocuments({ role: 'customer' });
    const totalProducts = await Product.countDocuments();

    // Total sales = sum of totalAmount for all orders (not cancelled)
    const salesResult = await Order.aggregate([
      { $match: { orderStatus: { $ne: 'cancelled' } } },
      { $group: { _id: null, totalSales: { $sum: '$totalAmount' } } }
    ]);
    const totalSales = salesResult.length > 0 ? salesResult[0].totalSales : 0;

    // Revenue grouped by month (last 6 months) for chart
    const revenueByMonth = await Order.aggregate([
      { $match: { orderStatus: { $ne: 'cancelled' } } },
      {
        $group: {
          _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
          revenue: { $sum: '$totalAmount' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Low stock products (stock less than 5)
    const lowStockProducts = await Product.find({ stock: { $lt: 5 } }).select('name stock');

    res.json({
      totalOrders,
      totalUsers,
      totalProducts,
      totalSales,
      revenueByMonth,
      lowStockProducts
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getDashboardStats };