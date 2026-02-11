const express = require('express');
const { body, validationResult } = require('express-validator');
const Farmer = require('../models/Farmer');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const { auth, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// @route   POST /api/farmers/profile
// @desc    Create/Update farmer profile
// @access  Private (Farmer only)
router.post('/profile', auth, authorize('farmer'), [
  body('farmName').trim().isLength({ min: 2 }).withMessage('Farm name is required'),
  body('farmLocation.address').notEmpty().withMessage('Farm address is required'),
  body('farmLocation.coordinates.lat').isFloat().withMessage('Valid latitude is required'),
  body('farmLocation.coordinates.lng').isFloat().withMessage('Valid longitude is required'),
  body('farmingMethod').isIn(['organic', 'natural', 'chemical']).withMessage('Invalid farming method'),
  body('cropTypes').isArray({ min: 1 }).withMessage('At least one crop type is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      farmName,
      farmLocation,
      farmingMethod,
      cropTypes,
      deliveryRadius,
      documents,
      bankDetails
    } = req.body;

    let farmer = await Farmer.findOne({ user: req.user.id });

    if (farmer) {
      // Update existing profile
      farmer.farmName = farmName;
      farmer.farmLocation = farmLocation;
      farmer.farmingMethod = farmingMethod;
      farmer.cropTypes = cropTypes;
      farmer.deliveryRadius = deliveryRadius || farmer.deliveryRadius;
      farmer.documents = documents || farmer.documents;
      farmer.bankDetails = bankDetails || farmer.bankDetails;
    } else {
      // Create new profile
      farmer = new Farmer({
        user: req.user.id,
        farmName,
        farmLocation,
        farmingMethod,
        cropTypes,
        deliveryRadius,
        documents,
        bankDetails
      });
    }

    await farmer.save();

    res.json({
      message: 'Farmer profile saved successfully',
      farmer
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/farmers/profile
// @desc    Get farmer profile
// @access  Private (Farmer only)
router.get('/profile', auth, authorize('farmer'), async (req, res) => {
  try {
    const farmer = await Farmer.findOne({ user: req.user.id }).populate('user', 'name email phone');
    
    if (!farmer) {
      return res.status(404).json({ message: 'Farmer profile not found' });
    }

    res.json(farmer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/farmers/dashboard
// @desc    Get farmer dashboard data
// @access  Private (Farmer only)
router.get('/dashboard', auth, authorize('farmer'), async (req, res) => {
  try {
    const farmer = await Farmer.findOne({ user: req.user.id });
    
    if (!farmer) {
      return res.status(404).json({ message: 'Farmer profile not found' });
    }

    // Get dashboard statistics
    const [
      totalProducts,
      activeProducts,
      totalOrders,
      pendingOrders,
      completedOrders,
      totalEarnings
    ] = await Promise.all([
      Product.countDocuments({ farmer: farmer._id }),
      Product.countDocuments({ farmer: farmer._id, isActive: true }),
      Order.countDocuments({ farmer: farmer._id }),
      Order.countDocuments({ farmer: farmer._id, 'status.current': { $in: ['pending', 'accepted', 'preparing'] } }),
      Order.countDocuments({ farmer: farmer._id, 'status.current': 'delivered' }),
      Order.aggregate([
        { $match: { farmer: farmer._id, 'status.current': 'delivered' } },
        { $group: { _id: null, total: { $sum: '$pricing.total' } } }
      ])
    ]);

    // Get recent orders
    const recentOrders = await Order.find({ farmer: farmer._id })
      .populate('consumer', 'name phone')
      .populate('items.product', 'name images')
      .sort({ createdAt: -1 })
      .limit(5);

    // Get low stock products
    const lowStockProducts = await Product.find({
      farmer: farmer._id,
      $expr: { $lte: ['$stock.quantity', '$stock.lowStockThreshold'] }
    }).limit(10);

    res.json({
      stats: {
        totalProducts,
        activeProducts,
        totalOrders,
        pendingOrders,
        completedOrders,
        totalEarnings: totalEarnings[0]?.total || 0
      },
      recentOrders,
      lowStockProducts,
      farmerInfo: {
        rating: farmer.rating,
        verification: farmer.verification,
        earnings: farmer.earnings
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/farmers/nearby
// @desc    Get nearby farmers based on location
// @access  Public
router.get('/nearby', async (req, res) => {
  try {
    const { lat, lng, radius = 10 } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ message: 'Latitude and longitude are required' });
    }

    const farmers = await Farmer.find({
      'farmLocation.coordinates': {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: radius * 1000 // Convert km to meters
        }
      },
      'verification.status': 'approved',
      isActive: true
    }).populate('user', 'name avatar');

    res.json(farmers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/farmers/:id
// @desc    Get farmer details by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const farmer = await Farmer.findById(req.params.id)
      .populate('user', 'name avatar')
      .select('-documents -bankDetails');

    if (!farmer) {
      return res.status(404).json({ message: 'Farmer not found' });
    }

    // Get farmer's products
    const products = await Product.find({ 
      farmer: farmer._id, 
      isActive: true,
      'availability.isAvailable': true 
    }).limit(10);

    res.json({
      farmer,
      products
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/farmers/upload-documents
// @desc    Upload farmer documents
// @access  Private (Farmer only)
router.post('/upload-documents', auth, authorize('farmer'), upload.fields([
  { name: 'aadhaar', maxCount: 1 },
  { name: 'govtId', maxCount: 1 },
  { name: 'farmImages', maxCount: 5 }
]), async (req, res) => {
  try {
    const farmer = await Farmer.findOne({ user: req.user.id });
    
    if (!farmer) {
      return res.status(404).json({ message: 'Farmer profile not found' });
    }

    if (req.files.aadhaar) {
      farmer.documents.aadhaar.imageUrl = req.files.aadhaar[0].path;
    }

    if (req.files.govtId) {
      farmer.documents.govtId.imageUrl = req.files.govtId[0].path;
    }

    if (req.files.farmImages) {
      farmer.farmImages = req.files.farmImages.map(file => ({
        url: file.path,
        caption: ''
      }));
    }

    await farmer.save();

    res.json({
      message: 'Documents uploaded successfully',
      documents: farmer.documents,
      farmImages: farmer.farmImages
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;