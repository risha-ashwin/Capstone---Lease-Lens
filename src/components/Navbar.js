import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthModal, NavbarUserSection, useAuth } from './AuthModal';
import { LeaseLensLogo } from './LeaseLensLogo';
import './Navbar.css';

function Navbar() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const { user } = useAuth();

  const publicLinks = [
    { label: 'Upload',  to: '/upload'   },
    { label: 'About',   to: '/about'    },
    { label: 'Privacy', to: '/security' },
  ];

  const privateLinks = [
    { label: 'Upload',    to: '/upload'   },
    { label: 'My Leases', to: '/history'  },
    { label: 'About',     to: '/about'    },
    { label: 'Privacy',   to: '/security' },
  ];

  const navLinks = user ? privateLinks : publicLinks;

  return (
    <>
      <nav className="navbar">
        <div className="navbar__inner">

          <Link to="/" className="navbar__logo">
            <LeaseLensLogo size={34} theme="white" />
            <div className="navbar__logo-text">
              <span className="navbar__logo-name">Lease Lens</span>
              <span className="navbar__logo-tagline">Lease reviewing made simple.</span>
            </div>
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
            <span /><span /><span />
          </button>

        </div>
      </nav>

      {authOpen && <AuthModal onClose={() => setAuthOpen(false)} />}
    </>
  );
}

export default Navbar;