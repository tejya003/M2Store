const express = require('express');
const router = express.Router();
const { scanOrder, getOrderTracking } = require('../controllers/scanController');

// POST /api/orders/:orderId/scan   body: { office: "Satara" }
router.post('/:orderId/scan', scanOrder);

// GET /api/orders/:orderId/tracking
router.get('/:orderId/tracking', getOrderTracking);

module.exports = router;