const PDFDocument = require('pdfkit');
const QRCode = require('qrcode');
const bwipjs = require('bwip-js');
const express = require('express');
const router = express.Router();
const Order = require('../models/Order'); // तुमचं order model

router.get('/invoice/:orderId', async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId).populate('items.product');
    if (!order) return res.status(404).json({ message: 'Order not found' });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename=Invoice_${order._id}.pdf`);

    // 4x6 inch = 288 x 432 points (72 points per inch)
    const doc = new PDFDocument({ size: [288, 432], margin: 12 });
    doc.pipe(res);

    // ---- Header ----
    doc.fontSize(14).fillColor('#000000').text('M2 Store', { align: 'center' });
    doc.fontSize(7).fillColor('#000000').text(
      'Mahalaxmi Pride, Rajarampuri lane 6, Takala Side, Kolhapur, Maharashtra, India 416008',
      { align: 'center' }
    );
    doc.moveDown(0.5);
    doc.moveTo(12, doc.y).lineTo(276, doc.y).strokeColor('#000000').stroke();
    doc.moveDown(0.5);

    // ---- Order Info ----
    doc.fontSize(9).fillColor('#000000').text(`Order #${order._id.toString().slice(-6).toUpperCase()}`);
    doc.fontSize(7).fillColor('#000000');
    doc.text(`Date: ${new Date(order.createdAt).toLocaleString('en-IN')}`);
    doc.text(`Status: ${order.orderStatus}`);
    doc.moveDown(0.5);

    // ---- Customer Info ----
    doc.fontSize(8).fillColor('#000000').text('Customer:', { continued: false });
    doc.fontSize(7).fillColor('#000000').text(order.user?.email || '—');
    doc.text(order.shippingAddress?.fullName || order.user?.name || '—');
    doc.text(order.shippingAddress?.mobile || '—');
    doc.text(
      `${order.shippingAddress?.addressLine || ''}, ${order.shippingAddress?.city || ''} - ${order.shippingAddress?.pincode || ''}`
    );
    doc.moveDown(0.5);

    // ---- Items with barcode ----
    doc.fontSize(8).fillColor('#000000').text('Items:', { underline: true });
    doc.moveDown(0.2);

    for (const item of order.items) {
      doc.fontSize(7.5).fillColor('#000000').text(
        `${item.name}  x${item.quantity}   ₹${item.price * item.quantity}`
      );

      const barcodeValue = item.product?.barcode;
      if (barcodeValue) {
        try {
          const barcodePng = await bwipjs.toBuffer({
            bcid: 'code128',
            text: String(barcodeValue),
            scale: 2,
            height: 8,
            includetext: true,
            textxalign: 'center',
          });
          doc.image(barcodePng, { width: 120 });
        } catch (e) {
          doc.fontSize(6).fillColor('#000000').text('(barcode error)');
        }
      }
      doc.moveDown(0.3);
    }

    doc.moveDown(0.3);
    doc.moveTo(12, doc.y).lineTo(276, doc.y).strokeColor('#000000').stroke();
    doc.moveDown(0.3);

    // ---- Total ----
    doc.fontSize(10).fillColor('#000000').text(`Total: ₹${order.totalAmount}`, { align: 'right' });
    doc.moveDown(0.5);

    // ---- QR Code linking to this same invoice PDF (customer साठी) ----
    const qrData = `https://m2store-backend.onrender.com/api/invoice/${order._id}`;
    const qrPng = await QRCode.toBuffer(qrData, { width: 100, margin: 1 });

    const qrX = (288 - 80) / 2; // center horizontally
    doc.image(qrPng, qrX, doc.y, { width: 80 });
    doc.moveDown(6);

    doc.fontSize(6).fillColor('#000000').text('Scan for order details', { align: 'center' });
    doc.moveDown(0.5);

    // ---- Order ID Barcode (office/hub scanning साठी — handheld scanner ने वापरायचा) ----
    const orderIdBarcode = await bwipjs.toBuffer({
      bcid: 'code128',
      text: order._id.toString(),
      scale: 2,
      height: 10,
      includetext: false, // number खाली छापायला नको, वर वेगळं text टाकू
    });
    const barcodeX = (288 - 160) / 2;
    doc.image(orderIdBarcode, barcodeX, doc.y, { width: 160 });
    doc.moveDown(2.5);

    doc.fontSize(7).fillColor('#000000').text('Office Scan साठी (Order ID)', { align: 'center' });
    doc.moveDown(0.3);
    doc.fontSize(6).fillColor('#000000').text(`धन्यवाद! — M2 Store`, { align: 'center' });

    doc.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;