import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './LandingPage.css';
import './About.css';

const researchFindings = [
  {
    title: 'Leases are difficult to read',
    body: 'Length, dense paragraphs, and legal language make leases hard to get through — important details get buried and overlooked.',
  },
  {
    title: 'Students lack legal context',
    body: 'First-time renters have no baseline for what is normal vs. atypical in a lease, making it hard to know what should concern them.',
  },
  {
    title: 'Fees are easy to miss',
    body: 'Damage waivers, parking add-ons, concession cancellation clauses, and utility charges are consistently missed on a first read.',
  },
  {
    title: 'Existing tools are not student-friendly',
    body: 'Enterprise contract review platforms are too complex. Manual reading or paying for legal help is slow, costly, or unreliable.',
  },
];

const approachItems = [
  {
    label: '01',
    title: 'Lease Term & Rental Structure',
    body: 'Duration, renewal options, rent escalation clauses, and payment schedules presented clearly so you understand exactly what you are committing to.',
  },
  {
    label: '02',
    title: 'Financial Obligations',
    body: 'Security deposits, fees, utility responsibilities, and embedded costs surfaced and explained — including charges that are easy to miss on a first read.',
  },
  {
    label: '03',
    title: 'Tenant Responsibilities',
    body: 'Maintenance duties, guest policies, noise rules, and other obligations highlighted so you know what is expected of you throughout the tenancy.',
  },
  {
    label: '04',
    title: 'Early Termination & Penalties',
    body: 'Exit conditions, notice periods, and financial penalties explained in plain language so you understand the cost of leaving before the lease ends.',
  },
  {
    label: '05',
    title: 'Non-Standard Clauses',
    body: 'Atypical provisions flagged and explained so you know when something falls outside common lease norms and may warrant closer attention.',
  },
];

