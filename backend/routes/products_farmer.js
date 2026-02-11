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