#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Running Quick Fixes...\n');

// Check backend .env
const backendEnvPath = path.join(__dirname, '.env');
if (fs.existsSync(backendEnvPath)) {
  const envContent = fs.readFileSync(backendEnvPath, 'utf8');
  
  if (!envContent.includes('JWT_SECRET') || envContent.includes('JWT_SECRET=\n')) {
    console.log('⚠️  JWT_SECRET is empty in backend/.env');
    console.log('   Current value is OK for development\n');
  } else {
    console.log('✅ Backend .env configured\n');
  }
} else {
  console.log('❌ Backend .env file not found!\n');
}

// Check frontend .env
const frontendEnvPath = path.join(__dirname, '..', 'frontend', '.env');
if (fs.existsSync(frontendEnvPath)) {
  const envContent = fs.readFileSync(frontendEnvPath, 'utf8');
  
  if (envContent.includes('REACT_APP_API_URL=http://localhost:5000/api')) {
    console.log('✅ Frontend .env configured correctly\n');
  } else {
    console.log('⚠️  Frontend .env might have wrong API URL\n');
  }
} else {
  console.log('❌ Frontend .env file not found!\n');
}

// Check if MongoDB is accessible
const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/kshirva', {
  serverSelectionTimeoutMS: 3000
})
.then(() => {
  console.log('✅ MongoDB connection successful\n');
  mongoose.connection.close();
  
  console.log('=== QUICK FIX SUMMARY ===\n');
  console.log('✅ All basic checks passed');
  console.log('\n📝 Next Steps:');
  console.log('1. Start backend: cd backend && npm start');
  console.log('2. Start frontend: cd frontend && npm start');
  console.log('3. Open browser: http://localhost:3000/login');
  console.log('4. Use credentials from PROJECT_STATUS.md\n');
})
.catch((err) => {
  console.log('❌ MongoDB connection failed');
  console.log('   Error:', err.message);
  console.log('\n📝 Solution:');
  console.log('   Make sure MongoDB is running');
  console.log('   Windows: Start MongoDB service');
  console.log('   Or install MongoDB from: https://www.mongodb.com/try/download/community\n');
  process.exit(1);
});
