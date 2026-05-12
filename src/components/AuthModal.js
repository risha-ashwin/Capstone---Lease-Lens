import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth, googleProvider, microsoftProvider } from '../firebase';
import './AuthModal.css';

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

function MicrosoftIcon() {
  return (
    <svg viewBox="0 0 23 23" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
      <path fill="#f3f3f3" d="M0 0h23v23H0z"/>
      <path fill="#f35325" d="M1 1h10v10H1z"/>
      <path fill="#81bc06" d="M12 1h10v10H12z"/>
      <path fill="#05a6f0" d="M1 12h10v10H1z"/>
      <path fill="#ffba08" d="M12 12h10v10H12z"/>
    </svg>
  );
}

/* AuthModal */
export function AuthModal({ onClose }) {
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const handleSignIn = async (provider, providerName) => {
    setLoading(providerName);
    setError('');
    try {
      await signInWithPopup(auth, provider);
      onClose();
    } catch (err) {
      if (err.code !== 'auth/popup-closed-by-user') {
        setError('Sign-in failed. Please try again.');
        console.error(err);
      }
    } finally {
      setLoading(null);
    }
  };

  return (
    <div
      className="auth-overlay"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div className="auth-modal">
        <div className="auth-modal__header">
          <button className="auth-modal__close" onClick={onClose} aria-label="Close">✕</button>
          <div className="auth-modal__logo">
            <span className="auth-modal__logo-icon">📋</span>
            <span className="auth-modal__logo-name">Lease Lens</span>
          </div>
          <h2 className="auth-modal__title" id="auth-modal-title">Sign In to Lease Lens</h2>
          <p className="auth-modal__sub">Review your lease with confidence — free to get started.</p>
        </div>

        <div className="auth-modal__body">
          {error && (
            <div className="auth-error" role="alert">
              <span>⚠</span> {error}
            </div>
          )}

          <button
            className="auth-oauth-btn"
            onClick={() => handleSignIn(googleProvider, 'google')}
            disabled={!!loading}
          >
            <span className="auth-oauth-btn__icon">
              {loading === 'google' ? <div className="auth-spinner" /> : <GoogleIcon />}
            </span>
            <span className="auth-oauth-btn__text">
              {loading === 'google' ? 'Signing in…' : 'Continue with Google'}
            </span>
          </button>

          <div className="auth-divider">or</div>

          <button
            className="auth-oauth-btn"
            onClick={() => handleSignIn(microsoftProvider, 'microsoft')}
            disabled={!!loading}
          >
            <span className="auth-oauth-btn__icon">
              {loading === 'microsoft' ? <div className="auth-spinner" /> : <MicrosoftIcon />}
            </span>
            <span className="auth-oauth-btn__text">
              {loading === 'microsoft' ? 'Signing in…' : 'Continue with Microsoft (Outlook)'}
            </span>
          </button>
        </div>

        <div className="auth-modal__footer">
          By signing in you agree to our{' '}
          <Link to="/security" onClick={onClose}>Privacy Policy</Link>.
          Your documents are never stored or shared.
        </div>
      </div>
    </div>
  );
}

/* useAuth hook */
export function useAuth() {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsubscribe();
  }, []);

  const signOutUser = () => signOut(auth);

  return { user, signOutUser };
}

/* NavbarUserSection */
export function NavbarUserSection({ onOpenModal }) {
  const { user, signOutUser } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  if (user === undefined) return null;

  if (!user) {
    return (
      <button className="navbar__cta" onClick={onOpenModal}>
        Sign In
      </button>
    );
  }

  const initials = user.displayName
    ? user.displayName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : (user.email || '?')[0].toUpperCase();

  return (
    <div
      className="navbar__user"
      ref={dropdownRef}
      onClick={() => setDropdownOpen(!dropdownOpen)}
    >
      {user.photoURL ? (
        <img
          src={user.photoURL}
          alt={user.displayName || 'User'}
          className="navbar__avatar"
          referrerPolicy="no-referrer"
        />
      ) : (
        <div className="navbar__avatar-fallback">{initials}</div>
      )}
      <span className="navbar__user-name">
        {user.displayName?.split(' ')[0] || 'Account'}
      </span>

      {dropdownOpen && (
        <div className="navbar__user-dropdown">
          <div className="navbar__user-dropdown-info">
            <div className="navbar__user-dropdown-name">{user.displayName || 'User'}</div>
            <div className="navbar__user-dropdown-email">{user.email}</div>
          </div>
          <button
            className="navbar__user-dropdown-btn"
            onClick={(e) => { e.stopPropagation(); signOutUser(); setDropdownOpen(false); }}
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}

export default AuthModal;