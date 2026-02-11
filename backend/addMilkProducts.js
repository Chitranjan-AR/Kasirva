const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017/kshirva';

const milkProducts = [
  {
    name: 'Fresh Cow Milk',
    description: 'Pure, fresh cow milk from grass-fed cows. Rich in calcium and protein.',
    category: 'dairy',
    price: { amount: 60, unit: 'liter' },
    stock: { quantity: 50, unit: 'liters' },
    images: [{ url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500&h=400&fit=crop' }],
    farmingDetails: { method: 'organic', isOrganic: true },
    freshness: { harvestDate: new Date(), freshnessScore: 95 },
    rating: { average: 4.8, count: 45 },
    isActive: true,
    availability: { isAvailable: true }
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
    rating: { average: 4.6, count: 32 },
    isActive: true,
    availability: { isAvailable: true }
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
    rating: { average: 4.9, count: 28 },
    isActive: true,
    availability: { isAvailable: true }
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
    rating: { average: 4.7, count: 18 },
    isActive: true,
    availability: { isAvailable: true }
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
    rating: { average: 4.4, count: 52 },
    isActive: true,
    availability: { isAvailable: true }
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
    rating: { average: 4.5, count: 41 },
    isActive: true,
    availability: { isAvailable: true }
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
    rating: { average: 4.8, count: 35 },
    isActive: true,
    availability: { isAvailable: true }
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
    rating: { average: 4.6, count: 22 },
    isActive: true,
    availability: { isAvailable: true }
  }
];

async function addMilkProducts() {
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
    
    // Clear existing products
    await db.collection('products').deleteMany({});
    
    // Add farmer reference to products
    const productsWithFarmer = milkProducts.map(product => ({
      ...product,
      farmer: farmer._id,
      createdAt: new Date(),
      updatedAt: new Date()
    }));
    
    // Insert products
    await db.collection('products').insertMany(productsWithFarmer);
    
    console.log(`✅ Added ${milkProducts.length} milk products to kshirva database`);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

addMilkProducts();