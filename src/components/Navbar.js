import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

function Navbar({ ctaLabel = 'Get Started', ctaHref = '/how-it-works' }) {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { label: 'How It Works', to: '/how-it-works' },
    { label: 'Security', to: '/security' },
    { label: 'About', to: '/about' },
    { label: 'Log In', to: '#login' },
    { label: 'Upload', to: '#upload' },
  ];

  return (
    <nav className="navbar">
      <div className="navbar__inner">
        {/* Logo */}
        <Link to="/" className="navbar__logo">
          <span className="navbar__logo-icon">📋</span>
          <div className="navbar__logo-text">
            <span className="navbar__logo-name">Lease Lens</span>
            <span className="navbar__logo-tagline">Lease reviewing made simple.</span>
          </div>
        </Link>

        {/* Nav links pill */}
        <div className={`navbar__links-pill ${menuOpen ? 'open' : ''}`}>
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className={`navbar__link ${location.pathname === link.to ? 'active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* CTA Button */}
        <Link to={ctaHref} className="navbar__cta">
          {ctaLabel}
        </Link>

        {/* Hamburger */}
        <button className="navbar__hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          <span /><span /><span />
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
