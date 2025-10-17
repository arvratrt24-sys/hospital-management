const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true
  },
  appointmentDate: {
    type: Date,
    required: true
  },
  appointmentTime: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Scheduled', 'Completed', 'Cancelled', 'Pending'],
    default: 'Pending'
  },
  reason: {
    type: String
  },
  notes: {
    type: String
  },
  // Payment fields
  consultationFee: {
    type: Number,
    default: 0
  },
  paymentStatus: {
    type: String,
    enum: ['Paid', 'Unpaid', 'Pending'],
    default: 'Unpaid'
  },
  paymentMethod: {
    type: String,
    enum: ['Cash', 'Card', 'UPI', 'Online', 'Not Paid'],
    default: 'Not Paid'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Appointment', appointmentSchema);