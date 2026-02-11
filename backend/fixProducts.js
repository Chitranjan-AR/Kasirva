const { MongoClient, ObjectId } = require('mongodb');

const uri = 'mongodb://localhost:27017/kshirva';

async function fixProducts() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db('kashirva');
    
    // Get first farmer
    const farmer = await db.collection('farmers').findOne({});
    if (!farmer) {
      console.log('No farmer found, creating one...');
      
      // Create a farmer first
      const user = await db.collection('users').findOne({ role: 'farmer' });
      if (!user) {
        const newUser = await db.collection('users').insertOne({
          name: 'Milk Farmer',
          email: 'milkfarmer@kashirva.com',
          password: '$2a$10$example', // hashed password
          phone: '+919876543213',
          role: 'farmer',
          isPhoneVerified: true,
          isActive: true,
          createdAt: new Date()
        });
        
        const newFarmer = await db.collection('farmers').insertOne({
          user: newUser.insertedId,
          farmName: 'Fresh Milk Dairy',
          farmAddress: {
            street: '123 Dairy Road',
            city: 'Mumbai',
            state: 'Maharashtra',
            pincode: '400001'
          },
          verification: { status: 'approved' },
          createdAt: new Date()
        });
        
        console.log('Created farmer');
        
        // Update all products with farmer reference
        await db.collection('products').updateMany(
          {},
          { $set: { farmer: newFarmer.insertedId, createdAt: new Date(), updatedAt: new Date() } }
        );
      }
    } else {
      // Update products with existing farmer
      await db.collection('products').updateMany(
        {},
        { $set: { farmer: farmer._id, createdAt: new Date(), updatedAt: new Date() } }
      );
    }
    
    const count = await db.collection('products').countDocuments({});
    console.log(`Updated ${count} products with farmer reference`);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

fixProducts();