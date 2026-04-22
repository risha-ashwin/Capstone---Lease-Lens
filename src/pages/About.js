import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './LandingPage.css';
import './About.css';

const researchFindings = [
  { icon: '⚖️', label: 'Interpreting legal terminology' },
  { icon: '💰', label: 'Identifying unclear or embedded fees' },
  { icon: '🤝', label: 'Understanding concessions & promotional terms' },
  { icon: '📌', label: 'Distinguishing standard from atypical obligations' },
];

const approachItems = [
  { icon: '📅', title: 'Lease Term & Rental Structure', body: 'Duration, renewal options, rent escalation clauses and payment schedules laid out simply.' },
  { icon: '💳', title: 'Financial Obligations', body: 'Security deposits, fees, utility responsibilities and any embedded costs clearly surfaced.' },
  { icon: '⚠️',  title: 'Tenant Responsibilities', body: 'Maintenance duties, guest policies, noise rules and other obligations highlighted.' },
  { icon: '🚪', title: 'Early Termination & Penalties', body: 'Exit conditions, notice periods and financial penalties explained in plain English.' },
  { icon: '📝', title: 'Non-Standard Clauses', body: 'Atypical provisions flagged so you know what falls outside common lease norms.' },
];

const stats = [
  { number: '100+', label: 'Students Surveyed' },
  { number: '3',    label: 'Analysis Modules' },
  { number: '10+',  label: 'Key Terms Surfaced' },
  { number: '∞',    label: 'Confusion Prevented' },
];

function About() {
  return (
    <div className="about-page">
      <Navbar />

      <section className="page-banner">
        <div className="page-banner__eyebrow">About</div>
        <h1 className="page-banner__title">About Lease Lens</h1>
        <p className="page-banner__sub">Built for students. Grounded in research. Designed for clarity.</p>
      </section>

      <section className="about-intro">
        <div className="about-intro__inner">
          <div className="about-intro__text">
            <p>
              Lease Lens is a structured lease review platform designed to support informed
              decision-making prior to signing a residential lease agreement. Residential leases
              often contain complex terminology, layered financial provisions, and detailed contractual
              conditions that are hard to parse without experience.
            </p>
            <p>
              We provide organized, plain-language summaries intended to improve clarity and
              accessibility during the review process — so you sign with confidence, not confusion.
            </p>
          </div>
          <div className="about-intro__badge">
            <span className="about-intro__badge-icon">📋</span>
            <span className="about-intro__badge-text">Lease reviewing made simple.</span>
          </div>
        </div>
      </section>

      <section className="about-stats">
        {stats.map((s) => (
          <div className="about-stats__item" key={s.label}>
            <span className="about-stats__number">{s.number}</span>
            <span className="about-stats__label">{s.label}</span>
          </div>
        ))}
      </section>

      <section className="about-section about-section--alt">
        <div className="about-section__inner">
          <div className="about-section__header">
            <span className="about-section__tag">Research</span>
            <h2 className="about-section__title">Built on Research</h2>
          </div>
          <p className="about-section__lead">
            Lease Lens was informed by interviews and survey research conducted with University of
            Washington students. Participants consistently identified challenges in:
          </p>
          <div className="research-grid">
            {researchFindings.map((f) => (
              <div className="research-card" key={f.label}>
                <span className="research-card__icon">{f.icon}</span>
                <span className="research-card__label">{f.label}</span>
              </div>
            ))}
          </div>
          <p className="about-section__footer-note">
            These findings shaped a platform focused on <strong>transparency, organization, and readability.</strong>
          </p>
        </div>
      </section>

      <section className="about-section">
        <div className="about-section__inner">
          <div className="about-section__header">
            <span className="about-section__tag">Approach</span>
            <h2 className="about-section__title">Our Approach</h2>
          </div>
          <p className="about-section__lead">
            Lease Lens analyzes residential lease agreements and organizes key provisions into
            clearly defined sections so nothing catches you off-guard:
          </p>
          <div className="approach-list">
            {approachItems.map((item, i) => (
              <div className="approach-item" key={item.title} style={{ animationDelay: `${i * 0.08}s` }}>
                <div className="approach-item__icon">{item.icon}</div>
                <div className="approach-item__content">
                  <h3 className="approach-item__title">{item.title}</h3>
                  <p className="approach-item__body">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA — now routes to /login */}
      <section className="about-cta">
        <div className="about-cta__inner">
          <h2 className="about-cta__title">Ready to review your lease?</h2>
          <p className="about-cta__sub">Upload your PDF and get a plain-language breakdown in minutes.</p>
          <Link to="/login" className="btn btn--green about-cta__btn">
            Get Started Free →
          </Link>
        </div>
      </section>
    </div>
  );
}

export default About;