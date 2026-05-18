import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './LandingPage.css';
import './About.css';

const researchFindings = [
  {
    title: 'Leases are written to protect landlords',
    body: 'Most residential leases are drafted by property management lawyers. The language is dense by design — burying obligations, fees, and penalties in ways that favor the landlord.',
  },
  {
    title: 'First-time renters have no baseline',
    body: 'Students signing their first lease have no way to know what\'s standard and what\'s unusual. Without context, everything looks equally normal — even clauses that aren\'t.',
  },
  {
    title: 'The most expensive details are the easiest to miss',
    body: 'Auto-renewal clauses, concession forfeitures, early termination penalties, and parking add-ons are consistently overlooked on a first read — and consistently costly.',
  },
  {
    title: 'Existing tools weren\'t built for this',
    body: 'Enterprise contract platforms are built for lawyers. Manual reading is slow and error-prone. Paying for legal help isn\'t realistic for most students signing a one-year lease.',
  },
];

const approachItems = [
  {
    label: '01',
    title: 'Lease Overview',
    why: 'Students didn\'t know what kind of lease they were signing.',
    body: 'We surface the lease type, parties, term, and a plain-English summary upfront — so you know the full shape of what you\'re agreeing to before you read a single clause.',
  },
  {
    label: '02',
    title: 'Risk Detection',
    why: 'Important clauses were buried and easy to sign without noticing.',
    body: 'We flag high, medium, and low severity risks explicitly — auto-renewals, penalty clauses, fee structures — ranked so you know exactly where to focus your attention.',
  },
  {
    label: '03',
    title: 'Key Terms',
    why: 'Critical numbers were scattered across 20+ pages.',
    body: 'We pull out every number that matters — rent, deposits, late fees, notice periods — and explain each one in plain language so nothing important stays buried.',
  },
  {
    label: '04',
    title: 'Clause Summaries',
    why: 'Legal language made people feel like they needed a lawyer to understand basic terms.',
    body: 'Every clause is rewritten in plain English with an explanation of why it matters — so you understand not just what it says, but what it means for you.',
  },
  {
    label: '05',
    title: 'Top 10 Things to Know',
    why: 'People didn\'t know what to prioritize — everything felt equally confusing.',
    body: 'We rank the ten most critical facts about your specific lease by importance — the things you need to understand before you sign, ordered so you can\'t miss them.',
  },
];

function About() {
  const navigate = useNavigate();

  const handleHowItWorks = (e) => {
    e.preventDefault();
    const el = document.getElementById('how-it-works');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/#how-it-works');
    }
  };

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
              <a href="/#how-it-works" className="btn btn--outline btn--lg" onClick={handleHowItWorks}>See How It Works</a>
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
              <span className="abt-hero__stat-num">100%</span>
              <span className="abt-hero__stat-label">Free to use</span>
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
            <div className="abt-section__label">What We Found</div>
            <h2 className="abt-section__title">The problems that shaped everything</h2>
            <p className="abt-section__lead">
              Before writing a line of code, we talked to students about their experiences
              signing leases. Four problems came up over and over.
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
            Each of these findings maps directly to a section of the Lease Lens dashboard —
            built to solve the specific moment of confusion it represents.
          </div>
        </div>
      </section>

      {/* Approach */}
      <section className="abt-section abt-section--alt">
        <div className="abt-section__inner">
          <div className="abt-section__header">
            <div className="abt-section__label">The Dashboard</div>
            <h2 className="abt-section__title">Designed around what people actually struggled with.</h2>
            <p className="abt-section__lead">
              Each section of the dashboard exists because of a specific pain point we
              heard repeatedly — not because it seemed like a useful feature.
            </p>

          <div className="abt-approach-list">
            {approachItems.map((item) => (
              <div className="abt-approach-item" key={item.label}>
                <div className="abt-approach-item__num">{item.label}</div>
                <div className="abt-approach-item__content">
                  <h3 className="abt-approach-item__title">{item.title}</h3>
                  <p className="abt-approach-item__why">{item.why}</p>
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