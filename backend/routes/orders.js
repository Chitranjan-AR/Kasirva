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

    // Validate products and calculate total
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: `Product ${item.productId} not found` });
      }

      if (product.stock.quantity < item.quantity) {
        return res.status(400).json({ 
          message: `Insufficient stock for ${product.name}. Available: ${product.stock.quantity}` 
        });
      }

      const itemTotal = product.price.amount * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        unit: product.price.unit,
        price: product.price.amount,
        totalPrice: itemTotal
      });

      // Update product stock
      product.stock.quantity -= item.quantity;
      await product.save();
    }

    // Get farmer from first product
    const firstProduct = await Product.findById(items[0].productId).populate('farmer');
    const farmer = firstProduct.farmer;

    // Calculate delivery fee (simple calculation)
    const deliveryFee = delivery.distance ? Math.ceil(delivery.distance) * 10 : 50;
    const tax = subtotal * 0.05; // 5% tax
    const total = subtotal + deliveryFee + tax;

    const order = new Order({
      consumer: req.user.id,
      farmer: farmer._id,
      items: orderItems,
      pricing: {
        subtotal,
        deliveryFee,
        tax,
        total
      },
      delivery,
      payment
    });

    await order.save();
    await order.populate(['consumer', 'farmer', 'items.product']);

    // Send notification
    await sendOrderNotification(order, 'order_placed');

    // Emit real-time notification to farmer
    const io = req.app.get('io');
    io.to(farmer.user.toString()).emit('new_order', {
      orderId: order._id,
      orderNumber: order.orderNumber,
      total: order.pricing.total
    });

    res.status(201).json({
      message: 'Order placed successfully',
      order
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
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

// @route   PUT /api/orders/:id/status
// @desc    Update order status
// @access  Private (Farmer only)
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

    order.updateStatus(status, note);
    await order.save();

    // Send notification to consumer
    await order.populate('consumer');
    await sendOrderNotification(order, `order_${status}`);

    // Emit real-time notification
    const io = req.app.get('io');
    io.to(order.consumer._id.toString()).emit('order_update', {
      orderId: order._id,
      status: status,
      message: `Your order is now ${status}`
    });

    res.json({
      message: 'Order status updated successfully',
      order
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
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

    if (order.status.current !== 'delivered') {
      return res.status(400).json({ message: 'Can only review delivered orders' });
    }

    if (order.review.rating) {
      return res.status(400).json({ message: 'Order already reviewed' });
    }

    order.review = {
      rating,
      comment,
      reviewedAt: new Date()
    };

    await order.save();

    // Update farmer rating
    const farmer = await Farmer.findById(order.farmer);
    const totalRating = farmer.rating.average * farmer.rating.count + rating;
    farmer.rating.count += 1;
    farmer.rating.average = totalRating / farmer.rating.count;
    await farmer.save();

    res.json({
      message: 'Review added successfully',
      review: order.review
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;