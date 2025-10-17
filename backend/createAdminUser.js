// --- START OF FILE backend/createAdminUser.js ---

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User'); // Import the User model

// Load environment variables
dotenv.config();

const createAdmin = async () => {
  try {
    // Connect to the database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected...');

    // --- DEFINE YOUR ADMIN CREDENTIALS HERE ---
    const adminUsername = 'admin';
    const adminPassword = 'password123';
    // ------------------------------------------

    // Check if the admin user already exists
    const userExists = await User.findOne({ username: adminUsername });

    if (userExists) {
      console.log('Admin user already exists!');
      mongoose.disconnect();
      return;
    }

    // Create the new user
    const adminUser = new User({
      username: adminUsername,
      password: adminPassword,
    });

    await adminUser.save();

    console.log('✅ Admin user created successfully!');
    console.log(`   Username: ${adminUsername}`);
    console.log(`   Password: ${adminPassword}`);
    
  } catch (error) {
    console.error('Error creating admin user:', error.message);
  } finally {
    // Disconnect from the database
    await mongoose.disconnect();
    console.log('MongoDB Disconnected.');
  }
};

// Run the function
createAdmin();