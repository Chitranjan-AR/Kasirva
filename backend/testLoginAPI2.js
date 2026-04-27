const axios = require('axios');

async function testLoginAPI() {
  try {
    console.log('Testing login API...\n');
    
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      identifier: 'test@example.com',
      password: 'password123'
    });
    
    console.log('✅ Login successful!');
    console.log('Token:', response.data.token);
    console.log('User:', response.data.user);
  } catch (error) {
    console.error('❌ Login failed:');
    console.error('Status:', error.response?.status);
    console.error('Message:', error.response?.data?.message);
    console.error('Full error:', error.response?.data);
  }
}

testLoginAPI();
