const mongoose = require('mongoose');
const Order = require('../models/Order');

// orderId हा पूर्ण Mongo _id असू शकतो (QR मधून) किंवा फक्त शेवटचे 6 characters (barcode मधून)
// दोन्ही प्रकारांतून खरा order शोधून देणारं helper function
const findOrderByIdOrShortCode = async (orderId) => {
  // Case 1: पूर्ण, valid Mongo ObjectId असेल तर थेट शोध
  if (mongoose.Types.ObjectId.isValid(orderId) && orderId.length === 24) {
    const order = await Order.findById(orderId);
    if (order) return order;
  }

  // Case 2: short code (उदा. "4392AE") — _id च्या शेवटच्या 6 अक्षरांशी जुळणारा order शोध
  const shortCode = orderId.trim().toUpperCase();

  const matches = await Order.aggregate([
    { $addFields: { idStr: { $toUpper: { $toString: '$_id' } } } },
    { $match: { idStr: { $regex: shortCode + '$' } } },
    { $limit: 1 }
  ]);

  if (matches.length === 0) return null;

  // aggregate ने plain object दिलं, त्यामुळे पुन्हा Mongoose document म्हणून घे
  return await Order.findById(matches[0]._id);
};

// Order ला एका office/hub वर "पोहोचलं" असं mark करतं
// body: { office: "Satara" }
// params: orderId (हा order चा _id किंवा short code असू शकतो, जो barcode/QR मधून मिळतो)
const scanOrder = async (req, res) => {
  try {
    const { office } = req.body;
    const { orderId } = req.params;

    if (!office) {
      return res.status(400).json({ message: 'Office name पाठवणं गरजेचं आहे' });
    }

    const order = await findOrderByIdOrShortCode(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order सापडला नाही — barcode चुकीचा असू शकतो' });
    }

    // office नावांची तुलना case-insensitive करण्यासाठी सगळं lowercase मध्ये आणा
    const officeLower = office.trim().toLowerCase();
    const routeLower = (order.route || []).map((o) => o.trim().toLowerCase());

    // हे office त्या order च्या ठरलेल्या route मध्ये आहे का, ते तपासा
    if (routeLower.length > 0 && !routeLower.includes(officeLower)) {
      return res.status(400).json({
        message: `हा order '${office}' च्या route मध्ये नाही. ठरलेला route: ${order.route.join(' → ')}`
      });
    }

    // ह्याच office वर आधीच scan झालं असेल तर पुन्हा add करू नका (duplicate टाळण्यासाठी)
    const alreadyScannedHere = order.scanHistory.some(
      (s) => s.office.trim().toLowerCase() === officeLower
    );
    if (alreadyScannedHere) {
      return res.status(400).json({ message: `हा order आधीच '${office}' इथे scan झालेला आहे` });
    }

    // scan history मध्ये नोंद कर (मूळ office नाव जसंच्या तसं साठवतो, फक्त तुलनेसाठी lowercase वापरलं)
    order.scanHistory.push({ office, scannedAt: new Date() });

    // पुढचं office कोणतं आहे ते काढ (route मधलं याच्या पुढचं) — case-insensitive index शोध
    const currentIndex = routeLower.indexOf(officeLower);
    const nextOffice =
      currentIndex >= 0 && currentIndex < order.route.length - 1
        ? order.route[currentIndex + 1]
        : null;

    const isFinalDestination = nextOffice === null;

    // 👇 नवीन: शेवटच्या hub वर scan झाला असेल तर आपोआप "out for delivery" कर
    // म्हणजे delivery partners ला हा order लगेच दिसू लागेल
    if (isFinalDestination) {
      order.orderStatus = 'out for delivery';
    }

    await order.save();

    res.json({
      message: `Order '${office}' इथे scan झाला`,
      order,
      currentOffice: office,
      nextOffice, // null असेल तर हीच शेवटची जागा आहे (customer कडे पोहोचणार)
      isFinalDestination
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// एका order ची पूर्ण tracking माहिती मिळवा (कुठून आलं, आत्ता कुठे आहे, पुढे कुठे जाणार)
const getOrderTracking = async (req, res) => {
  try {
    const order = await findOrderByIdOrShortCode(req.params.orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order सापडला नाही' });
    }

    const scannedOffices = order.scanHistory.map((s) => s.office);
    const lastScanned = scannedOffices[scannedOffices.length - 1] || null;

    const routeLower = (order.route || []).map((o) => o.trim().toLowerCase());
    const currentIndex = lastScanned
      ? routeLower.indexOf(lastScanned.trim().toLowerCase())
      : -1;
    const nextOffice =
      currentIndex >= 0 && currentIndex < order.route.length - 1
        ? order.route[currentIndex + 1]
        : order.route[0]; // अजून काहीच scan झालं नसेल तर पहिलं office

    res.json({
      route: order.route,
      scanHistory: order.scanHistory,
      currentLocation: lastScanned || 'अजून पाठवलं नाही',
      nextOffice: nextOffice || null,
      isDelivered: order.orderStatus === 'delivered'
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { scanOrder, getOrderTracking };