const Razorpay = require('razorpay');
const crypto = require('crypto');
const Appointment = require('../models/Appointment'); // Import the Appointment model

// Initialize Razorpay
const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Function 1: Create a Razorpay Order (This stays mostly the same)
const createOrder = async (req, res) => {
    try {
        const options = {
            amount: Number(req.body.amount * 100), // amount in paisa
            currency: "INR",
        };
        const order = await instance.orders.create(options);
        res.json(order);
    } catch (error) {
        res.status(500).send("Error creating order");
    }
};

// --- CRUCIAL CHANGE ---
// Function 2: Verify Payment AND UPDATE an existing Appointment
const verifyAndUpdateAppointment = async (req, res) => {
    try {
        const {
            appointmentId, // We now pass the ID of the appointment to update
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            amount,
        } = req.body;

        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(sign.toString()).digest('hex');

        if (razorpay_signature === expectedSign) {
            // Signature is valid. Find the appointment and update it.
            const updatedAppointment = await Appointment.findByIdAndUpdate(
                appointmentId,
                {
                    status: 'Scheduled', // Update status from 'Pending'
                    amountPaid: amount,
                    razorpay: {
                        orderId: razorpay_order_id,
                        paymentId: razorpay_payment_id,
                        signature: razorpay_signature,
                    }
                },
                { new: true } // Return the updated document
            ).populate('patient', 'name').populate('doctor', 'name'); // Re-populate for the UI

            res.json({ success: true, message: "Payment successful. Appointment is scheduled.", appointment: updatedAppointment });

        } else {
            res.status(400).json({ success: false, message: "Payment verification failed." });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

module.exports = {
    createOrder,
    verifyAndUpdateAppointment,
};