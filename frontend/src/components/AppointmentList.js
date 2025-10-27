import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config/api'; // ⭐ Added import
import './PatientList.css'; 
import PaymentButton from './PaymentButton';

function AppointmentList() {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    patient: '', doctor: '', appointmentDate: '', appointmentTime: '', reason: ''
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchAppointments();
    fetchPatients();
    fetchDoctors();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/appointments`); // ⭐ Updated
      setAppointments(response.data);
    } catch (error) { 
      console.error('Error fetching appointments:', error); 
      alert('Error loading appointments!');
    }
  };
  
  const fetchPatients = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/patients`); // ⭐ Updated
      setPatients(response.data);
    } catch (error) { console.error('Error fetching patients:', error); }
  };

  const fetchDoctors = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/doctors`); // ⭐ Updated
      setDoctors(response.data);
    } catch (error) { console.error('Error fetching doctors:', error); }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.patient || !formData.doctor || !formData.appointmentDate || !formData.appointmentTime) {
      alert('Please fill all required fields');
      return;
    }
    try {
      if (editingId) {
        await axios.put(`${API_BASE_URL}/api/appointments/${editingId}`, formData); // ⭐ Updated
        alert('Appointment updated successfully!');
      } else {
        await axios.post(`${API_BASE_URL}/api/appointments`, formData); // ⭐ Updated
        alert('Appointment created successfully! Please proceed to payment.');
      }
      resetForm();
      fetchAppointments();
    } catch (error) {
      console.error('Error saving appointment:', error);
      alert('Error saving appointment!');
    }
  };

  const handleEdit = (appointment) => {
    setFormData({
      patient: appointment.patient._id,
      doctor: appointment.doctor._id,
      appointmentDate: new Date(appointment.appointmentDate).toISOString().split('T')[0],
      appointmentTime: appointment.appointmentTime || '',
      reason: appointment.reason || ''
    });
    setEditingId(appointment._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      try {
        await axios.delete(`${API_BASE_URL}/api/appointments/${id}`); // ⭐ Updated
        alert('Appointment deleted successfully!');
        fetchAppointments();
      } catch (error) {
        console.error('Error deleting appointment:', error);
        alert('Error deleting appointment!');
      }
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ patient: '', doctor: '', appointmentDate: '', appointmentTime: '', reason: '' });
  };
  
  const handlePaymentSuccess = (updatedAppointment) => {
    setAppointments(prev =>
      prev.map(appt =>
        appt._id === updatedAppointment._id ? updatedAppointment : appt
      )
    );
  };

  return (
    <div className="patient-list">
      <div className="header">
        <h2>Appointment Management</h2>
        <button className="btn-add" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ New Appointment'}
        </button>
      </div>

      {showForm && (
        <form className="patient-form" onSubmit={handleSubmit}>
          <h3>{editingId ? 'Edit Appointment' : 'Create New Appointment'}</h3>
          <div className="form-row">
            <div className="form-group">
                <label>Patient *</label>
                <select name="patient" value={formData.patient} onChange={handleChange} required>
                    <option value="">-- Select Patient --</option>
                    {patients.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                </select>
            </div>
            <div className="form-group">
                <label>Doctor *</label>
                <select name="doctor" value={formData.doctor} onChange={handleChange} required>
                    <option value="">-- Select Doctor --</option>
                    {doctors.map(d => (
                      <option key={d._id} value={d._id}>
                        {d.name} ({d.specialization}) - ₹{d.consultationFee || 0}
                      </option>
                    ))}
                </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
                <label>Appointment Date *</label>
                <input type="date" name="appointmentDate" value={formData.appointmentDate} onChange={handleChange} required />
            </div>
            <div className="form-group">
                <label>Appointment Time *</label>
                <input type="time" name="appointmentTime" value={formData.appointmentTime} onChange={handleChange} required />
            </div>
          </div>
          <div className="form-group">
            <label>Reason for Appointment</label>
            <textarea name="reason" value={formData.reason} onChange={handleChange} rows="3" />
          </div>
          <div className="form-buttons">
            <button type="submit" className="btn-submit">{editingId ? 'Update Appointment' : 'Create Appointment'}</button>
            <button type="button" className="btn-cancel" onClick={resetForm}>Cancel</button>
          </div>
        </form>
      )}

      <div className="table-container">
        <table className="patient-table">
          <thead>
            <tr>
              <th>Patient</th>
              <th>Doctor</th>
              <th>Date & Time</th>
              <th>Fee</th>
              <th>Payment Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.length > 0 ? (
              appointments.map((appt) => (
                <tr key={appt._id}>
                  <td>{appt.patient?.name || 'N/A'}</td>
                  <td>{appt.doctor?.name || 'N/A'}</td>
                  <td>{new Date(appt.appointmentDate).toLocaleDateString()} at {appt.appointmentTime}</td>
                  <td className="fee-cell">
                    <strong>₹{appt.consultationFee || appt.doctor?.consultationFee || 0}</strong>
                  </td>
                  <td>
                    <span className={`payment-badge payment-${appt.paymentStatus?.toLowerCase()}`}>
                      {appt.paymentStatus || 'Unpaid'}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <button className="btn-edit" onClick={() => handleEdit(appt)}>Edit</button>
                    <button className="btn-delete" onClick={() => handleDelete(appt._id)}>Delete</button>
                    {appt.paymentStatus !== 'Paid' && (
                      <PaymentButton
                        appointment={appt}
                        onPaymentSuccess={handlePaymentSuccess}
                      />
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="no-data">No appointments found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AppointmentList;