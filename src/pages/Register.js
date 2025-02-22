import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

const Register = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await API.post('/auth/register', { username, email, password });
      alert('Registration successful! You can log in now.');
      navigate('/login');
    } catch (err) {
      console.error(err);
      alert('Registration failed. Check console.');
    }
  };

  return (
    <div className="container">
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <div>
          <label>Username:</label><br />
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            type="text"
          />
        </div>
        <div style={{ marginTop: '1rem' }}>
          <label>Email:</label><br />
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            type="email"
          />
        </div>
        <div style={{ marginTop: '1rem' }}>
          <label>Password:</label><br />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            type="password"
          />
        </div>
        <button style={{ marginTop: '1rem' }} type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
