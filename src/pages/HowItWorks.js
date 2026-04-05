import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './LandingPage.css';
import './HowItWorks.css';

const steps = [
  {
    number: '01',
    icon: '☁️',
    title: 'Secure Upload',
    body: 'Upload your lease in PDF format. Your document is encrypted and never shared.',
    badge: { icon: '🛡️', text: 'Legal-grade privacy & security' },
  },
  {
    number: '02',
    icon: '🤖',
    title: 'AI-Powered Automated Review',
    body: 'Our AI reads every clause and identifies key financial terms, obligations, and conditions.',
  },
  {
    number: '03',
    icon: '📄',
    title: 'Clear Summary',
    body: 'Receive a concise overview and plain-language explanation of each clause.',
    badge: { icon: '⬇️', text: 'Download Overview' },
  },
];

function HowItWorks() {
  return (
    <div className="page">
      <Navbar />
      <section className="page-banner">
        <div className="page-banner__eyebrow">How It Works</div>
        <h1 className="page-banner__title">How LeaseLens Works</h1>
        <p className="page-banner__sub">Three simple steps: upload, analyze, understand.</p>
      </section>

      <section className="content-section">
        <div className="content-section__inner">
          <div className="steps-list">
            {steps.map((step, i) => (
              <React.Fragment key={step.title}>
                <div className="step-row" style={{ animationDelay: `${i * 0.15}s` }}>
                  <div className="step-row__left">
                    <div className="step-row__number">{step.number}</div>
                    <div className="step-row__icon">{step.icon}</div>
                  </div>
                  <div className="step-row__content">
                    <h2 className="step-row__title">{step.title}</h2>
                    <p className="step-row__body">{step.body}</p>
                    {step.badge && (
                      <div className="card__badge" style={{ justifyContent: 'flex-start', marginTop: '10px' }}>
                        <span className="card__badge-icon">{step.badge.icon}</span>
                        <span>{step.badge.text}</span>
                      </div>
                    )}
                  </div>
                </div>
                {i < steps.length - 1 && (
                  <div className="step-connector" aria-hidden="true">↓</div>
                )}
              </React.Fragment>
            ))}
          </div>
          <div className="page-nav">
            <Link to="/what-youll-see" className="btn btn--blue">
              What You Will See →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HowItWorks;