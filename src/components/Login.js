// frontend/src/components/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Container, Typography } from '@mui/material';

export default function Login() {
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/users/login', {
        email,
        password,
      });
      alert(res.data.message);

      // Save token to localStorage to authenticate future requests
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userId', res.data.userId);

      // Redirect or navigate to home
      window.location.href = '/';
    } catch (error) {
      alert(error.response.data.error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>Login</Typography>
      <form onSubmit={handleLogin}>
        <TextField
          label="Email"
          type="email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button variant="contained" color="primary" type="submit" sx={{ mt: 2 }}>
          Login
        </Button>
      </form>
    </Container>
  );
}
