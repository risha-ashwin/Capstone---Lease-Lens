import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './LandingPage.css';

const features = [
  {
    icon: '📋',
    title: 'Lease Overview',
    body: 'A full overview of your lease highlighting all standard information — parties, address, term, and rent structure.',
    delay: '0.05s',
  },
  {
    icon: '🔑',
    title: 'Key Terms Summary',
    body: 'The top 10 terms, conditions, clauses, and numbers you absolutely need to know before putting pen to paper.',
    delay: '0.17s',
  },
  {
    icon: '💬',
    title: 'Plain-Language Clause Breakdown',
    body: 'Every clause rewritten in plain English — no legal degree required to understand what you\'re agreeing to.',
    delay: '0.29s',
  },
];

function WhatYoullSee() {
  return (
    <div className="page">
      <Navbar />
      <section className="page-banner">
        <div className="page-banner__eyebrow">Your Results</div>
        <h1 className="page-banner__title">What You Will See</h1>
        <p className="page-banner__sub">No more confusion, no more sneaky fine print fees.</p>
      </section>

      <section className="content-section">
        <div className="content-section__inner">
          <div className="cards-grid">
            {features.map((feat) => (
              <div className="card" key={feat.title} style={{ animationDelay: feat.delay }}>
                <div className="card__icon">{feat.icon}</div>
                <h2 className="card__title">{feat.title}</h2>
                <p className="card__body">{feat.body}</p>
              </div>
            ))}
          </div>
          <div className="page-nav">
            <Link to="/about" className="btn btn--blue">
              Security & Privacy →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default WhatYoullSee;