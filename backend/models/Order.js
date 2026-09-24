const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true }
    }
  ],

  totalAmount: { type: Number, required: true },

  shippingAddress: {
    fullName: { type: String },
    mobile: { type: String },
    addressLine: { type: String },
    city: { type: String },
    pincode: { type: String },
    latitude: { type: Number },
    longitude: { type: Number }
  },

  orderStatus: {
    type: String,
    enum: ['pending', 'confirmed', 'shipped', 'out for delivery', 'delivered', 'cancelled'],
    default: 'pending'
  },

  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  },

  expectedDeliveryDays: { type: Number },
  confirmedAt: { type: Date },

  // कोणत्या hubs मधून जाणार आहे (उदा. ['Kolhapur', 'Satara', 'Pune'])
  route: [{ type: String }],

  // प्रत्येक hub वर scan झाल्याची नोंद
  scanHistory: [
    {
      office: { type: String },
      scannedAt: { type: Date, default: Date.now }
    }
  ],

  // 👇 नवीन: Delivery Partner संबंधित माहिती
  assignedDeliveryPartner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  deliveryStatus: {
    type: String,
    enum: ['unassigned', 'accepted', 'delivered'],
    default: 'unassigned'
  },
  deliveryAcceptedAt: { type: Date },
  deliveredAt: { type: Date },
  deliveryProof: { type: String } // फोटो URL (Cloudinary), optional

}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);