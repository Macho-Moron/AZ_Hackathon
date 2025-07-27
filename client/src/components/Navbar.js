import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; // We will create this file next

const Navbar = () => {
  return (
    <nav className="navbar">
      <Link to="/" className="nav-logo">Text-to-Learn</Link>
      <ul className="nav-links">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/create">Create Course</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;