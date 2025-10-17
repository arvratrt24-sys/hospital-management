const express = require('express');
const router = express.Router();
const { createOrder, verifyAndUpdateAppointment } = require('../controllers/paymentController');
// This route creates the order
router.post('/create-order', createOrder);
// This route verifies the payment and updates the appointment
router.post('/verify-and-update', verifyAndUpdateAppointment);
module.exports = router;