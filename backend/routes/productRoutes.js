const express = require('express');
const router = express.Router();
const isAdmin = require('../middleware/isAdmin');
const upload = require('../middleware/upload');
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');

router.get('/', getProducts);
router.get('/:id', getProductById);

router.post('/', isAdmin, upload.single('image'), createProduct);
router.put('/:id', isAdmin, upload.single('image'), updateProduct);
router.delete('/:id', isAdmin, deleteProduct);

module.exports = router;