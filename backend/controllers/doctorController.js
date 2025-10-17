const Doctor = require('../models/Doctor');

// --- GET ALL DOCTORS ---
const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find().sort({ name: 1 });
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- GET SINGLE DOCTOR BY ID ---
const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- ADD NEW DOCTOR ---
const addDoctor = async (req, res) => {
  const doctor = new Doctor({
    name: req.body.name,
    specialization: req.body.specialization,
    phone: req.body.phone,
    email: req.body.email,
    qualification: req.body.qualification,
    experience: req.body.experience,
    consultationFee: req.body.consultationFee // Fixed: was consultationfee
  });
  
  try {
    const newDoctor = await doctor.save();
    res.status(201).json(newDoctor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// --- UPDATE DOCTOR ---
const updateDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Update fields
    if (req.body.name) doctor.name = req.body.name;
    if (req.body.specialization) doctor.specialization = req.body.specialization;
    if (req.body.phone) doctor.phone = req.body.phone;
    if (req.body.email) doctor.email = req.body.email;
    if (req.body.qualification) doctor.qualification = req.body.qualification;
    if (req.body.experience) doctor.experience = req.body.experience;
    if (req.body.consultationFee !== undefined) doctor.consultationFee = req.body.consultationFee;

    const updatedDoctor = await doctor.save();
    res.json(updatedDoctor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// --- DELETE DOCTOR ---
const deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    
    await doctor.deleteOne();
    res.json({ message: 'Doctor deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- EXPORT ALL FUNCTIONS ---
module.exports = {
  getAllDoctors,
  getDoctorById,
  addDoctor,
  updateDoctor,
  deleteDoctor
};