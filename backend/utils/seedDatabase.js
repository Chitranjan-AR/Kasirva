const mongoose = require('mongoose');
const User = require('../models/User');
const Farmer = require('../models/Farmer');
const Product = require('../models/Product');
const Order = require('../models/Order');

const sampleProducts = [
  // Milk Products Only
  {
    name: 'Fresh Cow Milk',
    description: 'Pure, fresh cow milk from grass-fed cows. Rich in calcium and protein.',
    category: 'dairy',
    price: { amount: 60, unit: 'liter' },
    stock: { quantity: 50, unit: 'liters' },
    images: [{ url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500&h=400&fit=crop' }],
    farmingDetails: { method: 'organic', isOrganic: true },
    freshness: { harvestDate: new Date(), freshnessScore: 95 },
    rating: { average: 4.8, count: 45 }
  },
  {
    name: 'Buffalo Milk',
    description: 'Creamy buffalo milk with higher fat content. Perfect for making paneer and sweets.',
    category: 'dairy',
    price: { amount: 80, unit: 'liter' },
    stock: { quantity: 30, unit: 'liters' },
    images: [{ url: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=500&h=400&fit=crop' }],
    farmingDetails: { method: 'natural', isOrganic: false },
    freshness: { harvestDate: new Date(), freshnessScore: 92 },
    rating: { average: 4.6, count: 32 }
  },
  {
    name: 'A2 Cow Milk',
    description: 'Premium A2 cow milk from desi cows. Easier to digest and more nutritious.',
    category: 'dairy',
    price: { amount: 120, unit: 'liter' },
    stock: { quantity: 25, unit: 'liters' },
    images: [{ url: 'https://images.unsplash.com/photo-1571212515416-fca0bf4c2d1b?w=500&h=400&fit=crop' }],
    farmingDetails: { method: 'organic', isOrganic: true },
    freshness: { harvestDate: new Date(), freshnessScore: 98 },
    rating: { average: 4.9, count: 28 }
  },
  {
    name: 'Goat Milk',
    description: 'Fresh goat milk with natural probiotics. Great for sensitive stomachs.',
    category: 'dairy',
    price: { amount: 150, unit: 'liter' },
    stock: { quantity: 15, unit: 'liters' },
    images: [{ url: 'https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=500&h=400&fit=crop' }],
    farmingDetails: { method: 'organic', isOrganic: true },
    freshness: { harvestDate: new Date(), freshnessScore: 94 },
    rating: { average: 4.7, count: 18 }
  },
  {
    name: 'Toned Milk',
    description: 'Low-fat toned milk with reduced calories. Perfect for health-conscious consumers.',
    category: 'dairy',
    price: { amount: 50, unit: 'liter' },
    stock: { quantity: 40, unit: 'liters' },
    images: [{ url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500&h=400&fit=crop' }],
    farmingDetails: { method: 'natural', isOrganic: false },
    freshness: { harvestDate: new Date(), freshnessScore: 90 },
    rating: { average: 4.4, count: 52 }
  },
  {
    name: 'Full Cream Milk',
    description: 'Rich and creamy full-fat milk. Perfect for tea, coffee, and cooking.',
    category: 'dairy',
    price: { amount: 70, unit: 'liter' },
    stock: { quantity: 35, unit: 'liters' },
    images: [{ url: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=500&h=400&fit=crop' }],
    farmingDetails: { method: 'natural', isOrganic: false },
    freshness: { harvestDate: new Date(), freshnessScore: 93 },
    rating: { average: 4.5, count: 41 }
  },
  {
    name: 'Organic Cow Milk',
    description: 'Certified organic cow milk from pasture-raised cows. No hormones or antibiotics.',
    category: 'dairy',
    price: { amount: 100, unit: 'liter' },
    stock: { quantity: 20, unit: 'liters' },
    images: [{ url: 'https://images.unsplash.com/photo-1571212515416-fca0bf4c2d1b?w=500&h=400&fit=crop' }],
    farmingDetails: { method: 'organic', isOrganic: true },
    freshness: { harvestDate: new Date(), freshnessScore: 97 },
    rating: { average: 4.8, count: 35 }
  },
  {
    name: 'Raw Milk',
    description: 'Unpasteurized raw milk straight from the farm. Rich in natural enzymes.',
    category: 'dairy',
    price: { amount: 90, unit: 'liter' },
    stock: { quantity: 12, unit: 'liters' },
    images: [{ url: 'https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=500&h=400&fit=crop' }],
    farmingDetails: { method: 'natural', isOrganic: false },
    freshness: { harvestDate: new Date(), freshnessScore: 96 },
    rating: { average: 4.6, count: 22 }
  }
];

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Farmer.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});
    console.log('🗑️ Cleared existing data');

    // Create sample users
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@kashirva.com',
      password: 'admin123',
      phone: '+919876543210',
      role: 'admin',
      isPhoneVerified: true,
      isActive: true
    });

    const farmerUser = await User.create({
      name: 'Ramesh Kumar',
      email: 'farmer@kashirva.com',
      password: 'farmer123',
      phone: '+919876543211',
      role: 'farmer',
      isPhoneVerified: true,
      isActive: true
    });

    const consumerUser = await User.create({
      name: 'Priya Sharma',
      email: 'consumer@kashirva.com',
      password: 'consumer123',
      phone: '+919876543212',
      role: 'consumer',
      isPhoneVerified: true,
      isActive: true
    });

    console.log('👥 Created sample users');

    // Create farmer profile
    const farmer = await Farmer.create({
      user: farmerUser._id,
      farmName: 'Green Valley Dairy Farm',
      farmAddress: {
        street: '123 Farm Road',
        city: 'Pune',
        state: 'Maharashtra',
        pincode: '411001',
        coordinates: { latitude: 18.5204, longitude: 73.8567 }
      },
      farmSize: 5,
      farmingExperience: 10,
      verification: {
        status: 'approved',
        documents: [
          { type: 'aadhar', url: 'sample-aadhar.jpg', verified: true },
          { type: 'land_records', url: 'sample-land.jpg', verified: true }
        ]
      },
      bankDetails: {
        accountNumber: '1234567890',
        ifscCode: 'SBIN0001234',
        accountHolderName: 'Ramesh Kumar'
      }
    });

    console.log('🚜 Created farmer profile');

    // Create milk products
    console.log('Seeding milk products...');
    const createdProducts = [];
    
    for (const productData of sampleProducts) {
      const product = await Product.create({
        ...productData,
        farmer: farmer._id
      });
      createdProducts.push(product);
    }

    console.log(`✅ Successfully seeded ${sampleProducts.length} milk products`);

    // Create sample order
    const sampleOrder = await Order.create({
      orderNumber: 'ORD-001',
      consumer: consumerUser._id,
      farmer: farmer._id,
      items: [{
        product: createdProducts[0]._id,
        quantity: 2,
        price: createdProducts[0].price.amount
      }],
      pricing: {
        subtotal: createdProducts[0].price.amount * 2,
        deliveryFee: 30,
        total: (createdProducts[0].price.amount * 2) + 30
      },
      deliveryAddress: {
        street: '456 Consumer Street',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001'
      },
      status: {
        current: 'pending',
        history: [{
          status: 'pending',
          timestamp: new Date(),
          note: 'Order placed successfully'
        }]
      }
    });

    console.log('📦 Created sample order');

    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📋 Sample Credentials:');
    console.log('Admin: admin@kashirva.com / admin123');
    console.log('Farmer: farmer@kashirva.com / farmer123');
    console.log('Consumer: consumer@kashirva.com / consumer123');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
};

module.exports = seedDatabase;