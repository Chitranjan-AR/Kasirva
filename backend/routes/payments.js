const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Initialize Razorpay
const razorpay = process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET 
  ? new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    })
  : null;

// @route   POST /api/payments/create-order
// @desc    Create Razorpay order
// @access  Private
router.post('/create-order', auth, async (req, res) => {
  try {
    if (!razorpay)
      return res.status(503).json({ message: 'Online payment not configured. Please use Cash on Delivery.' });

    const { amount, orderId } = req.body;
    const options = {
      amount: Math.round(amount * 100),
      currency: 'INR',
      receipt: `order_${orderId}`,
      payment_capture: 1
    };

    const razorpayOrder = await razorpay.orders.create(options);
    if (orderId)
      await Order.findByIdAndUpdate(orderId, { 'payment.razorpayOrderId': razorpayOrder.id });

    res.json({
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create payment order' });
  }
});

// @route   POST /api/payments/verify
// @desc    Verify Razorpay payment
// @access  Private
router.post('/verify', auth, async (req, res) => {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      orderId 
    } = req.body;

    if (!razorpay) {
      return res.status(500).json({ message: 'Payment gateway not configured' });
    }

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: 'Invalid payment signature' });
    }

    // Update order payment status
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.payment.status = 'completed';
    order.payment.razorpayPaymentId = razorpay_payment_id;
    order.payment.paidAt = new Date();
    
    // Auto-accept order after successful payment
    if (order.status.current === 'pending') {
      order.updateStatus('accepted', 'Payment received - Order auto-accepted');
    }

    await order.save();

    res.json({
      message: 'Payment verified successfully',
      paymentId: razorpay_payment_id
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Payment verification failed' });
  }
});

// @route   GET /api/payments/orders/:orderId
// @desc    Get payment details for order
// @access  Private
router.get('/orders/:orderId', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.consumer.toString() !== req.user.id && req.user.role !== 'admin')
      return res.status(403).json({ message: 'Access denied' });
    res.json({ payment: order.payment, total: order.pricing.total });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/payments/refund/:orderId
// @desc    Initiate refund for cancelled order
// @access  Private
router.post('/refund/:orderId', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.consumer.toString() !== req.user.id && req.user.role !== 'admin')
      return res.status(403).json({ message: 'Access denied' });
    if (order.status.current !== 'cancelled')
      return res.status(400).json({ message: 'Refund only allowed for cancelled orders' });
    if (order.payment.status === 'refunded')
      return res.status(400).json({ message: 'Refund already processed' });
    if (order.payment.method === 'cod' || order.payment.status !== 'completed')
      return res.status(400).json({ message: 'No payment to refund' });

    if (!razorpay)
      return res.status(500).json({ message: 'Payment gateway not configured' });

    const refund = await razorpay.payments.refund(order.payment.razorpayPaymentId, {
      amount: Math.round(order.pricing.total * 100),
      notes: { orderId: order._id.toString(), reason: req.body.reason || 'Order cancelled' }
    });

    order.payment.status = 'refunded';
    order.payment.transactionId = refund.id;
    order.cancellation = {
      ...order.cancellation,
      refundAmount: order.pricing.total,
      refundId: refund.id
    };
    await order.save();

    res.json({ message: 'Refund initiated successfully', refundId: refund.id, amount: order.pricing.total });
  } catch (error) {
    console.error('Refund error:', error);
    res.status(500).json({ message: 'Refund failed. Please contact support.' });
  }
});

// @route   PUT /api/payments/cod-confirm/:orderId
// @desc    Confirm COD payment on delivery
// @access  Private (Farmer only)
router.put('/cod-confirm/:orderId', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId).populate('farmer');
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const Farmer = require('../models/Farmer');
    const farmer = await Farmer.findOne({ user: req.user.id });
    if (!farmer || order.farmer._id.toString() !== farmer._id.toString())
      return res.status(403).json({ message: 'Access denied' });
    if (order.payment.method !== 'cod')
      return res.status(400).json({ message: 'Not a COD order' });
    if (order.status.current !== 'delivered')
      return res.status(400).json({ message: 'Order must be delivered first' });

    order.payment.status = 'completed';
    order.payment.paidAt = new Date();
    await order.save();

    res.json({ message: 'COD payment confirmed', order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;