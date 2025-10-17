const express = require('express');
const router = express.Router();

// Import all controller functions
const {
  getAllDoctors,
  getDoctorById,
  addDoctor,
  updateDoctor,
  deleteDoctor
} = require('../controllers/doctorController');

// Routes
router.get('/', getAllDoctors);           // GET all doctors
router.get('/:id', getDoctorById);        // GET single doctor
router.post('/', addDoctor);              // CREATE new doctor
router.put('/:id', updateDoctor);         // UPDATE doctor
router.delete('/:id', deleteDoctor);      // DELETE doctor

module.exports = router;