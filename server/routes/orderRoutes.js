import express from 'express';
import PDFDocument from 'pdfkit';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

/* ============================
   CREATE ORDER (USER)
   POST /orders
============================ */
router.post('/', protect, async (req, res) => {
  try {
    const {
      items,
      customerName,
      phone,
      county,
      subcounty,
      area,
      paymentMethod,
      totalAmount,
      paymentReference,
    } = req.body;

    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    // Stock validation
    for (const item of items) {
      const productId = item.productId || item._id;
      const product = await Product.findById(productId);

      if (!product) {
        return res.status(400).json({ message: 'Product not found' });
      }

      const requiredStock = item.qty * item.piecesPerUnit;

      if (product.stock < requiredStock) {
        return res.status(400).json({
          message: `Insufficient stock for ${product.name} (${item.unitName})`,
        });
      }

      product.stock -= requiredStock;
      await product.save();
    }

    const order = await Order.create({
      user: req.user._id,
      items: items.map(i => ({
        productId: i.productId || i._id,
        name: i.name,
        unitName: i.unitName,
        piecesPerUnit: i.piecesPerUnit,
        qty: i.qty,
        unitPrice: i.unitPrice,
        image: i.image,
      })),
      customerName,
      phone,
      county,
      subcounty,
      area,
      paymentMethod,
      paymentReference,
      totalAmount,
      status: 'pending',
    });

    // 🔔 Real-time emit
    const io = req.app.get('io');
    if (io) {
      io.emit('newOrder', order);
    }

    res.status(201).json(order);
  } catch (err) {
    console.error('Create order error:', err);
    res.status(500).json({
      message: err.message || 'Failed to create order',
    });
  }
});

/* ============================
   USER: MY ORDERS
============================ */
router.get('/my', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load orders' });
  }
});

/* ============================
   ADMIN: ALL ORDERS
============================ */
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'username email')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error('Admin orders error:', err);
    res.status(500).json({ message: 'Failed to load admin orders' });
  }
});

/* ============================
   ADMIN: UPDATE STATUS
============================ */
router.patch('/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const { status, paymentReference } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const allowedTransitions = {
      pending: ['paid'],
      paid: ['ready_for_delivery'],
      ready_for_delivery: ['delivered'],
      delivered: [],
    };

    if (!allowedTransitions[order.status]?.includes(status)) {
      return res.status(400).json({
        message: `Cannot change status from ${order.status} to ${status}`,
      });
    }

    order.status = status;

    if (status === 'paid' && paymentReference) {
      order.paymentReference = paymentReference;
    }

    await order.save();
    res.json(order);
  } catch (err) {
    console.error('Update order status error:', err);
    res.status(500).json({ message: 'Failed to update status' });
  }
});

/* ============================
   ADMIN: DELETE ORDER
============================ */
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    await order.deleteOne();
    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (err) {
    console.error('Delete order error:', err);
    res.status(500).json({ message: 'Failed to delete order' });
  }
});

/* ============================
   📄 USER / ADMIN: RECEIPT PDF
   GET /orders/:id/receipt
============================ */
router.get('/:id/receipt', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Only owner or admin can access
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const doc = new PDFDocument({ margin: 40 });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename=receipt-${order._id}.pdf`);

    doc.pipe(res);

    // ===== RECEIPT DESIGN =====

    doc.fontSize(20).text('EITHERMALL RECEIPT', { align: 'center' });
    doc.moveDown();

    doc.fontSize(12);
    doc.text(`Order ID: ${order._id}`);
    doc.text(`Date: ${new Date(order.createdAt).toLocaleString()}`);
    doc.text(`Customer: ${order.customerName}`);
    doc.text(`Phone: ${order.phone}`);
    doc.text(`Location: ${order.county}, ${order.subcounty}`);
    doc.text(`Payment Method: ${order.paymentMethod.toUpperCase()}`);
    doc.text(`Status: ${order.status.toUpperCase()}`);

    doc.moveDown();
    doc.text('Items:', { underline: true });
    doc.moveDown(0.5);

    order.items.forEach(item => {
      doc.text(
        `${item.name} - ${item.unitName || 'pcs'} x ${item.qty} | KSh ${
          item.unitPrice * item.qty
        }`
      );
    });

    doc.moveDown();
    doc
      .fontSize(14)
      .text(`Total: KSh ${order.totalAmount.toLocaleString()}`, { align: 'right' });

    doc.end();
  } catch (err) {
    console.error('Receipt error:', err);
    res.status(500).json({ message: 'Failed to generate receipt' });
  }
});

/* ============================
   ADMIN DASHBOARD STATS
============================ */
router.get('/admin/stats', protect, adminOnly, async (req, res) => {
  try {
    const orders = await Order.find();

    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    const paidOrders = orders.filter(o => o.status === 'paid').length;
    const deliveredOrders = orders.filter(o => o.status === 'delivered').length;

    const totalRevenue = orders
      .filter(o => o.status !== 'pending')
      .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

    res.json({
      totalOrders,
      pendingOrders,
      paidOrders,
      deliveredOrders,
      totalRevenue,
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to load stats' });
  }
});

export default router;