function About() {
  return (
    <div className="page about-page">
      <Navbar />

      {/* Hero */}
      <section className="abt-hero">
        <div className="abt-hero__bg" aria-hidden="true" />
        <div className="abt-hero__inner">
          <div className="abt-hero__copy">
            <div className="abt-hero__eyebrow">About Lease Lens</div>
            <h1 className="abt-hero__title">
              We built this because leases are confusing<span className="abt-hero__title-dot">.</span>
            </h1>
            <p className="abt-hero__sub">
              Residential leases are written by lawyers, for landlords. Lease Lens
              translates them for the person who actually has to sign — so you know
              what you are agreeing to before you put pen to paper.
            </p>
            <div className="abt-hero__actions">
              <Link to="/login" className="btn btn--green btn--lg">Get Started &rarr;</Link>
              <Link to="/how-it-works" className="btn btn--outline btn--lg">See How It Works</Link>
            </div>
          </div>
          <div className="abt-hero__stats" aria-label="Key numbers">
            <div className="abt-hero__stat">
              <span className="abt-hero__stat-num">44M+</span>
              <span className="abt-hero__stat-label">US renter households</span>
            </div>
            <div className="abt-hero__stat">
              <span className="abt-hero__stat-num">19M+</span>
              <span className="abt-hero__stat-label">Enrolled US students</span>
            </div>
            <div className="abt-hero__stat">
              <span className="abt-hero__stat-num">5</span>
              <span className="abt-hero__stat-label">Analysis sections</span>
            </div>
            <div className="abt-hero__stat">
              <span className="abt-hero__stat-num">UW</span>
              <span className="abt-hero__stat-label">Research foundation</span>
            </div>
          </div>
        </div>
      </section>

      {/* Mission strip */}
      <section className="abt-mission">
        <div className="abt-mission__inner">
          <div className="abt-mission__pill">Our mission</div>
          <p className="abt-mission__text">
            Make every renter — especially first-time student renters — capable of understanding
            the lease they sign, without needing a law degree or an expensive consultation.
          </p>
        </div>
      </section>

      {/* Research */}
      <section className="abt-section">
        <div className="abt-section__inner">
          <div className="abt-section__header">
            <div className="abt-section__label">Research</div>
            <h2 className="abt-section__title">Designed around real problems</h2>
            <p className="abt-section__lead">
              Lease Lens was built on research and interviews with University of Washington
              students. Four consistent pain points shaped what we built.
            </p>
          </div>

          <div className="abt-research-grid">
            {researchFindings.map((f, i) => (
              <div className="abt-research-card" key={i}>
                <div className="abt-research-card__accent" />
                <div className="abt-research-card__inner">
                  <div className="abt-research-card__num">0{i + 1}</div>
                  <h3 className="abt-research-card__title">{f.title}</h3>
                  <p className="abt-research-card__body">{f.body}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="abt-callout abt-callout--green">
            These findings shaped a platform focused on <strong>transparency, organization,
            and readability</strong> — not just summarization.
          </div>
        </div>
      </section>

      {/* Approach */}
      <section className="abt-section abt-section--alt">
        <div className="abt-section__inner">
          <div className="abt-section__header">
            <div className="abt-section__label">Approach</div>
            <h2 className="abt-section__title">Five sections. Nothing hidden.</h2>
            <p className="abt-section__lead">
              Every analysis is organized into the same five sections so you always know
              where to look and nothing catches you off-guard.
            </p>
          </div>

          <div className="abt-approach-list">
            {approachItems.map((item) => (
              <div className="abt-approach-item" key={item.label}>
                <div className="abt-approach-item__num">{item.label}</div>
                <div className="abt-approach-item__content">
                  <h3 className="abt-approach-item__title">{item.title}</h3>
                  <p className="abt-approach-item__body">{item.body}</p>
                </div>
                <svg className="abt-approach-item__arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"/>
                  <polyline points="12 5 19 12 12 19"/>
                </svg>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The project */}
      <section className="abt-section">
        <div className="abt-section__inner abt-section__inner--two-col">
          <div className="abt-project__copy">
            <div className="abt-section__label">The Project</div>
            <h2 className="abt-section__title">A University of Washington capstone</h2>
            <div className="abt-prose">
              <p>
                Lease Lens was developed as a capstone project at the University of Washington,
                applying AI and semantic modeling to a real problem students face every year —
                signing leases they do not fully understand.
              </p>
              <p>
                A free account is required to upload and analyze a lease. This lets us associate
                saved analysis results with your account so you can return to them later without
                re-uploading your document.
              </p>
            </div>
            <div className="abt-callout abt-callout--blue">
              <strong>Not legal advice.</strong> Lease Lens helps you understand your lease
              more clearly. For questions about your specific legal rights, consult a
              licensed attorney.
            </div>
          </div>
          <div className="abt-project__card">
            <div className="abt-project__card-label">Built at</div>
            <div className="abt-project__card-school">University of Washington</div>
            <div className="abt-project__card-divider" />
            <div className="abt-project__card-row">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 11 12 14 22 4"/>
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
              </svg>
              Google Gemini AI analysis
            </div>
            <div className="abt-project__card-row">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 11 12 14 22 4"/>
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
              </svg>
              Research-grounded design
            </div>
            <div className="abt-project__card-row">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 11 12 14 22 4"/>
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
              </svg>
              Built for student renters
            </div>
            <div className="abt-project__card-row">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 11 12 14 22 4"/>
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
              </svg>
              Free with an account
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="abt-cta">
        <div className="abt-cta__inner">
          <div className="abt-cta__eyebrow">Ready?</div>
          <h2 className="abt-cta__title">Stop guessing. Start understanding.</h2>
          <p className="abt-cta__sub">
            Sign in to upload your lease and get a plain-language breakdown in minutes.
          </p>
          <div className="abt-cta__actions">
            <Link to="/login" className="btn btn--green btn--lg">Upload Your Lease &rarr;</Link>
            <Link to="/security" className="btn btn--outline btn--lg">Privacy &amp; Security</Link>
          </div>
        </div>
      </section>

    </div>
  );
}

export default About;