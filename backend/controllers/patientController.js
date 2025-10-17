const Patient = require('../models/Patient');

// --- 1. GET ALL PATIENTS ---
const getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find().sort({ createdAt: -1 });
    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- 2. GET SINGLE PATIENT ---
const getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    res.json(patient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- 3. ADD NEW PATIENT ---
const addPatient = async (req, res) => {
  console.log('--- New Patient Request ---');
  console.log('Received body:', req.body);

  const patient = new Patient({
    name: req.body.name,
    age: req.body.age,
    gender: req.body.gender,
    phone: req.body.phone,
    email: req.body.email,
    address: req.body.address,
    bloodGroup: req.body.bloodGroup,
    medicalHistory: req.body.medicalHistory
  });

  try {
    const newPatient = await patient.save();
    console.log('✅ Success! Patient saved to MongoDB:', newPatient);
    res.status(201).json(newPatient);
  } catch (error) {
    console.error('❌ MongoDB Save Error:', error);
    res.status(400).json({ message: 'Error saving patient.', error: error.message });
  }
};

// --- 4. UPDATE PATIENT ---
const updatePatient = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    Object.keys(req.body).forEach(key => {
      patient[key] = req.body[key];
    });

    const updatedPatient = await patient.save();
    res.json(updatedPatient);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// --- 5. DELETE PATIENT ---
const deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id); // More efficient
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    res.json({ message: 'Patient deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- EXPORT ALL FUNCTIONS ---
module.exports = {
  getAllPatients,
  getPatientById,
  addPatient,
  updatePatient,
  deletePatient
};