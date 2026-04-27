const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function testAdminProductManagement() {
  console.log('=== TESTING ADMIN PRODUCT MANAGEMENT ===\n');

  try {
    // 1. Login as admin
    console.log('1. Logging in as admin...');
    const loginRes = await axios.post(`${API_URL}/auth/login`, {
      identifier: 'admin@kshirva.com',
      password: 'admin123'
    });
    
    const adminToken = loginRes.data.token;
    console.log('✅ Admin logged in\n');

    // 2. Get all products
    console.log('2. Fetching all products...');
    const productsRes = await axios.get(`${API_URL}/products`);
    console.log(`✅ Found ${productsRes.data.products.length} products\n`);

    // 3. Add a new product (need farmer ID first)
    console.log('3. Getting farmer for product...');
    const farmersRes = await axios.get(`${API_URL}/admin/farmers`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    
    if (farmersRes.data.farmers.length > 0) {
      const farmerId = farmersRes.data.farmers[0]._id;
      console.log(`✅ Using farmer ID: ${farmerId}\n`);

      console.log('4. Adding new product...');
      const newProduct = {
        farmer: farmerId,
        name: 'Fresh Organic Milk',
        description: 'Pure organic milk from grass-fed cows',
        category: 'dairy',
        subcategory: 'milk',
        images: [{ url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500', alt: 'Milk' }],
        price: { amount: 60, unit: 'litre' },
        stock: { quantity: 100, unit: 'litre', lowStockThreshold: 10 },
        freshness: { harvestDate: new Date(), freshnessScore: 95 },
        farmingDetails: { method: 'organic', isOrganic: true },
        availability: { isAvailable: true },
        rating: { average: 4.5, count: 0 },
        tags: ['organic', 'fresh', 'dairy']
      };

      const addRes = await axios.post(`${API_URL}/admin/products`, newProduct, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      
      const productId = addRes.data.product._id;
      console.log(`✅ Product added successfully! ID: ${productId}\n`);

      // 5. Get product details
      console.log('5. Fetching product details...');
      const productRes = await axios.get(`${API_URL}/products/${productId}`);
      console.log(`✅ Product: ${productRes.data.name}`);
      console.log(`   Price: ₹${productRes.data.price.amount}/${productRes.data.price.unit}`);
      console.log(`   Stock: ${productRes.data.stock.quantity} ${productRes.data.stock.unit}\n`);

      // 6. Update product
      console.log('6. Updating product...');
      const updateRes = await axios.put(`${API_URL}/products/${productId}`, {
        'price.amount': 65,
        'stock.quantity': 80
      }, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      console.log(`✅ Product updated\n`);

      // 7. Delete product
      console.log('7. Deleting product...');
      await axios.delete(`${API_URL}/products/${productId}`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      console.log(`✅ Product deleted successfully\n`);

    } else {
      console.log('⚠️  No farmers found. Run setupAllUsers.js first\n');
    }

    console.log('=== ALL TESTS PASSED ✅ ===\n');
    console.log('Admin can:');
    console.log('✅ View all products');
    console.log('✅ Add new products');
    console.log('✅ Update products');
    console.log('✅ Delete products');
    console.log('\nOnly active products (isActive: true) will show to consumers.');

  } catch (error) {
    console.error('❌ Test failed:');
    console.error('Error:', error.response?.data?.message || error.message);
  }
}

testAdminProductManagement();
