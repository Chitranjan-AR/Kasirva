const express = require('express');
const Subscription = require('../models/Subscription');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Create subscription
router.post('/', auth, async (req, res) => {
  try {
    const subscription = new Subscription({
      ...req.body,
      user: req.user.id
    });
    
    // Calculate discount price
    const discount = req.body.pricing.discount || 10;
    subscription.pricing.finalPrice = subscription.pricing.itemPrice * (1 - discount/100);
    
    await subscription.save();
    await subscription.populate('product');
    
    res.status(201).json({ message: 'Subscription created', subscription });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user subscriptions
router.get('/my-subscriptions', auth, async (req, res) => {
  try {
    const subscriptions = await Subscription.find({ user: req.user.id })
      .populate('product')
      .sort({ createdAt: -1 });
    
    res.json({ subscriptions });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Pause subscription
router.put('/:id/pause', auth, async (req, res) => {
  try {
    const { days } = req.body;
    const subscription = await Subscription.findOne({ _id: req.params.id, user: req.user.id });
    
    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }
    
    subscription.status = 'paused';
    subscription.pausedUntil = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
    await subscription.save();
    
    res.json({ message: 'Subscription paused', subscription });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Resume subscription
router.put('/:id/resume', auth, async (req, res) => {
  try {
    const subscription = await Subscription.findOne({ _id: req.params.id, user: req.user.id });
    
    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }
    
    subscription.status = 'active';
    subscription.pausedUntil = null;
    await subscription.save();
    
    res.json({ message: 'Subscription resumed', subscription });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Cancel subscription
router.delete('/:id', auth, async (req, res) => {
  try {
    const subscription = await Subscription.findOne({ _id: req.params.id, user: req.user.id });
    
    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }
    
    subscription.status = 'cancelled';
    await subscription.save();
    
    res.json({ message: 'Subscription cancelled' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
