const mongoose = require('mongoose');
require('dotenv').config();

console.log('Testing MongoDB Connection...');
console.log('URI:', process.env.MONGODB_URI);

mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 5000,
})
  .then(() => {
    console.log('✅ Connection Successful!');
    process.exit(0);
  })
  .catch((err) => {
    console.log('❌ Connection Failed!');
    console.log('Error:', err.message);
    process.exit(1);
  });