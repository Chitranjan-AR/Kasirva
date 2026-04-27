const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017/kshirva';

async function addMissingFields() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db('kshirva');
    
    // Add missing fields to all products
    await db.collection('products').updateMany(
      {},
      { 
        $set: { 
          isActive: true,
          availability: { isAvailable: true },
          createdAt: new Date(),
          updatedAt: new Date()
        } 
      }
    );
    
    const count = await db.collection('products').countDocuments({});
    console.log(`Updated ${count} products with missing fields`);
    
    // Show all products
    const products = await db.collection('products').find({}).toArray();
    console.log('Products in database:', products.length);
    products.forEach(p => console.log(`- ${p.name} (${p.category})`));
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

addMissingFields();