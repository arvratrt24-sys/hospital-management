const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');

// Get all appointments (with patient and doctor details)
router.get('/', async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('patient', 'name phone')
      .populate('doctor', 'name specialization consultationFee')
      .sort({ appointmentDate: -1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single appointment by ID
router.get('/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patient')
      .populate('doctor');
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new appointment
router.post('/', async (req, res) => {
  try {
    // Get doctor's consultation fee
    const doctor = await Doctor.findById(req.body.doctor);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    const appointment = new Appointment({
      patient: req.body.patient,
      doctor: req.body.doctor,
      appointmentDate: req.body.appointmentDate,
      appointmentTime: req.body.appointmentTime,
      status: req.body.status || 'Pending',
      reason: req.body.reason,
      notes: req.body.notes,
      consultationFee: doctor.consultationFee || 0,
      paymentStatus: 'Unpaid',
      paymentMethod: 'Not Paid'
    });

    const newAppointment = await appointment.save();
    const populatedAppointment = await Appointment.findById(newAppointment._id)
      .populate('patient', 'name phone')
      .populate('doctor', 'name specialization consultationFee');
    res.status(201).json(populatedAppointment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update appointment (including payment)
router.put('/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    Object.keys(req.body).forEach(key => {
      appointment[key] = req.body[key];
    });

    const updatedAppointment = await appointment.save();
    const populatedAppointment = await Appointment.findById(updatedAppointment._id)
      .populate('patient', 'name phone')
      .populate('doctor', 'name specialization consultationFee');
    res.json(populatedAppointment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete appointment
router.delete('/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    await appointment.deleteOne();
    res.json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;