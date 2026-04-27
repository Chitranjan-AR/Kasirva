const express = require('express');
const { body, validationResult } = require('express-validator');
const Product = require('../models/Product');
const Farmer = require('../models/Farmer');
const { auth, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// @route   GET /api/products/farmer/my-products
// @desc    Get farmer's products
// @access  Private (Farmer only)
router.get('/farmer/my-products', auth, authorize('farmer'), async (req, res) => {
  try {
    const farmer = await Farmer.findOne({ user: req.user.id });
    if (!farmer) {
      return res.status(404).json({ message: 'Farmer profile not found' });
    }

    const products = await Product.find({ farmer: farmer._id })
      .sort({ createdAt: -1 });

    res.json({ products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/products
// @desc    Get all products with filters
// @access  Public
router.get('/', async (req, res) => {
  try {
    const {
      category,
      subcategory,
      farmingMethod,
      minPrice,
      maxPrice,
      search,
      inStock,
      lat,
      lng,
      radius = 10,
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    let query = {
      isActive: true,
      'availability.isAvailable': true,
    };

    if (inStock === 'true') query['stock.quantity'] = { $gt: 0 };

    // Apply filters
    if (category) query.category = category;
    if (subcategory) query.subcategory = subcategory;
    if (farmingMethod) query['farmingDetails.method'] = farmingMethod;
    if (minPrice || maxPrice) {
      query['price.amount'] = {};
      if (minPrice) query['price.amount'].$gte = parseFloat(minPrice);
      if (maxPrice) query['price.amount'].$lte = parseFloat(maxPrice);
    }

    // Text search — use regex fallback to avoid index dependency
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Normalize sortBy from frontend values
    const sortMap = {
      'newest':     ['createdAt', -1],
      'price-low':  ['price.amount', 1],
      'price-high': ['price.amount', -1],
      'rating':     ['rating.average', -1],
      'popular':    ['rating.count', -1],
    };
    const [sortField, sortDir] = sortMap[sortBy] || ['createdAt', -1];

    let products = Product.find(query)
      .populate('farmer', 'farmName rating verification')
      .sort({ [sortField]: sortDir })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Location-based filtering
    if (lat && lng) {
      const farmers = await Farmer.find({
        'farmLocation.coordinates': {
          $near: {
            $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
            $maxDistance: radius * 1000
          }
        }
      });
      query.farmer = { $in: farmers.map(f => f._id) };
      products = Product.find(query)
        .populate('farmer', 'farmName rating verification')
        .sort({ [sortField]: sortDir })
        .limit(limit * 1)
        .skip((page - 1) * limit);
    }

    const [productList, total] = await Promise.all([
      products.exec(),
      Product.countDocuments(query)
    ]);

    res.json({
      products: productList,
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

// @route   POST /api/products
// @desc    Create new product
// @access  Private (Farmer/Admin)
router.post('/', auth, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let farmerId;
    
    if (req.user.role === 'farmer') {
      const farmer = await Farmer.findOne({ user: req.user.id });
      if (!farmer) {
        return res.status(404).json({ message: 'Farmer profile not found' });
      }
      if (farmer.verification.status !== 'approved') {
        return res.status(403).json({ message: 'Farmer profile must be approved to add products' });
      }
      farmerId = farmer._id;
    } else if (req.user.role === 'admin') {
      // Admin can add product for any farmer
      farmerId = req.body.farmer;
      if (!farmerId) {
        return res.status(400).json({ message: 'Farmer ID is required' });
      }
    } else {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const product = new Product({
      ...req.body,
      farmer: farmerId
    });

    await product.save();
    await product.populate('farmer', 'farmName rating');

    res.status(201).json({
      message: 'Product created successfully',
      product
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/products/:id/reviews
// @desc    Get product reviews from orders
// @access  Public
router.get('/:id/reviews', async (req, res) => {
  try {
    const Order = require('../models/Order');
    const orders = await Order.find({
      'items.product': req.params.id,
      'review.rating': { $exists: true }
    }).populate('consumer', 'name').select('review consumer createdAt');

    const reviews = orders.map(o => ({
      _id: o._id,
      rating: o.review.rating,
      comment: o.review.comment,
      user: { name: o.consumer?.name || 'Customer' },
      createdAt: o.review.reviewedAt || o.createdAt
    }));

    res.json({ reviews });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/products/:id
// @desc    Get product by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('farmer', 'farmName rating farmLocation')
      .populate('farmer.user', 'name');

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/products/:id
// @desc    Update product
// @access  Private (Farmer/Admin)
router.put('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check authorization
    if (req.user.role === 'farmer') {
      const farmer = await Farmer.findOne({ user: req.user.id });
      if (!farmer || product.farmer.toString() !== farmer._id.toString()) {
        return res.status(403).json({ message: 'Not authorized' });
      }
    } else if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    Object.assign(product, req.body);
    await product.save();

    res.json({ message: 'Product updated successfully', product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/products/:id
// @desc    Delete product
// @access  Private (Farmer/Admin)
router.delete('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check authorization
    if (req.user.role === 'farmer') {
      const farmer = await Farmer.findOne({ user: req.user.id });
      if (!farmer || product.farmer.toString() !== farmer._id.toString()) {
        return res.status(403).json({ message: 'Not authorized' });
      }
    } else if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await product.deleteOne();
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;