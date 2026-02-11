const express = require('express');
const User = require('../models/User');
const router = express.Router();

// Test route to check admin user
router.get('/', async (req, res) => {
  try {
    const admin = await User.findOne({ email: 'admin@kashirva.com' });
    if (admin) {
      res.json({
        message: 'Admin user found',
        admin: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
          isActive: admin.isActive,
          isVerified: admin.isVerified
        }
      });
    } else {
      res.json({ message: 'Admin user not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;