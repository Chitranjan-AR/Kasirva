const mongoose = require('mongoose');
const User = require('./models/User');
const Farmer = require('./models/Farmer');
require('dotenv').config();

async function setupAllUsers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/kshirva');
    console.log('✅ Connected to MongoDB\n');

    // Test users data
    const users = [
      {
        name: 'Admin User',
        email: 'admin@kshirva.com',
        phone: '9999999991',
        password: 'admin123',
        role: 'admin',
        isVerified: true,
        isActive: true
      },
      {
        name: 'Farmer User',
        email: 'farmer@kshirva.com',
        phone: '9999999992',
        password: 'farmer123',
        role: 'farmer',
        isVerified: true,
        isActive: true
      },
      {
        name: 'Consumer User',
        email: 'consumer@kshirva.com',
        phone: '9999999993',
        password: 'consumer123',
        role: 'consumer',
        isVerified: true,
        isActive: true
      }
    ];

    console.log('Creating/Updating users...\n');

    for (const userData of users) {
      let user = await User.findOne({ email: userData.email });
      
      if (user) {
        console.log(`✅ User exists: ${userData.email}`);
        user.password = userData.password;
        user.isActive = true;
        await user.save();
        console.log(`   Password updated for ${userData.role}\n`);
      } else {
        user = new User(userData);
        await user.save();
        console.log(`✅ Created new user: ${userData.email}`);
        console.log(`   Role: ${userData.role}\n`);
      }

      // Create farmer profile if role is farmer
      if (userData.role === 'farmer') {
        let farmer = await Farmer.findOne({ user: user._id });
        if (!farmer) {
          farmer = new Farmer({
            user: user._id,
            farmName: 'Test Farm',
            farmLocation: {
              address: 'Test Address, Delhi',
              city: 'Delhi',
              state: 'Delhi',
              pincode: '110001',
              coordinates: {
                lat: 28.6139,
                lng: 77.2090
              }
            },
            farmingMethod: 'organic',
            cropTypes: ['vegetables', 'fruits'],
            deliveryRadius: 10,
            verification: {
              status: 'approved',
              verifiedAt: new Date()
            }
          });
          await farmer.save();
          console.log(`   ✅ Farmer profile created\n`);
        }
      }
    }

    console.log('\n=== LOGIN CREDENTIALS ===\n');
    console.log('ADMIN LOGIN:');
    console.log('  Email: admin@kshirva.com');
    console.log('  Password: admin123\n');
    
    console.log('FARMER LOGIN:');
    console.log('  Email: farmer@kshirva.com');
    console.log('  Password: farmer123\n');
    
    console.log('CONSUMER LOGIN:');
    console.log('  Email: consumer@kshirva.com');
    console.log('  Password: consumer123\n');

    // Test password verification
    console.log('=== TESTING PASSWORD VERIFICATION ===\n');
    for (const userData of users) {
      const user = await User.findOne({ email: userData.email });
      const isMatch = await user.comparePassword(userData.password);
      console.log(`${userData.role.toUpperCase()}: ${isMatch ? '✅ Password OK' : '❌ Password FAILED'}`);
    }

    await mongoose.connection.close();
    console.log('\n✅ Setup completed successfully!');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

setupAllUsers();
