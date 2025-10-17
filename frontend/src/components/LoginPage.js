// --- START OF FILE frontend/src/components/LoginPage.js ---

import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // <-- 1. IMPORT THE LINK COMPONENT
import axios from 'axios';
import './LoginPage.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function LoginPage({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await axios.post(`${API_URL}/auth/login`, { username, password });
      localStorage.setItem('userInfo', JSON.stringify(data));
      onLoginSuccess();
    } catch (err) {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <h2>Admin Login</h2>
        {error && <p className="error-message">{error}</p>}
        <div className="form-group">
          <label>Username</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit" className="btn-submit">Login</button>

        {/* --- 2. ADD THIS LINK AT THE BOTTOM OF THE FORM --- */}
        <p className="switch-form-text">
          Don't have an account? <Link to="/register">Sign up here</Link>
        </p>
        {/* ---------------------------------------------------- */}
      </form>
    </div>
  );
}

export default LoginPage;