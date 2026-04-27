const express = require('express');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// GET /api/users/addresses — get all saved addresses
router.get('/addresses', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('savedAddresses');
    res.json({ addresses: user.savedAddresses || [] });
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/users/addresses — add new address
router.post('/addresses', auth, async (req, res) => {
  try {
    const { label, street, city, state, pincode, isDefault } = req.body;
    if (!street || !city || !state || !pincode)
      return res.status(400).json({ message: 'All address fields are required' });

    const user = await User.findById(req.user.id);

    // If new address is default, unset others
    if (isDefault) {
      user.savedAddresses.forEach(a => { a.isDefault = false; });
    }

    // If first address, make it default
    const makeDefault = isDefault || user.savedAddresses.length === 0;

    user.savedAddresses.push({ label: label || 'Home', street, city, state, pincode, isDefault: makeDefault });
    await user.save();

    res.json({ message: 'Address added', addresses: user.savedAddresses });
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/users/addresses/:addrId — update address
router.put('/addresses/:addrId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const addr = user.savedAddresses.id(req.params.addrId);
    if (!addr) return res.status(404).json({ message: 'Address not found' });

    const { label, street, city, state, pincode, isDefault } = req.body;
    if (isDefault) user.savedAddresses.forEach(a => { a.isDefault = false; });

    Object.assign(addr, { label, street, city, state, pincode, isDefault: isDefault || addr.isDefault });
    await user.save();

    res.json({ message: 'Address updated', addresses: user.savedAddresses });
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/users/addresses/:addrId — delete address
router.delete('/addresses/:addrId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.savedAddresses = user.savedAddresses.filter(a => a._id.toString() !== req.params.addrId);
    // If deleted was default, make first one default
    if (user.savedAddresses.length > 0 && !user.savedAddresses.some(a => a.isDefault)) {
      user.savedAddresses[0].isDefault = true;
    }
    await user.save();
    res.json({ message: 'Address deleted', addresses: user.savedAddresses });
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/users/addresses/:addrId/default — set default
router.put('/addresses/:addrId/default', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.savedAddresses.forEach(a => { a.isDefault = a._id.toString() === req.params.addrId; });
    await user.save();
    res.json({ message: 'Default address updated', addresses: user.savedAddresses });
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/users/profile — get profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
