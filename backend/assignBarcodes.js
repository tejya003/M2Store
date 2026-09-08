require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('MongoDB connected');

  // ज्यांना अजून barcode नाही असे सगळे products शोध
  const products = await Product.find({
    $or: [{ barcode: { $exists: false } }, { barcode: null }]
  });

  console.log(`\nBarcode नसलेले ${products.length} products सापडले`);

  for (const product of products) {
    product.barcode = product._id.toString().toUpperCase();
    await product.save();
    console.log(`  Updated: ${product.name} -> ${product.barcode}`);
  }

  console.log('\nDone!');
  mongoose.disconnect();
};

run();