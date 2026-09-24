const express = require('express');
const router = express.Router();
const isAuth = require('../middleware/isAuth');
const {
  getAvailableOrders,
  acceptOrder,
  getMyDeliveries,
  markDelivered
} = require('../controllers/orderController');

// फक्त 'delivery' role च्या users ला परवानगी
const isDeliveryPartner = (req, res, next) => {
  if (!req.user || req.user.role !== 'delivery') {
    return res.status(403).json({ message: 'Delivery partner access only' });
  }
  next();
};

// GET /api/delivery/available — उचलायला उपलब्ध orders
router.get('/available', isAuth, isDeliveryPartner, getAvailableOrders);

// POST /api/delivery/:id/accept — order स्वतःकडे घे
router.post('/:id/accept', isAuth, isDeliveryPartner, acceptOrder);

// GET /api/delivery/my-deliveries — स्वतःचे accept केलेले orders
router.get('/my-deliveries', isAuth, isDeliveryPartner, getMyDeliveries);

// POST /api/delivery/:id/delivered — delivered म्हणून mark कर
router.post('/:id/delivered', isAuth, isDeliveryPartner, markDelivered);

module.exports = router;