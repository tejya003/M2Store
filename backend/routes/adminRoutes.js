const express = require('express');
const router = express.Router();
const isAdmin = require('../middleware/isAdmin');
const { getDashboardStats } = require('../controllers/adminController');

router.get('/dashboard-stats', isAdmin, getDashboardStats);

module.exports = router;