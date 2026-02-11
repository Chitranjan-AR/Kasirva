const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

const uri = 'mongodb://localhost:27017/kshirva';

async function createUsers() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db('kshirva');
    
    // Clear existing users
    await db.collection('users').deleteMany({});
    await db.collection('farmers').deleteMany({});
    
    // Create users with proper hashed passwords
    const adminUser = await db.collection('users').insertOne({
      name: 'Admin User',
      email: 'admin@kshirva.com',
      password: await bcrypt.hash('admin123', 10),
      phone: '+919876543210',
      role: 'admin',
      isPhoneVerified: true,
      isActive: true,
      createdAt: new Date()
    });

    const farmerUser = await db.collection('users').insertOne({
      name: 'Milk Farmer',
      email: 'farmer@kshirva.com',
      password: await bcrypt.hash('farmer123', 10),
      phone: '+919876543211',
      role: 'farmer',
      isPhoneVerified: true,
      isActive: true,
      createdAt: new Date()
    });

    const consumerUser = await db.collection('users').insertOne({
      name: 'Consumer User',
      email: 'consumer@kshirva.com',
      password: await bcrypt.hash('consumer123', 10),
      phone: '+919876543212',
      role: 'consumer',
      isPhoneVerified: true,
      isActive: true,
      createdAt: new Date()
    });

    // Create farmer profile
    await db.collection('farmers').insertOne({
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

    console.log('✅ Created users with credentials:');
    console.log('Admin: admin@kshirva.com / admin123');
    console.log('Farmer: farmer@kshirva.com / farmer123');
    console.log('Consumer: consumer@kshirva.com / consumer123');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

createUsers();