import React from 'react';
import { Link } from 'react-router-dom';
import { LeaseLensLogo } from './LeaseLensLogo';
import './Footer.css';

const scrollTop = () => window.scrollTo({ top: 0, behavior: 'instant' });

const scrollToHowItWorks = (e) => {
  e.preventDefault();
  const el = document.getElementById('how-it-works');
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
  } else {
    window.location.href = window.location.origin + '/Capstone---Lease-Lens/#how-it-works';
  }
};

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__inner">

        {/* Brand col */}
        <div className="footer__brand">
          <Link to="/" className="footer__logo" onClick={scrollTop}>
            <LeaseLensLogo size={32} color="brand" />
            <span className="footer__logo-name">Lease Lens</span>
          </Link>
          <p className="footer__tagline">
            Lease reviewing made simple.<br />
            Built for students and first-time renters.
          </p>
        </div>

        {/* Product links */}
        <div className="footer__col">
          <h4 className="footer__col-heading">Product</h4>
          <ul className="footer__links">
            <li><Link to="/upload"  className="footer__link" onClick={scrollTop}>Upload</Link></li>
            <li><Link to="/history" className="footer__link" onClick={scrollTop}>My Leases</Link></li>
            <li><a href="#how-it-works" className="footer__link" onClick={scrollToHowItWorks}>How It Works</a></li>
          </ul>
        </div>

        {/* Company links */}
        <div className="footer__col">
          <h4 className="footer__col-heading">Company</h4>
          <ul className="footer__links">
            <li><Link to="/about"    className="footer__link" onClick={scrollTop}>About</Link></li>
            <li><Link to="/security" className="footer__link" onClick={scrollTop}>Privacy</Link></li>
          </ul>
        </div>

        {/* Support links */}
        <div className="footer__col">
          <h4 className="footer__col-heading">Support</h4>
          <ul className="footer__links">
            <li>
              <a href="mailto:leaselenssupport@gmail.com" className="footer__link">
                Contact Us
              </a>
            </li>
          </ul>
        </div>

        {/* Tagline card */}
        <div className="footer__card">
          <div className="footer__card-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
              <path d="M6 12v5c3 3 9 3 12 0v-5"/>
            </svg>
          </div>
          <div>
            <p className="footer__card-title">Built for students.</p>
            <p className="footer__card-sub">Empowering smarter lease decisions, one review at a time.</p>
          </div>
        </div>

      </div>

      {/* Bottom bar */}
      <div className="footer__bottom">
        <div className="footer__bottom-inner">
          <span className="footer__copy">&copy; {year} Lease Lens. All rights reserved.</span>
          <span className="footer__copy">Not legal advice &mdash; for informational purposes only.</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;