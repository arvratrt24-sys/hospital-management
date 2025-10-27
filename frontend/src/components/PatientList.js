// --- START OF FILE frontend/src/components/PatientList.js ---

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config/api'; // ⭐ Make sure this import exists
import './PatientList.css';

function PatientList() {
  const [patients, setPatients] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '', age: '', gender: 'Male', phone: '', email: '',
    address: '', bloodGroup: 'A+', medicalHistory: ''
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/patients`); // ⭐ Changed from API_URL
      setPatients(response.data);
    } catch (error) {
      console.error('Error fetching patients:', error);
      alert('Error loading patients!');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API_BASE_URL}/api/patients/${editingId}`, formData); // ⭐ Changed from API_URL
        alert('Patient updated successfully!');
      } else {
        await axios.post(`${API_BASE_URL}/api/patients`, formData); // ⭐ Changed from API_URL
        alert('Patient added successfully!');
      }
      resetForm();
      fetchPatients();
    } catch (error) {
      console.error('Error saving patient:', error);
      alert('Error saving patient!');
    }
  };

  const handleEdit = (patient) => {
    setFormData({
      name: patient.name || '', age: patient.age || '', gender: patient.gender || 'Male',
      phone: patient.phone || '', email: patient.email || '', address: patient.address || '',
      bloodGroup: patient.bloodGroup || 'A+', medicalHistory: patient.medicalHistory || ''
    });
    setEditingId(patient._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      try {
        await axios.delete(`${API_BASE_URL}/api/patients/${id}`); // ⭐ Changed from API_URL
        alert('Patient deleted successfully!');
        fetchPatients();
      } catch (error) {
        console.error('Error deleting patient:', error);
        alert('Error deleting patient!');
      }
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      name: '', age: '', gender: 'Male', phone: '', email: '',
      address: '', bloodGroup: 'A+', medicalHistory: ''
    });
  };

  return (
    <div className="patient-list">
      <div className="header">
        <h2>Patient Management</h2>
        <button className="btn-add" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Add New Patient'}
        </button>
      </div>

      {showForm && (
        <form className="patient-form" onSubmit={handleSubmit}>
          <h3>{editingId ? 'Edit Patient' : 'Add New Patient'}</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Name *</label>
              <input 
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                required 
              />
            </div>
            <div className="form-group">
              <label>Age *</label>
              <input 
                type="number" 
                name="age" 
                value={formData.age} 
                onChange={handleChange} 
                required 
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Gender *</label>
              <select name="gender" value={formData.gender} onChange={handleChange}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>Blood Group</label>
              <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange}>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Phone *</label>
              <input 
                type="tel" 
                name="phone" 
                value={formData.phone} 
                onChange={handleChange} 
                required 
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
              />
            </div>
          </div>
          <div className="form-group">
            <label>Address</label>
            <input 
              type="text" 
              name="address" 
              value={formData.address} 
              onChange={handleChange} 
            />
          </div>
          <div className="form-group">
            <label>Medical History</label>
            <textarea 
              name="medicalHistory" 
              value={formData.medicalHistory} 
              onChange={handleChange} 
              rows="3" 
            />
          </div>
          <div className="form-buttons">
            <button type="submit" className="btn-submit">
              {editingId ? 'Update Patient' : 'Add Patient'}
            </button>
            <button type="button" className="btn-cancel" onClick={resetForm}>
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="table-container">
        <table className="patient-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Age</th>
              <th>Gender</th>
              <th>Phone</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {patients.length === 0 ? (
              <tr>
                <td colSpan="5" className="no-data">No patients found.</td>
              </tr>
            ) : (
              patients.map((patient) => (
                <tr key={patient._id}>
                  <td>{patient.name}</td>
                  <td>{patient.age}</td>
                  <td>{patient.gender}</td>
                  <td>{patient.phone}</td>
                  <td>
                    <button className="btn-edit" onClick={() => handleEdit(patient)}>
                      Edit
                    </button>
                    <button className="btn-delete" onClick={() => handleDelete(patient._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PatientList;