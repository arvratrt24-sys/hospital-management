const Appointment = require('../models/Appointment'); // Import the model

// --- 1. GET ALL APPOINTMENTS ---
const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('patient', 'name') // Only get patient's name
      .populate('doctor', 'name specialization consultationfee') // Get doctor's name, specialization, and fee
      .sort({ appointmentDate: -1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- 2. CREATE A NEW APPOINTMENT ---
const createAppointment = async (req, res) => {
  const { patient, doctor, appointmentDate, appointmentTime, reason } = req.body;

  const appointment = new Appointment({
    patient,
    doctor,
    appointmentDate,
    appointmentTime,
    reason,
    status: 'Pending' // The default status is 'Pending'
  });

  try {
    const newAppointment = await appointment.save();
    // Re-populate the new appointment before sending it back
    const populatedAppointment = await Appointment.findById(newAppointment._id)
      .populate('patient', 'name')
      .populate('doctor', 'name specialization consultationfee');
    res.status(201).json(populatedAppointment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// --- (Optional but good practice) Add your update and delete logic here too ---
const updateAppointment = async (req, res) => { /* ...your update logic... */ };
const deleteAppointment = async (req, res) => { /* ...your delete logic... */ };


// --- EXPORT ALL THE FUNCTIONS ---
module.exports = {
  getAllAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment,
};