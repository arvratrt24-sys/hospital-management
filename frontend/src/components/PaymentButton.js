import React, { useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config/api'; // ⭐ Added import
import './PaymentButton.css';

function PaymentButton({ appointment, onPaymentSuccess }) {
  const [showModal, setShowModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [processing, setProcessing] = useState(false);

  const handlePayment = async () => {
    setProcessing(true);
    try {
      const response = await axios.put(`${API_BASE_URL}/api/appointments/${appointment._id}`, { // ⭐ Updated
        paymentStatus: 'Paid',
        paymentMethod: paymentMethod,
        status: 'Scheduled'
      });
      
      alert(`Payment of ₹${appointment.consultationFee || appointment.doctor?.consultationFee} successful!`);
      setShowModal(false);
      onPaymentSuccess(response.data);
    } catch (error) {
      console.error('Error processing payment:', error);
      alert('Payment failed! Please try again.');
    }
    setProcessing(false);
  };

  const fee = appointment.consultationFee || appointment.doctor?.consultationFee || 0;

  return (
    <>
      <button 
        className="btn-payment" 
        onClick={() => setShowModal(true)}
      >
        Pay Now
      </button>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Payment Details</h3>
            <div className="payment-info">
              <p><strong>Patient:</strong> {appointment.patient?.name}</p>
              <p><strong>Doctor:</strong> {appointment.doctor?.name}</p>
              <p><strong>Consultation Fee:</strong> <span className="fee-amount">₹{fee}</span></p>
            </div>

            <div className="payment-method">
              <label><strong>Payment Method:</strong></label>
              <select 
                value={paymentMethod} 
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option value="Cash">Cash</option>
                <option value="Card">Card</option>
                <option value="UPI">UPI</option>
                <option value="Online">Online Transfer</option>
              </select>
            </div>

            <div className="modal-buttons">
              <button 
                className="btn-confirm-payment" 
                onClick={handlePayment}
                disabled={processing}
              >
                {processing ? 'Processing...' : `Confirm Payment ₹${fee}`}
              </button>
              <button 
                className="btn-cancel-modal" 
                onClick={() => setShowModal(false)}
                disabled={processing}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default PaymentButton;