require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

const categoryImageMap = {
  'Electronics': 'electronics.jpg',
  'Fashion Men': 'fashionmen.jpg',
  'Fashion Women': 'fashionwomen.jpg',
  'Home Kitchen': 'homekitchen.jpg',
  'Books': 'books.jpg',
  'Beauty': 'beauty.jpg',
  'Sports': 'sports.jpg',
  'Toys': 'toys.jpg',
  'Furniture': 'furniture.jpg',
  'Grocery': 'grocery.jpg'
};

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('MongoDB connected');

  for (const [category, imageFile] of Object.entries(categoryImageMap)) {
    const products = await Product.find({ category });
    console.log(`\n${category}: ${products.length} products found`);

    for (const product of products) {
      const currentImage = product.images && product.images[0];

      // Skip products that already have a real (non-placeholder) image
      if (currentImage && currentImage !== '/uploads/placeholder.jpg') {
        console.log(`  Skipped (already has image): ${product.name}`);
        continue;
      }

      product.images = [`/uploads/${imageFile}`];
      await product.save();
      console.log(`  Updated: ${product.name} -> ${imageFile}`);
    }
  }

  console.log('\nDone!');
  mongoose.disconnect();
};

run();