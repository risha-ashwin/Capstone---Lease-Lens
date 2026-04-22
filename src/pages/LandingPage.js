import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './LandingPage.css';

function LeaseDocIllustration() {
  return (
    <div className="lease-doc-wrap">
      {/* Back doc */}
      <div className="lease-doc lease-doc--back">
        <div className="lease-doc__header">
          <div className="lease-doc__stamp">LEASE</div>
        </div>
        {[90,75,85,60,80,70].map((w,i) => (
          <div key={i} className="lease-doc__line" style={{width:`${w}%`}} />
        ))}
        <div className="lease-doc__section-label" />
        {[65,80,55,75].map((w,i) => (
          <div key={i} className="lease-doc__line" style={{width:`${w}%`}} />
        ))}
        <div className="lease-doc__sig-row">
          <div className="lease-doc__sig" />
          <div className="lease-doc__date" />
        </div>
      </div>

      {/* Front doc — highlighted / reviewed */}
      <div className="lease-doc lease-doc--front">
        <div className="lease-doc__header">
          <div className="lease-doc__stamp lease-doc__stamp--reviewed">✓ REVIEWED</div>
        </div>

        {/* Highlighted clause */}
        <div className="lease-doc__clause">
          <div className="lease-doc__clause-label">Monthly Rent</div>
          <div className="lease-doc__clause-value">$1,450 / mo</div>
        </div>

        {[70,55,80].map((w,i) => (
          <div key={i} className="lease-doc__line" style={{width:`${w}%`}} />
        ))}

        {/* Highlighted clause */}
        <div className="lease-doc__clause lease-doc__clause--warn">
          <div className="lease-doc__clause-label">⚠ Early Termination</div>
          <div className="lease-doc__clause-value">2 months rent penalty</div>
        </div>

        {[65,75,50].map((w,i) => (
          <div key={i} className="lease-doc__line" style={{width:`${w}%`}} />
        ))}

        <div className="lease-doc__clause">
          <div className="lease-doc__clause-label">Lease Duration</div>
          <div className="lease-doc__clause-value">12 months</div>
        </div>

        <div className="lease-doc__sig-row">
          <div className="lease-doc__sig" />
          <div className="lease-doc__date" />
        </div>
      </div>

      {/* Floating badge */}
      <div className="lease-badge">
        <span className="lease-badge__icon">🤖</span>
        <div>
          <div className="lease-badge__title">AI Analysis Complete</div>
          <div className="lease-badge__sub">3 key terms flagged</div>
        </div>
      </div>
    </div>
  );
}

function TrustPill({ icon, text }) {
  return (
    <div className="trust-pill">
      <span>{icon}</span>
      <span>{text}</span>
    </div>
  );
}

function LandingPage() {
  const heroRef = useRef(null);
  useEffect(() => {
    heroRef.current?.classList.add('animate-in');
  }, []);

  return (
    <div className="page">
      <Navbar />

      {/* ── Full-bleed hero ── */}
      <section className="hero" ref={heroRef}>
        <div className="hero__bg-dots" aria-hidden="true" />
        <div className="hero__inner">

          {/* Left: copy */}
          <div className="hero__copy">
            <div className="hero__eyebrow">Lease reviewing made simple</div>
            <h1 className="hero__title">
              Understand the Terms<br />
              <span className="hero__title-accent">Before You Sign.</span>
            </h1>
            <p className="hero__subtitle">
              We turn complex legal jargon into clear, digestible insights — so you
              can sign your student lease with confidence, not confusion.
            </p>

            <div className="hero__actions">
              <Link to="/how-it-works" className="btn btn--green btn--lg">
                See How It Works →
              </Link>
              <Link to="/upload" className="btn btn--outline btn--lg">
                Upload Your Lease
              </Link>
            </div>

            <div className="hero__trust">
              <TrustPill icon="🛡️" text="Legal-grade security" />
              <TrustPill icon="⚡" text="Results in seconds" />
              <TrustPill icon="🎓" text="Built for students" />
            </div>
          </div>

          {/* Right: illustration */}
          <div className="hero__visual">
            <LeaseDocIllustration />
          </div>
        </div>
      </section>

      {/* ── How it works mini-strip ── */}
      <section className="mini-strip">
        <div className="mini-strip__inner">
          {[
            { n:'01', label:'Upload your lease PDF' },
            { n:'02', label:'AI reviews every clause' },
            { n:'03', label:'Get a plain-English summary' },
          ].map((s, i) => (
            <React.Fragment key={s.n}>
              <div className="mini-step">
                <span className="mini-step__num">{s.n}</span>
                <span className="mini-step__label">{s.label}</span>
              </div>
              {i < 2 && <div className="mini-step__arrow">→</div>}
            </React.Fragment>
          ))}
        </div>
      </section>
    </div>
  );
}

export default LandingPage;