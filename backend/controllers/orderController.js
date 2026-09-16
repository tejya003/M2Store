const Order = require('../models/Order');
const Product = require('../models/Product');
const { SHOP_LOCATION, getDistanceKm, estimateDeliveryDays } = require('../utils/distance');
const { getRouteForCity } = require('../utils/routeConfig'); // 👈 नवीन

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

    let autoDeliveryDays = null;

    if (coords) {
      finalAddress.latitude = coords.latitude;
      finalAddress.longitude = coords.longitude;

      const distanceKm = getDistanceKm(
        SHOP_LOCATION.latitude,
        SHOP_LOCATION.longitude,
        coords.latitude,
        coords.longitude
      );
      autoDeliveryDays = estimateDeliveryDays(distanceKm);
    }

    // 👇 नवीन: city वरून route आपोआप ठरव
    const route = getRouteForCity(shippingAddress?.city);

    // Step 3: Order तयार कर
    const order = new Order({
      user: req.user._id,
      items,
      totalAmount,
      shippingAddress: finalAddress,
      orderStatus: 'pending',
      paymentStatus: paymentMethod === 'Online' ? 'paid' : 'pending',
      expectedDeliveryDays: autoDeliveryDays,
      route, // 👈 नवीन
      scanHistory: [] // 👈 नवीन: सुरुवातीला रिकामं, scan होईल तसं भरत जाईल
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
};// GET printable invoice HTML (browser मध्ये उघडण्यासाठी) — receipt-style डिझाईन
const getInvoiceHtml = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name')
      .populate('items.product', 'barcode');

    if (!order) return res.status(404).send('<h2>Order not found</h2>');

    const SHOP_NAME = 'M2 Store';
    const SHOP_ADDRESS = 'Mahalaxmi Pride, Rajarampuri Lane 6, Takala Side, Kolhapur, Maharashtra 416008';
    const TRACK_BASE_URL = 'https://m2store.example.com/order';
    const orderIdShort = order._id.toString().slice(-6).toUpperCase();
    const trackingUrl = `${TRACK_BASE_URL}/${order._id}`;

    const formatDate = (d) => {
      if (!d) return '—';
      const dt = new Date(d);
      return dt.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) +
        ', ' + dt.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    };

    const itemsHtml = order.items.map((item) => `
      <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
        <span style="color:#5c5c56; font-size:13px;">${item.name} × ${item.quantity}</span>
        <span style="color:#1c1c1a; font-size:13px;">₹${item.price * item.quantity}</span>
      </div>
    `).join('');

    const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(trackingUrl)}`;
    const barcodeImageUrl = `https://barcodeapi.org/api/128/${orderIdShort}`;

    const html = `
      <html>
        <head><meta name="viewport" content="width=device-width, initial-scale=1"></head>
        <body style="background:#e9e7df; padding:20px; font-family: Helvetica, Arial, sans-serif;">
          <div style="max-width:380px; margin:0 auto; background:#fbfaf6; padding:22px 18px; border-radius:2px;">

            <div style="text-align:center; padding-bottom:14px; margin-bottom:14px; border-bottom:1px dashed #1c1c1a;">
              <div style="font-size:20px; font-weight:bold; color:#1c1c1a; letter-spacing:0.5px;">${SHOP_NAME}</div>
              <div style="font-size:11px; color:#5c5c56; margin-top:4px;">${SHOP_ADDRESS}</div>
            </div>

            <div style="text-align:center; margin-bottom:14px;">
              <span style="border:1px solid #b5482f; border-radius:2px; padding:3px 10px; color:#b5482f; font-weight:bold; font-size:11px;">
                ORDER #${orderIdShort}
              </span>
            </div>

            <div style="margin-bottom:14px;">
              <div style="font-size:10px; color:#5c5c56; margin-bottom:6px; text-transform:uppercase;">customer</div>
              <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                <span style="color:#5c5c56; font-size:13px;">Name</span>
                <span style="color:#1c1c1a; font-size:13px;">${order.shippingAddress?.fullName || order.user?.name || ''}</span>
              </div>
              <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                <span style="color:#5c5c56; font-size:13px;">Mobile</span>
                <span style="color:#1c1c1a; font-size:13px;">${order.shippingAddress?.mobile || ''}</span>
              </div>
              <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                <span style="color:#5c5c56; font-size:13px;">Address</span>
                <span style="color:#1c1c1a; font-size:13px; text-align:right; max-width:60%;">
                  ${order.shippingAddress?.addressLine || ''}, ${order.shippingAddress?.city || ''} - ${order.shippingAddress?.pincode || ''}
                </span>
              </div>
            </div>

            <div style="margin-bottom:14px;">
              <div style="font-size:10px; color:#5c5c56; margin-bottom:6px; text-transform:uppercase;">order</div>
              <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                <span style="color:#5c5c56; font-size:13px;">Date</span>
                <span style="color:#1c1c1a; font-size:13px;">${formatDate(order.createdAt)}</span>
              </div>
              <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                <span style="color:#5c5c56; font-size:13px;">Status</span>
                <span style="color:#1c1c1a; font-size:13px;">${order.orderStatus}</span>
              </div>
              <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                <span style="color:#5c5c56; font-size:13px;">Delivery</span>
                <span style="color:#1c1c1a; font-size:13px;">${order.expectedDeliveryDays ? order.expectedDeliveryDays + ' days' : '—'}</span>
              </div>
            </div>

            <div style="margin-bottom:14px;">
              <div style="font-size:10px; color:#5c5c56; margin-bottom:6px; text-transform:uppercase;">items</div>
              ${itemsHtml}
            </div>

            <div style="border-top:1px dashed #1c1c1a; margin:12px 0;"></div>

            <div style="display:flex; justify-content:space-between;">
              <span style="font-weight:bold; font-size:15px; color:#1c1c1a;">Total</span>
              <span style="font-weight:bold; font-size:15px; color:#1c1c1a;">₹${order.totalAmount}</span>
            </div>

            <div style="text-align:center; margin-top:18px; padding-top:16px; border-top:1px dashed #1c1c1a;">
              <div style="margin-bottom:16px;">
                <img src="${qrImageUrl}" width="110" height="110" style="background:#fff; padding:6px;" />
                <div style="font-size:9.5px; letter-spacing:1px; color:#5c5c56; margin-top:6px;">SCAN TO TRACK ORDER</div>
              </div>
              <div>
                <img src="${barcodeImageUrl}" style="height:50px;" />
                <div style="font-size:9.5px; letter-spacing:1px; color:#5c5c56; margin-top:6px;">ORDER #${orderIdShort}</div>
              </div>
            </div>

            <div style="text-align:center; margin-top:10px; font-size:10px; color:#5c5c56;">
              Thank you for shopping with ${SHOP_NAME}
            </div>
          </div>
          <script>window.onload = function() { setTimeout(function(){ window.print(); }, 500); };</script>
        </body>
      </html>
    `;

    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  } catch (err) {
    res.status(500).send('<h2>Error generating invoice</h2>');
  }
};

module.exports = { createOrder, getMyOrders, getAllOrders, updateOrderStatus, getInvoiceHtml };