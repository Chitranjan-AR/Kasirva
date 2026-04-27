const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function testAllLogins() {
  console.log('=== TESTING ALL USER LOGINS ===\n');

  const users = [
    { email: 'admin@kshirva.com', password: 'admin123', role: 'admin' },
    { email: 'farmer@kshirva.com', password: 'farmer123', role: 'farmer' },
    { email: 'consumer@kshirva.com', password: 'consumer123', role: 'consumer' }
  ];

  for (const user of users) {
    try {
      console.log(`Testing ${user.role.toUpperCase()} login...`);
      
      const response = await axios.post(`${API_URL}/auth/login`, {
        identifier: user.email,
        password: user.password
      });

      if (response.data.token && response.data.user) {
        console.log(`✅ ${user.role.toUpperCase()} LOGIN SUCCESS`);
        console.log(`   Name: ${response.data.user.name}`);
        console.log(`   Email: ${response.data.user.email}`);
        console.log(`   Role: ${response.data.user.role}`);
        console.log(`   Token: ${response.data.token.substring(0, 30)}...`);
        
        // Test /me endpoint
        const meResponse = await axios.get(`${API_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${response.data.token}` }
        });
        console.log(`   ✅ /me endpoint working`);
      }
      
      console.log('');
    } catch (error) {
      console.log(`❌ ${user.role.toUpperCase()} LOGIN FAILED`);
      console.log(`   Error: ${error.response?.data?.message || error.message}`);
      console.log('');
    }
  }

  console.log('=== TEST COMPLETED ===');
}

testAllLogins();
