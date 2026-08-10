/**
 * Demo Users Seed Script
 * Creates all 4 demo role accounts in the database.
 * Run: node src/seed/demoUsers.seed.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const dns = require('dns');

dns.setServers(['8.8.8.8', '8.8.4.4']);

const User = require('../models/User');

const DEMO_USERS = [
  {
    fullName: 'Admin User',
    email: 'admin@eldercare.com',
    password: 'Admin@123',
    role: 'ADMIN',
    phone: '+1-555-001-0001',
    status: 'ACTIVE',
  },
  {
    fullName: 'Manager User',
    email: 'manager@eldercare.com',
    password: 'Manager@123',
    role: 'MANAGER',
    phone: '+1-555-001-0002',
    status: 'ACTIVE',
  },
  {
    fullName: 'Analyst User',
    email: 'analyst@eldercare.com',
    password: 'Analyst@123',
    role: 'ANALYST',
    phone: '+1-555-001-0003',
    status: 'ACTIVE',
  },
  {
    fullName: 'Field Staff User',
    email: 'staff@eldercare.com',
    password: 'Staff@123',
    role: 'FIELD_STAFF',
    phone: '+1-555-001-0004',
    status: 'ACTIVE',
  },
];

async function seedDemoUsers() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    let created = 0;
    let skipped = 0;

    for (const userData of DEMO_USERS) {
      const existing = await User.findOne({ email: userData.email });

      if (existing) {
        console.log(`⏭️  Skipping ${userData.email} — already exists (role: ${existing.role})`);
        skipped++;
        continue;
      }

      const hashedPassword = await bcrypt.hash(userData.password, 10);
      await User.create({
        fullName: userData.fullName,
        email: userData.email,
        password: hashedPassword,
        role: userData.role,
        phone: userData.phone,
        status: userData.status,
      });

      console.log(`✅ Created [${userData.role}] → ${userData.email} / ${userData.password}`);
      created++;
    }

    console.log('\n📊 Seed Summary:');
    console.log(`   Created : ${created}`);
    console.log(`   Skipped : ${skipped}`);
    console.log('\n🎉 Demo users ready! You can now log in with the demo credentials on the login page.');
  } catch (error) {
    console.error('❌ Seed failed:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  }
}

seedDemoUsers();
