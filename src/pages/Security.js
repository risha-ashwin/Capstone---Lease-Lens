import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './LandingPage.css';
import './Security.css';

const securityHighlights = [
  {
    icon: '🛡️',
    title: 'Secure and Confidential',
    body: 'Lease Lens prioritizes document security and responsible data handling from upload through review.',
  },
  {
    icon: '🔐',
    title: 'Encrypted Processing',
    body: 'Uploaded lease agreements are encrypted during analysis to protect sensitive lease and tenant information.',
  },
  {
    icon: '⏱️',
    title: 'Session-Based Review',
    body: 'Documents are analyzed inside a secure session environment rather than being exposed to public access.',
  },
  {
    icon: '🗂️',
    title: 'No Permanent Storage',
    body: 'Lease files are not intended to remain permanently stored after processing is complete.',
  },
  {
    icon: '🤝',
    title: 'Privacy Commitment',
    body: 'The platform is designed around confidentiality, minimal retention, and clear boundaries for data use.',
  },
];

const assuranceItems = [
  'Private upload and analysis workflow',
  'Clear focus on confidentiality for lease review',
  'Temporary document handling during processing',
];

function Security() {
  return (
    <div className="page security-page">
      <Navbar />

      <section className="page-banner security-banner">
        <div className="page-banner__eyebrow">Security</div>
        <h1 className="page-banner__title security-banner__title">Secure Document Processing</h1>
      </section>

      <section className="security-intro">
        <div className="security-intro__inner">
          <p className="security-intro__text">
            Documents are encrypted during analysis and are not permanently stored. Lease Lens is
            designed with privacy and confidentiality in mind.
          </p>

          <div className="security-assurance">
            {assuranceItems.map((item) => (
              <div className="security-assurance__pill" key={item}>
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="security-grid-section">
        <div className="security-grid">
          {securityHighlights.map((item, index) => (
            <article
              className={`security-card ${index > 2 ? 'security-card--wide' : ''}`}
              key={item.title}
              style={{ animationDelay: `${0.08 + index * 0.1}s` }}
            >
              <div className="security-card__icon">{item.icon}</div>
              <h2 className="security-card__title">{item.title}</h2>
              <p className="security-card__body">{item.body}</p>
            </article>
          ))}
        </div>

        <div className="page-nav security-page__nav">
          <Link to="/about" className="btn btn--green">
            Learn More About Lease Lens →
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Security;
