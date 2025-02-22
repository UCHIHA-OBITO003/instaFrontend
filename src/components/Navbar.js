import React, { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { isAuthenticated, removeToken } from '../utils/auth';
import gsap from 'gsap';

const Navbar = () => {
  const navigate = useNavigate();
  const navRef = useRef(null);

  useEffect(() => {
    gsap.from(navRef.current, { y: -100, opacity: 0, duration: 1, ease: "power3.out" });
  }, []);

  const handleLogout = () => {
    removeToken();
    localStorage.removeItem('userId');
    navigate('/login');
  };

  return (
    <nav ref={navRef}>
      <Link to="/">Home</Link>
      <Link to="/explore">Explore</Link>
      <Link to="/search">Search</Link>
      {isAuthenticated() ? (
        <>
          <Link to={`/profile/${localStorage.getItem('userId')}`}>My Profile</Link>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </>
      )}
    </nav>
  );
};

export default Navbar;
