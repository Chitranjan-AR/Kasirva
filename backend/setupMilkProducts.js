const mongoose = require('mongoose');
const User = require('./models/User');
const Farmer = require('./models/Farmer');
const Product = require('./models/Product');
require('dotenv').config();

// Complete milk products - ONLY MILK PRODUCTS with correct units
const milkProducts = [
  // Fresh Milk - Position 1-10
  { position: 1, name: 'Fresh Cow Milk', type: 'Cow', subcategory: 'Fresh Milk', price_amount: 60, price_unit: 'litre', stock_qty: 50, stock_unit: 'litre', freshness: 95 },
  { position: 2, name: 'Buffalo Milk', type: 'Buffalo', subcategory: 'Fresh Milk', price_amount: 80, price_unit: 'litre', stock_qty: 30, stock_unit: 'litre', freshness: 92 },
  { position: 3, name: 'A2 Cow Milk', type: 'A2 Cow', subcategory: 'Fresh Milk', price_amount: 120, price_unit: 'litre', stock_qty: 25, stock_unit: 'litre', freshness: 98 },
  { position: 4, name: 'Goat Milk', type: 'Goat', subcategory: 'Fresh Milk', price_amount: 150, price_unit: 'litre', stock_qty: 15, stock_unit: 'litre', freshness: 94 },
  { position: 5, name: 'Toned Milk', type: 'Toned', subcategory: 'Fresh Milk', price_amount: 50, price_unit: 'litre', stock_qty: 40, stock_unit: 'litre', freshness: 90 },
  { position: 6, name: 'Full Cream Milk', type: 'Full Cream', subcategory: 'Fresh Milk', price_amount: 70, price_unit: 'litre', stock_qty: 35, stock_unit: 'litre', freshness: 93 },
  { position: 7, name: 'Organic Cow Milk', type: 'Organic', subcategory: 'Fresh Milk', price_amount: 100, price_unit: 'litre', stock_qty: 20, stock_unit: 'litre', freshness: 97 },
  { position: 8, name: 'Raw Milk', type: 'Raw', subcategory: 'Fresh Milk', price_amount: 90, price_unit: 'litre', stock_qty: 12, stock_unit: 'litre', freshness: 96 },
  { position: 9, name: 'Camel Milk', type: 'Camel', subcategory: 'Fresh Milk', price_amount: 200, price_unit: 'litre', stock_qty: 8, stock_unit: 'litre', freshness: 95 },
  { position: 10, name: 'Double Toned Milk', type: 'Double Toned', subcategory: 'Fresh Milk', price_amount: 45, price_unit: 'litre', stock_qty: 45, stock_unit: 'litre', freshness: 91 },

  // Flavored Milk - Position 11-16
  { position: 11, name: 'Chocolate Flavored Milk', type: 'Chocolate', subcategory: 'Flavored Milk', price_amount: 75, price_unit: 'litre', stock_qty: 25, stock_unit: 'litre', freshness: 92 },
  { position: 12, name: 'Strawberry Flavored Milk', type: 'Strawberry', subcategory: 'Flavored Milk', price_amount: 75, price_unit: 'litre', stock_qty: 20, stock_unit: 'litre', freshness: 91 },
  { position: 13, name: 'Mango Flavored Milk', type: 'Mango', subcategory: 'Flavored Milk', price_amount: 75, price_unit: 'litre', stock_qty: 22, stock_unit: 'litre', freshness: 93 },
  { position: 14, name: 'Badam (Almond) Milk', type: 'Badam', subcategory: 'Flavored Milk', price_amount: 85, price_unit: 'litre', stock_qty: 18, stock_unit: 'litre', freshness: 94 },
  { position: 15, name: 'Turmeric Flavored Milk', type: 'Turmeric', subcategory: 'Flavored Milk', price_amount: 80, price_unit: 'litre', stock_qty: 24, stock_unit: 'litre', freshness: 95 },
  { position: 16, name: 'Rose Flavored Milk', type: 'Rose', subcategory: 'Flavored Milk', price_amount: 90, price_unit: 'litre', stock_qty: 15, stock_unit: 'litre', freshness: 93 },

  // Butter & Cream - Position 17-22
  { position: 17, name: 'White Butter (Makhan)', type: 'White Butter', subcategory: 'Butter & Cream', price_amount: 400, price_unit: 'gm', stock_qty: 6000, stock_unit: 'gm', freshness: 94 },
  { position: 18, name: 'Salted Butter', type: 'Salted Butter', subcategory: 'Butter & Cream', price_amount: 420, price_unit: 'gm', stock_qty: 7000, stock_unit: 'gm', freshness: 93 },
  { position: 19, name: 'Unsalted Butter', type: 'Unsalted Butter', subcategory: 'Butter & Cream', price_amount: 420, price_unit: 'gm', stock_qty: 8000, stock_unit: 'gm', freshness: 94 },
  { position: 20, name: 'Organic Butter', type: 'Organic Butter', subcategory: 'Butter & Cream', price_amount: 500, price_unit: 'gm', stock_qty: 5000, stock_unit: 'gm', freshness: 96 },
  { position: 21, name: 'Fresh Cream (Malai)', type: 'Fresh Cream', subcategory: 'Butter & Cream', price_amount: 150, price_unit: 'ml', stock_qty: 4000, stock_unit: 'ml', freshness: 95 },
  { position: 22, name: 'Whipping Cream', type: 'Whipping Cream', subcategory: 'Butter & Cream', price_amount: 180, price_unit: 'ml', stock_qty: 3000, stock_unit: 'ml', freshness: 93 },

  // Paneer & Cheese - Position 23-29
  { position: 23, name: 'Fresh Paneer', type: 'Fresh Paneer', subcategory: 'Paneer & Cheese', price_amount: 350, price_unit: 'gm', stock_qty: 9000, stock_unit: 'gm', freshness: 96 },
  { position: 24, name: 'Malai Paneer', type: 'Malai Paneer', subcategory: 'Paneer & Cheese', price_amount: 400, price_unit: 'gm', stock_qty: 7000, stock_unit: 'gm', freshness: 95 },
  { position: 25, name: 'Smoked Paneer', type: 'Smoked Paneer', subcategory: 'Paneer & Cheese', price_amount: 420, price_unit: 'gm', stock_qty: 5000, stock_unit: 'gm', freshness: 94 },
  { position: 26, name: 'Mozzarella Cheese', type: 'Mozzarella', subcategory: 'Paneer & Cheese', price_amount: 450, price_unit: 'gm', stock_qty: 6000, stock_unit: 'gm', freshness: 92 },
  { position: 27, name: 'Cheddar Cheese', type: 'Cheddar', subcategory: 'Paneer & Cheese', price_amount: 480, price_unit: 'gm', stock_qty: 5500, stock_unit: 'gm', freshness: 91 },
  { position: 28, name: 'Feta Cheese', type: 'Feta', subcategory: 'Paneer & Cheese', price_amount: 500, price_unit: 'gm', stock_qty: 4500, stock_unit: 'gm', freshness: 90 },

  // Ghee - Position 29-34
  { position: 29, name: 'Cow Ghee', type: 'Cow Ghee', subcategory: 'Ghee', price_amount: 800, price_unit: 'gm', stock_qty: 11000, stock_unit: 'gm', freshness: 97 },
  { position: 30, name: 'Buffalo Ghee', type: 'Buffalo Ghee', subcategory: 'Ghee', price_amount: 900, price_unit: 'gm', stock_qty: 9000, stock_unit: 'gm', freshness: 96 },
  { position: 31, name: 'A2 Ghee', type: 'A2 Ghee', subcategory: 'Ghee', price_amount: 1000, price_unit: 'gm', stock_qty: 7500, stock_unit: 'gm', freshness: 98 },
  { position: 32, name: 'Organic Ghee', type: 'Organic Ghee', subcategory: 'Ghee', price_amount: 950, price_unit: 'gm', stock_qty: 7000, stock_unit: 'gm', freshness: 97 },
  { position: 33, name: 'Bilona Ghee', type: 'Bilona Ghee', subcategory: 'Ghee', price_amount: 1100, price_unit: 'gm', stock_qty: 6000, stock_unit: 'gm', freshness: 98, rating: 5.0 },

  // Curd & Dahi - Position 34-38
  { position: 34, name: 'Fresh Curd (Dahi)', type: 'Fresh Dahi', subcategory: 'Curd & Dahi', price_amount: 80, price_unit: 'gm', stock_qty: 15000, stock_unit: 'gm', freshness: 94 },
  { position: 35, name: 'Mishti Dahi (Sweet Curd)', type: 'Mishti Dahi', subcategory: 'Curd & Dahi', price_amount: 100, price_unit: 'gm', stock_qty: 10000, stock_unit: 'gm', freshness: 93 },
  { position: 36, name: 'Greek Yogurt', type: 'Greek Yogurt', subcategory: 'Curd & Dahi', price_amount: 120, price_unit: 'gm', stock_qty: 8000, stock_unit: 'gm', freshness: 92 },
  { position: 37, name: 'Hung Curd (Strained Dahi)', type: 'Hung Curd', subcategory: 'Curd & Dahi', price_amount: 140, price_unit: 'gm', stock_qty: 6000, stock_unit: 'gm', freshness: 91 },
  { position: 38, name: 'Probiotic Dahi', type: 'Probiotic Dahi', subcategory: 'Curd & Dahi', price_amount: 110, price_unit: 'gm', stock_qty: 9000, stock_unit: 'gm', freshness: 94 },

  // Drinks & Desserts - Position 39-45
  { position: 39, name: 'Sweet Lassi', type: 'Sweet Lassi', subcategory: 'Drinks & Desserts', price_amount: 60, price_unit: 'litre', stock_qty: 20, stock_unit: 'litre', freshness: 93 },
  { position: 40, name: 'Salted Lassi', type: 'Salted Lassi', subcategory: 'Drinks & Desserts', price_amount: 60, price_unit: 'litre', stock_qty: 18, stock_unit: 'litre', freshness: 92 },
  { position: 41, name: 'Mango Lassi', type: 'Mango Lassi', subcategory: 'Drinks & Desserts', price_amount: 70, price_unit: 'litre', stock_qty: 16, stock_unit: 'litre', freshness: 94 },
  { position: 42, name: 'Shrikhand', type: 'Shrikhand', subcategory: 'Drinks & Desserts', price_amount: 150, price_unit: 'gm', stock_qty: 5000, stock_unit: 'gm', freshness: 92 },
  { position: 43, name: 'Rabri (Reduced Milk)', type: 'Rabri', subcategory: 'Drinks & Desserts', price_amount: 180, price_unit: 'gm', stock_qty: 4000, stock_unit: 'gm', freshness: 91 },
  { position: 44, name: 'Kheer Mix', type: 'Kheer', subcategory: 'Drinks & Desserts', price_amount: 200, price_unit: 'gm', stock_qty: 3000, stock_unit: 'gm', freshness: 90 },
  { position: 45, name: 'Payasam', type: 'Payasam', subcategory: 'Drinks & Desserts', price_amount: 220, price_unit: 'gm', stock_qty: 2500, stock_unit: 'gm', freshness: 89 }
];

const setupMilkProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/kshirva');
    console.log('✅ Connected to MongoDB');

    // Remove non-dairy products
    await Product.deleteMany({ category: { $ne: 'dairy' } });
    console.log('🗑️  Cleared non-dairy products');

    // Clear existing dairy products
    await Product.deleteMany({ category: 'dairy' });
    console.log('🗑️  Cleared existing dairy products');

    // Get or create farmer
    let farmer = await Farmer.findOne();
    if (!farmer) {
      const user = await User.create({
        name: 'Pure Milk Dairy',
        email: 'dairy@farm.com',
        phone: '9876543210',
        role: 'farmer',
        password: 'dairy@123'
      });
      farmer = await Farmer.create({
        user: user._id,
        farmName: 'Pure Milk Dairy Farm',
        location: { type: 'Point', coordinates: [77.2090, 28.6139] },
        farmingMethod: 'natural'
      });
    }

    // Create products with correct structure
    const products = milkProducts.map(p => ({
      farmer: farmer._id,
      name: p.name,
      description: `Premium ${p.type} for everyday use. Fresh and quality assured.`,
      category: 'dairy',
      subcategory: p.subcategory,
      type: p.type,
      price: { amount: p.price_amount, unit: p.price_unit },
      stock: { quantity: p.stock_qty, unit: p.stock_unit },
      images: [{ url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500' }],
      farmingDetails: { method: 'natural', isOrganic: false },
      freshness: { harvestDate: new Date(), freshnessScore: p.freshness || 95 },
      rating: { average: p.rating || 4.6, count: 25 },
      position: p.position,
      isActive: true,
      availability: { isAvailable: true, availableFrom: new Date(), availableUntil: new Date(Date.now() + 365*24*60*60*1000) }
    }));

    await Product.insertMany(products);
    console.log(`\n✅ Inserted ${products.length} milk products`);

    // Show summary
    const categories = await Product.distinct('subcategory');
    console.log('\n📦 MILK CATEGORIES:');
    console.log('═'.repeat(50));
    for (const cat of categories.sort()) {
      const count = await Product.countDocuments({ subcategory: cat });
      console.log(`   ✓ ${cat.padEnd(25)} : ${count} products`);
    }
    console.log('═'.repeat(50));
    console.log(`\n✨ Total: ${await Product.countDocuments()} products`);
    console.log('🎯 Setup Complete!\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
};

setupMilkProducts();
