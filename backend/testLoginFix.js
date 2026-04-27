const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function testLogin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/kshirva');
    console.log('Connected to MongoDB');

    // Test user credentials
    const testEmail = 'test@example.com';
    const testPassword = 'password123';

    // Find user
    const user = await User.findOne({ email: testEmail });
    
    if (!user) {
      console.log('❌ User not found. Creating test user...');
      
      const newUser = new User({
        name: 'Test User',
        email: testEmail,
        phone: '9999999999',
        password: testPassword,
        role: 'consumer',
        isVerified: true,
        isActive: true
      });
      
      await newUser.save();
      console.log('✅ Test user created successfully');
      console.log('Email:', testEmail);
      console.log('Password:', testPassword);
    } else {
      console.log('✅ User found:', user.email);
      
      // Test password comparison
      const isMatch = await user.comparePassword(testPassword);
      console.log('Password match:', isMatch ? '✅ YES' : '❌ NO');
      
      if (!isMatch) {
        console.log('Updating password...');
        user.password = testPassword;
        await user.save();
        console.log('✅ Password updated');
      }
    }

    await mongoose.connection.close();
    console.log('\n✅ Test completed successfully');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

testLogin();
