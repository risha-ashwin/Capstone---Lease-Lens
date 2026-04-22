import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { AuthModal, useAuth } from '../components/AuthModal';
import './LandingPage.css';

function LoginPage() {
  const [authOpen, setAuthOpen] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  // If they log in, send them to upload
  useEffect(() => {
    if (user) navigate('/upload');
  }, [user, navigate]);

  return (
    <div className="page">
      <Navbar />
      <section className="page-banner">
        <div className="page-banner__eyebrow">Get Started</div>
        <h1 className="page-banner__title">Sign In to Continue</h1>
        <p className="page-banner__sub">Create a free account to upload and review your lease.</p>
      </section>

      {/* Auto-open the modal, and if closed show a button to reopen */}
      {authOpen && <AuthModal onClose={() => setAuthOpen(false)} />}

      {!authOpen && (
        <section className="content-section" style={{ textAlign: 'center' }}>
          <button
            className="btn btn--green btn--lg"
            onClick={() => setAuthOpen(true)}
          >
            Sign In →
          </button>
        </section>
      )}
    </div>
  );
}

export default LoginPage;