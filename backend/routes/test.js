const express = require('express');
const Product = require('../models/Product');
const router = express.Router();

// Test route to check products
router.get('/test', async (req, res) => {
  try {
    const count = await Product.countDocuments();
    const products = await Product.find().limit(5);
    
    res.json({
      message: 'Products test route',
      totalProducts: count,
      sampleProducts: products.map(p => ({
        id: p._id,
        name: p.name,
        category: p.category,
        price: p.price
      }))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;