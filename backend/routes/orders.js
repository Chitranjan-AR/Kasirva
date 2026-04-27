const express = require('express');
const { body, validationResult } = require('express-validator');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Farmer = require('../models/Farmer');
const User = require('../models/User');
const { auth, authorize } = require('../middleware/auth');
const { sendOrderNotification } = require('../utils/notifications');

const router = express.Router();

// @route   POST /api/orders
// @desc    Create new order
// @access  Private (Consumer only)
router.post('/', auth, authorize('consumer'), [
  body('items').isArray({ min: 1 }).withMessage('Order must have at least one item'),
  body('delivery.address').notEmpty().withMessage('Delivery address is required'),
  body('payment.method').isIn(['online', 'cod']).withMessage('Invalid payment method')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { items, delivery, payment } = req.body;

    let subtotal = 0;
    const orderItems = [];
    let farmerId = null;

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product)
        return res.status(404).json({ message: `Product not found` });

      if (product.stock.quantity < item.quantity)
        return res.status(400).json({ message: `Insufficient stock for ${product.name}. Available: ${product.stock.quantity}` });

      if (farmerId && product.farmer.toString() !== farmerId)
        return res.status(400).json({ message: 'All items must be from the same farmer' });

      farmerId = product.farmer.toString();
      const itemTotal = product.price.amount * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        unit: product.price.unit,
        price: product.price.amount,
        totalPrice: itemTotal
      });
    }

    const farmer = await Farmer.findById(farmerId);
    if (!farmer)
      return res.status(404).json({ message: 'Farmer not found' });

    const deliveryFee = subtotal >= 500 ? 0 : 50;
    const tax = parseFloat((subtotal * 0.05).toFixed(2));
    const total = parseFloat((subtotal + deliveryFee + tax).toFixed(2));

    const order = new Order({
      consumer: req.user.id,
      farmer: farmer._id,
      items: orderItems,
      pricing: { subtotal, deliveryFee, tax, total },
      delivery,
      payment
    });

    await order.save();

    // Deduct stock after order saved
    for (const item of items) {
      await Product.findByIdAndUpdate(item.productId, { $inc: { 'stock.quantity': -item.quantity } });
    }

    await order.populate(['consumer', 'farmer', 'items.product']);

    // Notifications (non-blocking)
    try { await sendOrderNotification(order, 'order_placed'); } catch (e) { console.error('Notification error:', e); }
    try {
      const io = req.app.get('io');
      if (io && farmer.user) io.to(farmer.user.toString()).emit('new_order', { orderId: order._id, orderNumber: order.orderNumber, total });
    } catch (e) { console.error('Socket error:', e); }

    res.status(201).json({ message: 'Order placed successfully', order });
  } catch (error) {
    console.error('Order creation error:', error.message);
    res.status(500).json({ message: error.message || 'Failed to create order. Please try again.' });
  }
});

// @route   GET /api/orders
// @desc    Get user orders
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    
    let query = {};
    
    if (req.user.role === 'consumer') {
      query.consumer = req.user.id;
    } else if (req.user.role === 'farmer') {
      const farmer = await Farmer.findOne({ user: req.user.id });
      if (!farmer) {
        return res.status(404).json({ message: 'Farmer profile not found' });
      }
      query.farmer = farmer._id;
    }

    if (status) {
      query['status.current'] = status;
    }

    const orders = await Order.find(query)
      .populate('consumer', 'name phone email')
      .populate('farmer', 'farmName')
      .populate('items.product', 'name images price')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(query);

    res.json({
      orders,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/orders/:id
// @desc    Get order by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('consumer', 'name phone email address')
      .populate('farmer', 'farmName farmLocation user')
      .populate('farmer.user', 'name phone')
      .populate('items.product', 'name images price category');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user has access to this order
    const farmer = await Farmer.findOne({ user: req.user.id });
    const hasAccess = 
      order.consumer._id.toString() === req.user.id ||
      (farmer && order.farmer._id.toString() === farmer._id.toString()) ||
      req.user.role === 'admin';

    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/orders/:id/cancel
// @desc    Cancel order by consumer
// @access  Private (Consumer only)
router.put('/:id/cancel', auth, authorize('consumer'), async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.consumer.toString() !== req.user.id)
      return res.status(403).json({ message: 'Access denied' });
    if (!['pending', 'accepted'].includes(order.status?.current))
      return res.status(400).json({ message: 'Order cannot be cancelled at this stage' });

    order.updateStatus('cancelled', req.body.reason || 'Cancelled by customer');
    order.cancellation = { reason: req.body.reason || 'Cancelled by customer', cancelledBy: req.user.id, cancelledAt: new Date() };

    // Restore stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, { $inc: { 'stock.quantity': item.quantity } });
    }
    await order.save();
    res.json({ message: 'Order cancelled successfully', order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/orders/:id/status
// @desc    Update order status (Farmer)
router.put('/:id/status', auth, authorize('farmer'), [
  body('status').isIn(['accepted', 'rejected', 'preparing', 'ready', 'out_for_delivery', 'delivered']).withMessage('Invalid status'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { status, note } = req.body;
    
    const farmer = await Farmer.findOne({ user: req.user.id });
    if (!farmer) {
      return res.status(404).json({ message: 'Farmer profile not found' });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.farmer.toString() !== farmer._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (typeof order.updateStatus === 'function') {
      order.updateStatus(status, note);
    } else {
      order.status = {
        current: status,
        history: [
          ...(order.status?.history || []),
          { status, timestamp: new Date(), note }
        ]
      };
    }
    await order.save();

    // Send notification to consumer
    try {
      await order.populate('consumer');
      await sendOrderNotification(order, `order_${status}`);

      // Emit real-time notification
      const io = req.app.get('io');
      if (io && order.consumer && order.consumer._id) {
        io.to(order.consumer._id.toString()).emit('order_update', {
          orderId: order._id,
          status: status,
          message: `Your order is now ${status}`
        });
      }
    } catch (notificationError) {
      console.error('Status update notification error:', notificationError);
      // Don't fail the request if notification fails
    }

    res.json({
      message: 'Order status updated successfully',
      order
    });
  } catch (error) {
    console.error('Order status update error:', error);
    res.status(500).json({ message: 'Failed to update order status. Please try again.' });
  }
});

// @route   POST /api/orders/:id/review
// @desc    Add review to order
// @access  Private (Consumer only)
router.post('/:id/review', auth, authorize('consumer'), [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').optional().isLength({ max: 500 }).withMessage('Comment must be less than 500 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { rating, comment } = req.body;
    
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.consumer.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (order.status?.current !== 'delivered') {
      return res.status(400).json({ message: 'Can only review delivered orders' });
    }

    if (order.review?.rating) {
      return res.status(400).json({ message: 'Order already reviewed' });
    }

    order.review = {
      rating,
      comment,
      reviewedAt: new Date()
    };

    await order.save();

    // Update farmer rating
    try {
      const farmer = await Farmer.findById(order.farmer);
      if (farmer && farmer.rating) {
        const totalRating = (farmer.rating.average || 0) * (farmer.rating.count || 0) + rating;
        farmer.rating.count = (farmer.rating.count || 0) + 1;
        farmer.rating.average = totalRating / farmer.rating.count;
        await farmer.save();
      }
    } catch (ratingError) {
      console.error('Farmer rating update error:', ratingError);
      // Don't fail the review if rating update fails
    }

    res.json({
      message: 'Review added successfully',
      order
    });
  } catch (error) {
    console.error('Review creation error:', error);
    res.status(500).json({ message: 'Failed to add review. Please try again.' });
  }
});

module.exports = router;