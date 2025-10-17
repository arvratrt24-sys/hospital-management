import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import './App.css';

// --- Import all your external components ---
import PatientList from './components/PatientList';
import DoctorList from './components/DoctorList';
import AppointmentList from './components/AppointmentList';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import LandingPage from './components/LandingPage'; // Use the imported LandingPage

// --- Dashboard Home Component (for logged-in users) ---
// It's good practice to keep this separate or in its own file
function Home() {
  return (
    <div className="dashboard-home">
      <h2>Welcome to the Hospital Management System Dashboard</h2>
      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Patients</h3>
          <p>Manage patient records</p>
          <Link to="/patients" className="stat-link">View All →</Link>
        </div>
        <div className="stat-card">
          <h3>Doctors</h3>
          <p>Manage doctor profiles</p>
          <Link to="/doctors" className="stat-link">View All →</Link>
        </div>
        <div className="stat-card">
          <h3>Appointments</h3>
          <p>Schedule and manage appointments</p>
          <Link to="/appointments" className="stat-link">View All →</Link>
        </div>
      </div>
    </div>
  );
}


function App() {
  // --- STATE MANAGEMENT ---
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for user info in localStorage on initial component load
  useEffect(() => {
    try {
      const userInfo = localStorage.getItem('userInfo');
      if (userInfo) {
        setUser(JSON.parse(userInfo));
      }
    } catch (error) {
      console.error("Failed to parse user info from localStorage", error);
      // Clear corrupted data
      localStorage.removeItem('userInfo');
    }
    setLoading(false);
  }, []);

  // --- HANDLER FUNCTIONS ---
  const handleLoginSuccess = () => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
  };

  // Show a loading indicator while checking for user session
  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  // --- RENDER & ROUTING ---
  return (
    <Router>
      {user ? (
        // --- LOGGED-IN USER VIEW ---
        <div className="App">
          <nav className="navbar">
            <h1>🏥 Hospital Management System</h1>
            <div className="nav-container">
              <ul className="nav-links">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/patients">Patients</Link></li>
                <li><Link to="/doctors">Doctors</Link></li>
                <li><Link to="/appointments">Appointments</Link></li>
              </ul>
              <div className="auth-buttons">
                {/* Check if user.name exists before displaying it */}
                <span className="user-name">Hello, {user?.name || 'User'}</span>
                <button onClick={handleLogout} className="btn-logout">Logout</button>
              </div>
            </div>
          </nav>
          <main className="content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/patients" element={<PatientList />} />
              <Route path="/doctors" element={<DoctorList />} />
              <Route path="/appointments" element={<AppointmentList />} />
              {/* Redirect any unknown route back to the dashboard home */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
        </div>
      ) : (
        // --- PUBLIC (LOGGED-OUT) USER VIEW ---
        // This block is now clean and only contains the public routes.
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage onLoginSuccess={handleLoginSuccess} />} />
          <Route path="/register" element={<RegisterPage />} />
          {/* Redirect any unknown route back to the public landing page */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      )}
    </Router>
  );
}

export default App;