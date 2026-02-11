const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017/kshirva';

async function fixProductsWithFarmer() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db('kshirva');
    
    // Get farmer
    const farmer = await db.collection('farmers').findOne({});
    if (!farmer) {
      console.log('No farmer found');
      return;
    }
    
    // Update all products with farmer reference
    await db.collection('products').updateMany(
      {},
      { 
        $set: { 
          farmer: farmer._id,
          isActive: true,
          availability: { isAvailable: true }
        } 
      }
    );
    
    const count = await db.collection('products').countDocuments({});
    console.log(`✅ Updated ${count} products with farmer reference`);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

fixProductsWithFarmer();