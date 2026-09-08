const Order = require('../models/Order');
const Product = require('../models/Product');
const { SHOP_LOCATION, getDistanceKm, estimateDeliveryDays } = require('../utils/distance'); // 👈 नवीन line

// पत्त्यावरून latitude/longitude शोधणारं helper function (मोफत OpenStreetMap सेवा वापरून)
const getCoordinatesFromAddress = async (addressLine, city, pincode) => {
  try {
    const query = encodeURIComponent(`${addressLine}, ${city}, ${pincode}, India`);
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`,
      { headers: { 'User-Agent': 'M2Store-App' } }
    );
    const data = await response.json();

    if (data && data.length > 0) {
      return { latitude: parseFloat(data[0].lat), longitude: parseFloat(data[0].lon) };
    }
    return null;
  } catch (err) {
    console.log('Geocoding error:', err.message);
    return null;
  }
};

// CREATE order (customer)
const createOrder = async (req, res) => {
  try {
    const { items, totalAmount, shippingAddress, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Order must have at least one item' });
    }

    // Step 1: आधी सगळ्या products चा stock check कर
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.name}` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `${item.name} - फक्त ${product.stock} उपलब्ध आहे`
        });
      }
    }

    // Step 2: पत्त्यावरून coordinates शोध (शोधलं नाही तरी order अडणार नाही)
    let finalAddress = { ...shippingAddress };
    const coords = await getCoordinatesFromAddress(
      shippingAddress?.addressLine,
      shippingAddress?.city,
      shippingAddress?.pincode
    );

    let autoDeliveryDays = null; // 👈 नवीन

    if (coords) {
      finalAddress.latitude = coords.latitude;
      finalAddress.longitude = coords.longitude;

      // 👇 नवीन भाग: shop ते customer अंतर काढून delivery days ठरव
      const distanceKm = getDistanceKm(
        SHOP_LOCATION.latitude,
        SHOP_LOCATION.longitude,
        coords.latitude,
        coords.longitude
      );
      autoDeliveryDays = estimateDeliveryDays(distanceKm);
    }

    // Step 3: Order तयार कर
    const order = new Order({
      user: req.user._id,
      items,
      totalAmount,
      shippingAddress: finalAddress,
      orderStatus: 'pending',
      paymentStatus: paymentMethod === 'Online' ? 'paid' : 'pending',
      expectedDeliveryDays: autoDeliveryDays // 👈 नवीन line
    });

    await order.save();

    // Step 4: प्रत्येक product चा stock कमी कर
    for (const item of items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity }
      });
    }

    res.status(201).json({ message: 'Order placed successfully', order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET logged-in customer's own orders
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET all orders (admin) - includes user info + product barcode
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name username email mobile')
      .populate('items.product', 'barcode')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE order status (admin)
const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus, expectedDeliveryDays } = req.body;

    const validStatuses = ['pending', 'confirmed', 'shipped', 'out for delivery', 'delivered', 'cancelled'];
    if (!validStatuses.includes(orderStatus)) {
      return res.status(400).json({ message: 'Invalid order status' });
    }

    const updateData = { orderStatus };

    // जेव्हा order confirm होतो, तेव्हा दिवस आणि confirm-date साठव
    if (orderStatus === 'confirmed') {
      updateData.confirmedAt = new Date();
      if (expectedDeliveryDays) {
        updateData.expectedDeliveryDays = expectedDeliveryDays;
      }
    }

    const updated = await Order.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: 'Order not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createOrder, getMyOrders, getAllOrders, updateOrderStatus };