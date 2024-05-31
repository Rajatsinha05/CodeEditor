// Navbar.js
import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import '../CSS/Navbar.css';

const Navbar = ({ isLoggedIn }) => {
  return (
    <nav className="navbar">
      <ul className="navbar-nav">
        <li className="nav-item">
          <NavLink exact to="/" className="nav-link" activeClassName="active">Home</NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/problems" className="nav-link" activeClassName="active">Problems</NavLink>
        </li>
        {isLoggedIn ? (
          <li className="nav-item">
            <NavLink to="/profile" className="nav-link" activeClassName="active">Profile</NavLink>
          </li>
        ) : (
          <>
            <li className="nav-item">
              <NavLink to="/login" className="nav-link" activeClassName="active">Login</NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/signup" className="nav-link" activeClassName="active">Signup</NavLink>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
