const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  specialization: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  qualification: {
    type: String
  },
  experience: {
    type: Number  // years of experience
  },
  consultationFee: {
    type: Number
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Doctor', doctorSchema);