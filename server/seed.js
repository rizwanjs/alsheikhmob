const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Role = require('./models/Role');
const Setting = require('./models/Setting');
require('dotenv').config();

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/al-sheikh-mobiles');
    console.log('Connected to MongoDB');

    // Create default roles
    const roles = [
      {
        name: 'Admin',
        description: 'System Administrator',
        isSystem: true,
        permissions: {
          dashboard: { view: true },
          sales: { view: true, create: true, refund: true, overridePrice: true },
          customers: { view: true, manage: true },
          inventory: { view: true, manage: true },
          usedPhones: { view: true, manage: true },
          purchases: { view: true, create: true },
          suppliers: { view: true, manage: true },
          repairs: { view: true, manage: true },
          expenses: { view: true, manage: true },
          reports: { view: true },
          users: { view: true, manage: true },
          roles: { view: true, manage: true },
          settings: { view: true, manage: true },
          backup: { view: true, manage: true }
        }
      },
      {
        name: 'Cashier',
        description: 'POS Operator',
        isSystem: true,
        permissions: {
          dashboard: { view: true },
          sales: { view: true, create: true, refund: false, overridePrice: false },
          customers: { view: true, manage: true },
          inventory: { view: true, manage: false },
          usedPhones: { view: true, manage: false },
          purchases: { view: false, create: false },
          suppliers: { view: false, manage: false },
          repairs: { view: true, manage: false },
          expenses: { view: false, manage: false },
          reports: { view: false },
          users: { view: false, manage: false },
          roles: { view: false, manage: false },
          settings: { view: false, manage: false },
          backup: { view: false, manage: false }
        }
      },
      {
        name: 'Manager',
        description: 'Shop Manager',
        isSystem: true,
        permissions: {
          dashboard: { view: true },
          sales: { view: true, create: true, refund: true, overridePrice: true },
          customers: { view: true, manage: true },
          inventory: { view: true, manage: true },
          usedPhones: { view: true, manage: true },
          purchases: { view: true, create: true },
          suppliers: { view: true, manage: true },
          repairs: { view: true, manage: true },
          expenses: { view: true, manage: true },
          reports: { view: true },
          users: { view: true, manage: false },
          roles: { view: false, manage: false },
          settings: { view: true, manage: false },
          backup: { view: true, manage: false }
        }
      },
      {
        name: 'Salesman',
        description: 'Sales Staff',
        isSystem: true,
        permissions: {
          dashboard: { view: true },
          sales: { view: true, create: true, refund: false, overridePrice: false },
          customers: { view: true, manage: true },
          inventory: { view: true, manage: false },
          usedPhones: { view: true, manage: false },
          purchases: { view: false, create: false },
          suppliers: { view: false, manage: false },
          repairs: { view: true, manage: false },
          expenses: { view: false, manage: false },
          reports: { view: false },
          users: { view: false, manage: false },
          roles: { view: false, manage: false },
          settings: { view: false, manage: false },
          backup: { view: false, manage: false }
        }
      },
      {
        name: 'Technician',
        description: 'Repair Technician',
        isSystem: true,
        permissions: {
          dashboard: { view: true },
          sales: { view: false, create: false, refund: false, overridePrice: false },
          customers: { view: true, manage: false },
          inventory: { view: true, manage: false },
          usedPhones: { view: false, manage: false },
          purchases: { view: false, create: false },
          suppliers: { view: false, manage: false },
          repairs: { view: true, manage: true },
          expenses: { view: false, manage: false },
          reports: { view: false },
          users: { view: false, manage: false },
          roles: { view: false, manage: false },
          settings: { view: false, manage: false },
          backup: { view: false, manage: false }
        }
      }
    ];

    for (const roleData of roles) {
      await Role.findOneAndUpdate(
        { name: roleData.name },
        roleData,
        { upsert: true, new: true }
      );
    }
    console.log('Roles created');

    // Create default admin
    const existingAdmin = await User.findOne({ email: 'admin@alsheikh.com' });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const admin = new User({
        name: 'Administrator',
        email: 'admin@alsheikh.com',
        password: hashedPassword,
        role: 'Admin',
        phone: '0300-1234567'
      });
      await admin.save();
      console.log('Default admin created: admin@alsheikh.com / admin123');
    }

    // Create default settings
    const existingSettings = await Setting.findOne();
    if (!existingSettings) {
      const settings = new Setting({
        shopName: 'Al Sheikh Mobiles',
        shopPhone: '',
        shopAddress: 'Main Market',
        taxNumber: '',
        invoicePrefix: 'INV-',
        currency: 'Rs',
        taxRate: 0,
        theme: 'dark',
        lowStockAlert: 5
      });
      await settings.save();
      console.log('Default settings created');
    }

    console.log('Seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

seed();
