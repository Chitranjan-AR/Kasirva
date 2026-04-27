const express = require('express');
const User = require('../models/User');
const Farmer = require('../models/Farmer');
const Product = require('../models/Product');
const Order = require('../models/Order');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/admin/dashboard
// @desc    Get admin dashboard data
// @access  Private (Admin only)
router.get('/dashboard', auth, authorize('admin'), async (req, res) => {
  try {
    const [
      totalUsers,
      totalFarmers,
      totalProducts,
      totalOrders,
      totalRevenue,
      pendingFarmers,
      recentUsers,
      recentOrders
    ] = await Promise.all([
      User.countDocuments(),
      Farmer.countDocuments(),
      Product.countDocuments(),
      Order.countDocuments(),
      Order.aggregate([
        { $match: { 'status.current': 'delivered' } },
        { $group: { _id: null, total: { $sum: '$pricing.total' } } }
      ]),
      Farmer.find({ 'verification.status': 'pending' })
        .populate('user', 'name email phone')
        .limit(10),
      User.find().sort({ createdAt: -1 }).limit(10),
      Order.find()
        .populate('consumer', 'name email')
        .populate('farmer', 'farmName')
        .sort({ createdAt: -1 })
        .limit(10)
    ]);

    res.json({
      stats: {
        totalUsers,
        totalFarmers,
        totalProducts,
        totalOrders,
        totalRevenue: totalRevenue[0]?.total || 0
      },
      farmers: pendingFarmers,
      users: recentUsers,
      orders: recentOrders
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/farmers
// @desc    Get all farmers with filters
// @access  Private (Admin only)
router.get('/farmers', auth, authorize('admin'), async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    let query = {};
    if (status) {
      query['verification.status'] = status;
    }

    const farmers = await Farmer.find(query)
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Farmer.countDocuments(query);

    res.json({
      farmers,
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

// @route   PUT /api/admin/farmers/:id/approve
// @desc    Approve farmer
// @access  Private (Admin only)
router.put('/farmers/:id/approve', auth, authorize('admin'), async (req, res) => {
  try {
    const farmer = await Farmer.findById(req.params.id);
    if (!farmer) {
      return res.status(404).json({ message: 'Farmer not found' });
    }

    farmer.verification.status = 'approved';
    farmer.verification.verifiedAt = new Date();
    farmer.verification.verifiedBy = req.user.id;
    
    await farmer.save();

    res.json({ message: 'Farmer approved successfully', farmer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/admin/farmers/:id/reject
// @desc    Reject farmer
// @access  Private (Admin only)
router.put('/farmers/:id/reject', auth, authorize('admin'), async (req, res) => {
  try {
    const { reason } = req.body;
    
    const farmer = await Farmer.findById(req.params.id);
    if (!farmer) {
      return res.status(404).json({ message: 'Farmer not found' });
    }

    farmer.verification.status = 'rejected';
    farmer.verification.rejectionReason = reason;
    farmer.verification.verifiedBy = req.user.id;
    
    await farmer.save();

    res.json({ message: 'Farmer rejected successfully', farmer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/users
// @desc    Get all users
// @access  Private (Admin only)
router.get('/users', auth, authorize('admin'), async (req, res) => {
  try {
    const { role, page = 1, limit = 10 } = req.query;
    
    let query = {};
    if (role) {
      query.role = role;
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(query);

    res.json({
      users,
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

// @route   PUT /api/admin/users/:id/toggle-status
// @desc    Toggle user active status
// @access  Private (Admin only)
router.put('/users/:id/toggle-status', auth, authorize('admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({ 
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`, 
      user: { ...user.toObject(), password: undefined }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/orders
// @desc    Get all orders
// @access  Private (Admin only)
router.get('/orders', auth, authorize('admin'), async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    let query = {};
    if (status) {
      query['status.current'] = status;
    }

    const orders = await Order.find(query)
      .populate('consumer', 'name email phone')
      .populate('farmer', 'farmName')
      .populate('items.product', 'name')
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

// @route   GET /api/admin/analytics
// @desc    Get platform analytics
// @access  Private (Admin only)
router.get('/analytics', auth, authorize('admin'), async (req, res) => {
  try {
    const { period = '30' } = req.query;
    const days = parseInt(period);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const [
      userGrowth,
      orderStats,
      revenueStats,
      topProducts,
      topFarmers
    ] = await Promise.all([
      User.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        { $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }},
        { $sort: { _id: 1 } }
      ]),
      Order.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        { $group: {
          _id: "$status.current",
          count: { $sum: 1 }
        }}
      ]),
      Order.aggregate([
        { $match: { 
          createdAt: { $gte: startDate },
          'status.current': 'delivered'
        }},
        { $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          revenue: { $sum: "$pricing.total" }
        }},
        { $sort: { _id: 1 } }
      ]),
      Order.aggregate([
        { $match: { 'status.current': 'delivered' } },
        { $unwind: "$items" },
        { $group: {
          _id: "$items.product",
          totalSold: { $sum: "$items.quantity" },
          revenue: { $sum: "$items.totalPrice" }
        }},
        { $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product'
        }},
        { $unwind: "$product" },
        { $sort: { totalSold: -1 } },
        { $limit: 10 }
      ]),
      Order.aggregate([
        { $match: { 'status.current': 'delivered' } },
        { $group: {
          _id: "$farmer",
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: "$pricing.total" }
        }},
        { $lookup: {
          from: 'farmers',
          localField: '_id',
          foreignField: '_id',
          as: 'farmer'
        }},
        { $unwind: "$farmer" },
        { $sort: { totalRevenue: -1 } },
        { $limit: 10 }
      ])
    ]);

    res.json({
      userGrowth,
      orderStats,
      revenueStats,
      topProducts,
      topFarmers
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/products
// @desc    Get all products for admin
// @access  Private (Admin only)
router.get('/products', auth, authorize('admin'), async (req, res) => {
  try {
    const { page = 1, limit = 20, search, isActive } = req.query;
    
    let query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    const products = await Product.find(query)
      .populate('farmer', 'farmName')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Product.countDocuments(query);

    res.json({
      products,
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

// @route   POST /api/admin/products
// @desc    Create product as admin
// @access  Private (Admin only)
router.post('/products', auth, authorize('admin'), async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    await product.populate('farmer', 'farmName');

    res.status(201).json({
      message: 'Product created successfully',
      product
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/admin/products/:id/toggle-status
// @desc    Toggle product active status
// @access  Private (Admin only)
router.put('/products/:id/toggle-status', auth, authorize('admin'), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    product.isActive = !product.isActive;
    await product.save();

    res.json({ 
      message: `Product ${product.isActive ? 'activated' : 'deactivated'} successfully`, 
      product 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/admin/products/:id
// @desc    Delete product
// @access  Private (Admin only)
router.delete('/products/:id', auth, authorize('admin'), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await product.deleteOne();
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;