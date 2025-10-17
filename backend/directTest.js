const mongoose = require('mongoose');
require('dotenv').config();

mongoose.set('bufferCommands', false);
mongoose.set('strictQuery', false);

const patientSchema = new mongoose.Schema({
  name: String,
  age: Number
});

const Patient = mongoose.model('Patient', patientSchema);

async function test() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 30000,
      connectTimeoutMS: 30000,
      socketTimeoutMS: 30000,
    });
    
    console.log('✅ Connected! Now trying to query...');
    
    const patients = await Patient.find({});
    console.log('✅ Query successful!');
    console.log('Patients found:', patients.length);
    
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.log('❌ Error:', error.message);
    process.exit(1);
  }
}

test();