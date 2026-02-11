const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

const uri = 'mongodb://localhost:27017/kshirva';

async function testAdminLogin() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db('kshirva');
    
    // Check admin user
    const admin = await db.collection('users').findOne({ email: 'admin@kshirva.com' });
    
    if (!admin) {
      console.log('❌ Admin user not found');
      
      // Create admin user
      const newAdmin = await db.collection('users').insertOne({
        name: 'Admin User',
        email: 'admin@kshirva.com',
        password: await bcrypt.hash('admin123', 10),
        phone: '+919876543210',
        role: 'admin',
        isVerified: true,
        isActive: true,
        createdAt: new Date()
      });
      
      console.log('✅ Created new admin user');
      return;
    }
    
    console.log('✅ Admin user found');
    console.log('Email:', admin.email);
    console.log('Role:', admin.role);
    console.log('Active:', admin.isActive);
    console.log('Verified:', admin.isVerified);
    
    // Test password
    const isMatch = await bcrypt.compare('admin123', admin.password);
    console.log('Password match:', isMatch);
    
    if (!isMatch) {
      // Fix password
      await db.collection('users').updateOne(
        { email: 'admin@kshirva.com' },
        { $set: { password: await bcrypt.hash('admin123', 10) } }
      );
      console.log('✅ Fixed admin password');
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

testAdminLogin();