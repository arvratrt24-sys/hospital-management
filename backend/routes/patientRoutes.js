const express = require('express');
const router = express.Router();

// 1. Import all the functions from the controller
const {
  getAllPatients,
  getPatientById,
  addPatient,
  updatePatient,
  deletePatient
} = require('../controllers/patientController');

// 2. Define the routes and connect them to the controller functions
// Notice there is no more logic here - just pointing to the right function.

// GET /api/patients
router.get('/', getAllPatients);

// GET /api/patients/:id
router.get('/:id', getPatientById);

// POST /api/patients
router.post('/', addPatient);

// PUT /api/patients/:id
router.put('/:id', updatePatient);

// DELETE /api/p-atients/:id
router.delete('/:id', deletePatient);

module.exports = router;