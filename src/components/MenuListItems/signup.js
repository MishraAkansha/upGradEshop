import React, { useState } from 'react';
import './shipping.css'; // Make sure this file has appropriate styling
import { Link } from 'react-router-dom';
import axios from 'axios';
import LockIcon from '@mui/icons-material/Lock';

function SignupForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    contactNumber: '',
  });

  const [registrationStatus, setRegistrationStatus] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic form validation
    if (!formData.email || !formData.password || !formData.firstName || !formData.lastName || !formData.contactNumber) {
      setRegistrationStatus('All fields are required.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8080/api/auth/signup', {
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        contactNumber: formData.contactNumber,
        role: ['user'], // Assuming 'user' is the default role
      });

      if (response.status === 200) {
        setRegistrationStatus('Registration successful');
        // Clear form fields after successful registration
        setFormData({
          email: '',
          password: '',
          firstName: '',
          lastName: '',
          contactNumber: '',
        });
      } else {
        setRegistrationStatus('Registration failed');
      }
    } catch (error) {
      console.error('Error during registration:', error);
      setRegistrationStatus('An error occurred during registration.');
    }
  };

  return (
    <div className="signup-container">
      <LockIcon sx={{ color: '#e4007c' }}></LockIcon>
      <h1>Sign Up</h1>
      {registrationStatus && <p>{registrationStatus}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email *"
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password *"
            required
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="First Name *"
            required
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Last Name *"
            required
          />
        </div>
        <div className="form-group">
          <input
            type="tel"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleChange}
            placeholder="Contact Number *"
            required
          />
        </div>
        <button type="submit">SIGN UP</button>
      </form>
      <div className="signin-link">
        Already have an account? <Link to="/login">Sign In</Link>
      </div>
    </div>
  );
}

export default SignupForm;
