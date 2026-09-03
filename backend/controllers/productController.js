const Product = require('../models/Product');

// GET all products
const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET single product by id
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// CREATE new product
const createProduct = async (req, res) => {
  try {
    const productData = { ...req.body };

    if (req.body.imageUrl && req.body.imageUrl.trim() !== '') {
      productData.images = [req.body.imageUrl.trim()];
    } else if (req.file) {
      productData.images = [`/uploads/${req.file.filename}`];
    }

    delete productData.imageUrl;

    const product = new Product(productData);
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// UPDATE product
const updateProduct = async (req, res) => {
  try {
    const productData = { ...req.body };

    if (req.body.imageUrl && req.body.imageUrl.trim() !== '') {
      productData.images = [req.body.imageUrl.trim()];
    } else if (req.file) {
      productData.images = [`/uploads/${req.file.filename}`];
    }

    delete productData.imageUrl;

    const updated = await Product.findByIdAndUpdate(req.params.id, productData, { new: true });
    if (!updated) return res.status(404).json({ message: 'Product not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE product
const deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct };