import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { setToken } from '../utils/auth';

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/login', { email, password });
      const { token, userId } = res.data;
      setToken(token);
      localStorage.setItem('userId', userId);
      navigate('/');
    } catch (err) {
      console.error(err);
      alert('Login failed. Check console for details.');
    }
  };

  const handleGoogleLogin = () => {
    // Your backend route for Google OAuth
    window.location.href = 'http://localhost:5000/api/auth/google';
  };

  return (
    <div className="container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
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
        <button style={{ marginTop: '1rem' }} type="submit">Login</button>
      </form>
      <hr />
      <button onClick={handleGoogleLogin}>Sign in with Google</button>
    </div>
  );
};

export default Login;
