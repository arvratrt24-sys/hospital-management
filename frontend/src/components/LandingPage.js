import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

function LandingPage() {
  return (
    <div className="landing-page">
      {/* Top Navigation Bar */}
      <nav className="landing-nav">
        <div className="logo-section">
          <div className="logo">🏥</div>
          <h1>Hospital Management System</h1>
        </div>
        <div className="auth-links">
          <Link to="/login" className="auth-link login-link">Login</Link>
          <Link to="/register" className="auth-link register-link">Register</Link>
        </div>
      </nav>

      {/* Hero Section with Background */}
      <div className="landing-hero">
        <div className="hero-overlay">
          <div className="hero-content">
            <h1 className="hero-title">Welcome to Healthcare Excellence</h1>
            <p className="hero-description">
              Managing healthcare has never been easier. Our comprehensive hospital management 
              system streamlines patient care, doctor coordination, and appointment scheduling.
            </p>
            <div className="hero-buttons">
              <Link to="/register" className="hero-btn primary">Get Started</Link>
              <Link to="/login" className="hero-btn secondary">Sign In</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="landing-features">
        <h2>Why Choose Us?</h2>
        <div className="features-grid">
          <div className="feature-item">
            <div className="feature-icon">👥</div>
            <h3>Patient Management</h3>
            <p>Comprehensive patient records and medical history tracking</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon">👨‍⚕️</div>
            <h3>Doctor Profiles</h3>
            <p>Detailed doctor information and specialization management</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon">📅</div>
            <h3>Easy Scheduling</h3>
            <p>Seamless appointment booking and management system</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon">📊</div>
            <h3>Analytics</h3>
            <p>Insights and reports for better decision making</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="landing-footer">
        <p>&copy; 2024 Hospital Management System. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default LandingPage;