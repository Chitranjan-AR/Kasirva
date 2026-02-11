const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

const uri = 'mongodb://localhost:27017/kshirva';

async function testLogin() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db('kshirva');
    
    // Get admin user
    const user = await db.collection('users').findOne({ email: 'admin@kshirva.com' });
    
    if (!user) {
      console.log('❌ User not found');
      return;
    }
    
    console.log('✅ User found:', user.email);
    console.log('Password hash:', user.password);
    
    // Test password
    const testPassword = 'admin123';
    const isMatch = await bcrypt.compare(testPassword, user.password);
    
    console.log('Password test result:', isMatch);
    
    if (!isMatch) {
      // Create new hash
      const newHash = await bcrypt.hash(testPassword, 10);
      console.log('Creating new hash...');
      
      // Update user with new hash
      await db.collection('users').updateOne(
        { email: 'admin@kshirva.com' },
        { $set: { password: newHash } }
      );
      
      console.log('✅ Password updated for admin@kshirva.com');
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

testLogin();