const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

const uri = 'mongodb://localhost:27017/kshirva';

async function completeSetup() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db('kshirva');
    
    console.log('🔄 Starting complete setup...');
    
    // Clear all collections
    await db.collection('users').deleteMany({});
    await db.collection('farmers').deleteMany({});
    await db.collection('products').deleteMany({});
    console.log('✅ Cleared existing data');
    
    // Create users
    const adminUser = await db.collection('users').insertOne({
      name: 'Admin User',
      email: 'admin@kshirva.com',
      password: await bcrypt.hash('admin123', 10),
      phone: '+919876543210',
      role: 'admin',
      isVerified: true,
      isActive: true,
      createdAt: new Date()
    });

    const farmerUser = await db.collection('users').insertOne({
      name: 'Milk Farmer',
      email: 'farmer@kshirva.com',
      password: await bcrypt.hash('farmer123', 10),
      phone: '+919876543211',
      role: 'farmer',
      isVerified: true,
      isActive: true,
      createdAt: new Date()
    });

    const consumerUser = await db.collection('users').insertOne({
      name: 'Consumer User',
      email: 'consumer@kshirva.com',
      password: await bcrypt.hash('consumer123', 10),
      phone: '+919876543212',
      role: 'consumer',
      isVerified: true,
      isActive: true,
      createdAt: new Date()
    });
    console.log('✅ Created users');

    // Create farmer profile
    const farmer = await db.collection('farmers').insertOne({
      user: farmerUser.insertedId,
      farmName: 'Fresh Milk Dairy',
      farmAddress: {
        street: '123 Dairy Road',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001'
      },
      verification: { 
        status: 'approved',
        verifiedAt: new Date()
      },
      rating: { average: 4.5, count: 50 },
      createdAt: new Date()
    });
    console.log('✅ Created farmer profile');

    // Create milk products
    const milkProducts = [
      {
        name: 'Fresh Cow Milk',
        description: 'Pure, fresh cow milk from grass-fed cows. Rich in calcium and protein.',
        category: 'dairy',
        price: { amount: 60, unit: 'liter' },
        stock: { quantity: 50, unit: 'liters', lowStockThreshold: 5 },
        images: [{ url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500&h=400&fit=crop' }],
        farmingDetails: { method: 'organic', isOrganic: true },
        freshness: { harvestDate: new Date(), freshnessScore: 95 },
        rating: { average: 4.8, count: 45 },
        isActive: true,
        availability: { isAvailable: true, seasonal: { availableMonths: [] } },
        farmer: farmer.insertedId,
        tags: [],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Buffalo Milk',
        description: 'Creamy buffalo milk with higher fat content. Perfect for making paneer and sweets.',
        category: 'dairy',
        price: { amount: 80, unit: 'liter' },
        stock: { quantity: 30, unit: 'liters', lowStockThreshold: 5 },
        images: [{ url: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=500&h=400&fit=crop' }],
        farmingDetails: { method: 'natural', isOrganic: false },
        freshness: { harvestDate: new Date(), freshnessScore: 92 },
        rating: { average: 4.6, count: 32 },
        isActive: true,
        availability: { isAvailable: true, seasonal: { availableMonths: [] } },
        farmer: farmer.insertedId,
        tags: [],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'A2 Cow Milk',
        description: 'Premium A2 cow milk from desi cows. Easier to digest and more nutritious.',
        category: 'dairy',
        price: { amount: 120, unit: 'liter' },
        stock: { quantity: 25, unit: 'liters', lowStockThreshold: 5 },
        images: [{ url: 'https://images.unsplash.com/photo-1571212515416-fca0bf4c2d1b?w=500&h=400&fit=crop' }],
        farmingDetails: { method: 'organic', isOrganic: true },
        freshness: { harvestDate: new Date(), freshnessScore: 98 },
        rating: { average: 4.9, count: 28 },
        isActive: true,
        availability: { isAvailable: true, seasonal: { availableMonths: [] } },
        farmer: farmer.insertedId,
        tags: [],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Goat Milk',
        description: 'Fresh goat milk with natural probiotics. Great for sensitive stomachs.',
        category: 'dairy',
        price: { amount: 150, unit: 'liter' },
        stock: { quantity: 15, unit: 'liters', lowStockThreshold: 5 },
        images: [{ url: 'https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=500&h=400&fit=crop' }],
        farmingDetails: { method: 'organic', isOrganic: true },
        freshness: { harvestDate: new Date(), freshnessScore: 94 },
        rating: { average: 4.7, count: 18 },
        isActive: true,
        availability: { isAvailable: true, seasonal: { availableMonths: [] } },
        farmer: farmer.insertedId,
        tags: [],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    await db.collection('products').insertMany(milkProducts);
    console.log('✅ Created milk products');

    console.log('\n🎉 Setup complete!');
    console.log('\n📋 Login Credentials:');
    console.log('Admin: admin@kshirva.com / admin123');
    console.log('Farmer: farmer@kshirva.com / farmer123');
    console.log('Consumer: consumer@kshirva.com / consumer123');
    console.log('\n📦 Products: 4 milk products added');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

completeSetup();