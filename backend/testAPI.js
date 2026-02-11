const fetch = require('node-fetch');

async function testLoginAPI() {
  try {
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        identifier: 'admin@kshirva.com',
        password: 'admin123'
      })
    });

    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', data);

  } catch (error) {
    console.error('Error:', error.message);
  }
}

testLoginAPI();