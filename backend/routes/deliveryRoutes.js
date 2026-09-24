const express = require('express');

const router = express.Router();

const isAdmin = require('../middleware/isAdmin');

const {createDeliveryUser} = require('../controllers/deliveryController');

// POST /api/admin/delivery
// नवीन delivery login तयार करण्यासाठी
router.post('/', isAdmin, createDeliveryUser);

module.exports = router;