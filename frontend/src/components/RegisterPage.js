// --- START OF FILE frontend/src/components/RegisterPage.js ---

import React, { useState } from 'react'; // <-- 1. THIS IS THE CORRECT IMPORT
import { Link } from 'react-router-dom';
import axios from 'axios';
import './LoginPage.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function RegisterPage() {
  // 2. The typo was here. I incorrectly had "useState" in quotes. This is now correct.
  const [username, setUsername] = useState(''); 
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await axios.post(`${API_URL}/auth/register`, { username, password });
      setSuccess('Registration successful! You can now log in.');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleRegister}>
        <h2>Create an Account</h2>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
        <div className="form-group">
          <label>Username</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Confirm Password</label>
          <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
        </div>
        <button type="submit" className="btn-submit">Register</button>
        <p className="switch-form-text">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </form>
    </div>
  );
}

export default RegisterPage;