const express = require('express');
const { body, validationResult } = require('express-validator');
const Product = require('../models/Product');
const Farmer = require('../models/Farmer');
const { auth, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

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
      lat,
      lng,
      radius = 10,
      page = 1,
      limit = 12,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    let query = {
      isActive: true,
      'availability.isAvailable': true,
      'stock.quantity': { $gt: 0 }
    };

    // Apply filters
    if (category) query.category = category;
    if (subcategory) query.subcategory = subcategory;
    if (farmingMethod) query['farmingDetails.method'] = farmingMethod;
    if (minPrice || maxPrice) {
      query['price.amount'] = {};
      if (minPrice) query['price.amount'].$gte = parseFloat(minPrice);
      if (maxPrice) query['price.amount'].$lte = parseFloat(maxPrice);
    }

    // Text search
    if (search) {
      query.$text = { $search: search };
    }

    let products = Product.find(query)
      .populate('farmer', 'farmName rating verification')
      .populate('farmer.user', 'name')
      .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Location-based filtering
    if (lat && lng) {
      const farmers = await Farmer.find({
        'farmLocation.coordinates': {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [parseFloat(lng), parseFloat(lat)]
            },
            $maxDistance: radius * 1000
          }
        }
      });
      
      const farmerIds = farmers.map(f => f._id);
      query.farmer = { $in: farmerIds };
    }

    const [productList, total] = await Promise.all([
      products,
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
// @access  Private (Farmer only)
router.post('/', auth, authorize('farmer'), [
  body('name').trim().isLength({ min: 2 }).withMessage('Product name is required'),
  body('description').trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  body('category').isIn(['vegetables', 'fruits', 'grains', 'dairy', 'organic']).withMessage('Invalid category'),
  body('price.amount').isFloat({ min: 0 }).withMessage('Valid price is required'),
  body('stock.quantity').isFloat({ min: 0 }).withMessage('Valid stock quantity is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const farmer = await Farmer.findOne({ user: req.user.id });
    if (!farmer) {
      return res.status(404).json({ message: 'Farmer profile not found' });
    }

    if (farmer.verification.status !== 'approved') {
      return res.status(403).json({ message: 'Farmer profile must be approved to add products' });
    }

    const product = new Product({
      ...req.body,
      farmer: farmer._id
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

module.exports = router;

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