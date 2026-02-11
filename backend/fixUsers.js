const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017/kshirva';

async function fixUsers() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db('kshirva');
    
    // Update all users to be verified
    await db.collection('users').updateMany(
      {},
      { 
        $set: { 
          isVerified: true,
          isPhoneVerified: true
        } 
      }
    );
    
    console.log('✅ Fixed user verification status');
    
    // Show all users
    const users = await db.collection('users').find({}).toArray();
    users.forEach(user => {
      console.log(`${user.email} - ${user.role} - verified: ${user.isVerified}`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

fixUsers();