import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthModal, NavbarUserSection } from './AuthModal';
import './Navbar.css';

function Navbar() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);

  const navLinks = [
    { label: 'How It Works', to: '/how-it-works' },
    { label: 'Security',     to: '/security'     },
    { label: 'About',        to: '/about'        },
    { label: 'Upload',       to: '/upload'       },
  ];

  return (
    <>
      <nav className="navbar">
        <div className="navbar__inner">

          <Link to="/" className="navbar__logo">
            <svg className="navbar__logo-icon" width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
              <rect x="1" y="1" width="14" height="18" rx="2" stroke="white" strokeOpacity="0.9" strokeWidth="1.4" fill="none"/>
              <path d="M8 1v5h7" stroke="white" strokeOpacity="0.5" strokeWidth="1.2" fill="none" strokeLinejoin="round"/>
              <rect x="4" y="9"  width="5"  height="1.2" rx="0.6" fill="white" fillOpacity="0.6"/>
              <rect x="4" y="12" width="7"  height="1.2" rx="0.6" fill="white" fillOpacity="0.4"/>
              <rect x="4" y="15" width="4"  height="1.2" rx="0.6" fill="white" fillOpacity="0.3"/>
              <circle cx="16.5" cy="16.5" r="4.8" fill="#2d60e8" stroke="white" strokeOpacity="0.85" strokeWidth="1.2"/>
              <circle cx="16.5" cy="16.5" r="2.6" stroke="#7aed9f" strokeWidth="1.3" fill="none"/>
              <line x1="18.4" y1="18.4" x2="20.2" y2="20.2" stroke="#7aed9f" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span className="navbar__logo-name">
              Lease<span className="navbar__logo-accent">Lens</span>
            </span>
          </Link>

          <div className={`navbar__links ${menuOpen ? 'open' : ''}`}>
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

          <div className="navbar__right">
            <NavbarUserSection onOpenModal={() => setAuthOpen(true)} />
          </div>

          <button
            className="navbar__hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <span />
            <span />
            <span />
          </button>

        </div>
      </nav>

      {authOpen && <AuthModal onClose={() => setAuthOpen(false)} />}
    </>
  );
}

export default Navbar;