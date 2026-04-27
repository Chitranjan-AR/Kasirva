const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017/kshirva';

const milkImages = [
  'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500&h=400&fit=crop', // Fresh milk glass
  'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=500&h=400&fit=crop', // Milk bottle
  'https://images.unsplash.com/photo-1571212515416-fca0bf4c2d1b?w=500&h=400&fit=crop', // Milk jug
  'https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=500&h=400&fit=crop', // Milk pitcher
  'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=500&h=400&fit=crop', // Milk carton
  'https://images.unsplash.com/photo-1606958904481-25b2cd0b4e3b?w=500&h=400&fit=crop', // Milk splash
  'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500&h=400&fit=crop', // Milk glass 2
  'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=500&h=400&fit=crop'  // Milk bottle 2
];

async function updateMilkImages() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db('kshirva');
    
    const products = await db.collection('products').find({}).toArray();
    
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      await db.collection('products').updateOne(
        { _id: product._id },
        { 
          $set: { 
            images: [{ url: milkImages[i % milkImages.length] }]
          } 
        }
      );
    }
    
    console.log(`Updated ${products.length} products with milk images`);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

updateMilkImages();