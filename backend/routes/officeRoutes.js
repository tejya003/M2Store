const express = require('express');
const router = express.Router();
const isAdmin = require('../middleware/isAdmin');
const { createOfficeUser, getAllOfficeUsers } = require('../controllers/officeController');

// POST /api/admin/offices   body: { name, username, password, officeName }
router.post('/', isAdmin, createOfficeUser);

// GET /api/admin/offices
router.get('/', isAdmin, getAllOfficeUsers);

module.exports = router;