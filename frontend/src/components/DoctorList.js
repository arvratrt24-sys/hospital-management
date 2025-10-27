import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config/api'; // ⭐ Added import
import './PatientList.css';

function DoctorList() {
  const [doctors, setDoctors] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '', 
    specialization: '', 
    phone: '', 
    email: '',
    qualification: '', 
    experience: '', 
    consultationFee: ''
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/doctors`); // ⭐ Updated
      setDoctors(response.data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      alert('Error loading doctors!');
    }
  };

  const handleChange = (e) => {
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API_BASE_URL}/api/doctors/${editingId}`, formData); // ⭐ Updated
        alert('Doctor updated successfully!');
      } else {
        await axios.post(`${API_BASE_URL}/api/doctors`, formData); // ⭐ Updated
        alert('Doctor added successfully!');
      }
      resetForm();
      fetchDoctors();
    } catch (error) {
      console.error('Error saving doctor:', error);
      alert('Error saving doctor!');
    }
  };

  const handleEdit = (doctor) => {
    setFormData({
      name: doctor.name || '', 
      specialization: doctor.specialization || '',
      phone: doctor.phone || '', 
      email: doctor.email || '',
      qualification: doctor.qualification || '', 
      experience: doctor.experience || '',
      consultationFee: doctor.consultationFee || ''
    });
    setEditingId(doctor._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this doctor?')) {
      try {
        await axios.delete(`${API_BASE_URL}/api/doctors/${id}`); // ⭐ Updated
        alert('Doctor deleted successfully!');
        fetchDoctors();
      } catch (error) {
        console.error('Error deleting doctor:', error);
        alert('Error deleting doctor!');
      }
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      name: '', 
      specialization: '', 
      phone: '', 
      email: '',
      qualification: '', 
      experience: '', 
      consultationFee: ''
    });
  };

  return (
    <div className="patient-list">
      <div className="header">
        <h2>Doctor Management</h2>
        <button className="btn-add" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Add New Doctor'}
        </button>
      </div>

      {showForm && (
        <form className="patient-form" onSubmit={handleSubmit}>
          <h3>{editingId ? 'Edit Doctor' : 'Add New Doctor'}</h3>
          
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
              <label>Specialization *</label>
              <input 
                type="text" 
                name="specialization" 
                value={formData.specialization} 
                onChange={handleChange} 
                required 
              />
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
              <label>Email *</label>
              <input 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
                required 
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Qualification</label>
              <input 
                type="text" 
                name="qualification" 
                value={formData.qualification} 
                onChange={handleChange} 
              />
            </div>
            <div className="form-group">
              <label>Experience (Years)</label>
              <input 
                type="number" 
                name="experience" 
                value={formData.experience} 
                onChange={handleChange} 
              />
            </div>
          </div>

          <div className="form-group">
            <label>Consultation Fee (₹)</label>
            <input 
              type="number" 
              name="consultationFee" 
              value={formData.consultationFee} 
              onChange={handleChange} 
            />
          </div>

          <div className="form-buttons">
            <button type="submit" className="btn-submit">
              {editingId ? 'Update Doctor' : 'Add Doctor'}
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
              <th>Specialization</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Experience</th>
              <th>Fee</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {doctors.length === 0 ? (
              <tr>
                <td colSpan="7" className="no-data">No doctors found. Add your first doctor!</td>
              </tr>
            ) : (
              doctors.map((doctor) => (
                <tr key={doctor._id}>
                  <td>{doctor.name}</td>
                  <td>{doctor.specialization}</td>
                  <td>{doctor.phone}</td>
                  <td>{doctor.email || 'N/A'}</td>
                  <td>{doctor.experience ? `${doctor.experience} years` : 'N/A'}</td>
                  <td><strong>₹{doctor.consultationFee || '0'}</strong></td>
                  <td>
                    <button className="btn-edit" onClick={() => handleEdit(doctor)}>
                      Edit
                    </button>
                    <button className="btn-delete" onClick={() => handleDelete(doctor._id)}>
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

export default DoctorList;