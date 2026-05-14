import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './LandingPage.css';

/* Scroll fade-up */
function FadeUp({ children, delay = 0, className = '' }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add('fu-on'); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className={`fu ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

/* Document illustration */
function DocIllustration() {
  return (
    <div className="doc-illus" aria-hidden="true">
      {/* Back blurred doc */}
      <div className="doc-illus__back">
        <div className="doc-illus__back-stamp">LEASE AGREEMENT</div>
        {[88,72,80,60,75,65,82,55,70,48].map((w,i)=>(
          <div key={i} className="doc-illus__line" style={{width:`${w}%`}}/>
        ))}
      </div>

      {/* Front reviewed doc */}
      <div className="doc-illus__front">
        <div className="doc-illus__stamp-reviewed">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          REVIEWED
        </div>

        <div className="doc-illus__clause doc-illus__clause--gold">
          <div className="doc-illus__clause-lbl">MONTHLY RENT</div>
          <div className="doc-illus__clause-val">$1,450 / mo</div>
        </div>
        {[72,54].map((w,i)=><div key={i} className="doc-illus__line" style={{width:`${w}%`}}/>)}

        <div className="doc-illus__clause doc-illus__clause--red">
          <div className="doc-illus__clause-lbl">
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            EARLY TERMINATION
          </div>
          <div className="doc-illus__clause-val">2 months rent penalty</div>
        </div>
        {[66,76,52].map((w,i)=><div key={i} className="doc-illus__line" style={{width:`${w}%`}}/>)}

        <div className="doc-illus__clause doc-illus__clause--gold">
          <div className="doc-illus__clause-lbl">LEASE DURATION</div>
          <div className="doc-illus__clause-val">12 months</div>
        </div>
        {[60,44].map((w,i)=><div key={i} className="doc-illus__line" style={{width:`${w}%`}}/>)}
      </div>

      {/* Floating analysis badge */}
      <div className="doc-illus__badge">
        <div className="doc-illus__badge-pulse"/>
        <div className="doc-illus__badge-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        </div>
        <div>
          <div className="doc-illus__badge-title">Analysis Complete</div>
          <div className="doc-illus__badge-sub">3 risk flags identified</div>
        </div>
      </div>

      {/* Floating risk pill */}
      <div className="doc-illus__risk-pill">
        <span className="doc-illus__risk-dot"/>
        Auto-renewal clause detected
      </div>
    </div>
  );
}

/* Steps */
const STEPS = [
  {
    num: '01', title: 'Upload your lease',
    body: 'Drop your PDF. Encrypted in transit, processed in memory — never stored on our servers.',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><polyline points="12 18 12 12"/><polyline points="9 15 12 12 15 15"/></svg>,
  },
  {
    num: '02', title: 'AI reads every clause',
    body: 'Google Gemini reads your entire lease and surfaces everything that matters — fees, risks, obligations.',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>,
  },
  {
    num: '03', title: 'Sign with confidence',
    body: 'Get a full plain-language dashboard — risk flags, key terms, clause summaries, and a downloadable PDF report.',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>,
  },
];

/* What you get */
const FEATURES = [
  { num:'01', tag:'Overview',         title:'The full picture, fast',         body:'Lease type, term, parties, and a plain-English TLDR surfaced immediately.' },
  { num:'02', tag:'Risk Flags',       title:'Nothing sneaks past you',        body:'High, medium, and low severity risks ranked and explained — before you sign.' },
  { num:'03', tag:'Key Terms',        title:'Every number that matters',      body:'Dates, fees, deposits, and penalties pulled out and explained clearly.' },
  { num:'04', tag:'Clause Summaries', title:'Plain English for every clause', body:"Each clause rewritten so you know what you're agreeing to and what it could cost." },
  { num:'05', tag:'Top 10',           title:'Ranked before you sign',         body:'The ten most critical facts about your specific lease, ordered by importance.' },
  { num:'06', tag:'PDF Report',       title:'Take it with you',               body:'Export a full formatted PDF report — cover page, risk summary, all sections.' },
];

export default function LandingPage() {
  const heroRef = useRef(null);
  useEffect(() => {
    const t = setTimeout(() => heroRef.current?.classList.add('hero-on'), 60);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="page lp">
      <Navbar />

      {/* HERO */}
      <section className="lp-hero" ref={heroRef}>
        <div className="lp-hero__noise" aria-hidden/>
        <div className="lp-hero__glow"  aria-hidden/>

        <div className="lp-hero__inner">
          <div className="lp-hero__copy">
            <div className="lp-hero__kicker">Lease reviewing made simple</div>
            <h1 className="lp-hero__h1">
              Understand the Terms<br/>
              <em className="lp-hero__em">Before You Sign.</em>
            </h1>
            <p className="lp-hero__sub">
              We turn complex legal jargon into clear, digestible insights —
              so you can sign your lease with confidence, not confusion.
            </p>
            <div className="lp-hero__btns">
              <Link to="/upload" className="lp-btn-green">
                Upload Your Lease
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </Link>
              <a href="#how-it-works" className="lp-btn-ghost">How It Works</a>
            </div>
            <div className="lp-hero__tags">
              <span className="lp-hero__tag"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>Legal-grade security</span>
              <span className="lp-hero__tag"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>Results in minutes</span>
              <span className="lp-hero__tag"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>Built for students</span>
            </div>
          </div>

          <div className="lp-hero__visual">
            <DocIllustration/>
          </div>
        </div>

        {/* process strip */}
        <div className="lp-strip">
          <div className="lp-strip__inner">
            {[
              {n:'01',l:'Upload your lease PDF'},
              {n:'02',l:'AI reviews every clause'},
              {n:'03',l:'Get a plain-English summary'},
            ].map((s,i)=>(
              <React.Fragment key={s.n}>
                <div className="lp-strip__step">
                  <span className="lp-strip__n">{s.n}</span>
                  <span className="lp-strip__l">{s.l}</span>
                </div>
                {i<2&&<svg className="lp-strip__arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="lp-how" id="how-it-works">
        <div className="lp-how__inner">
          <FadeUp className="lp-how__head">
            <span className="lp-tag-pill">How it works</span>
            <h2 className="lp-h2">Three steps. That's it.</h2>
            <p className="lp-lead">No setup required. Upload your lease and receive a full plain-language breakdown in minutes.</p>
          </FadeUp>
          <div className="lp-steps">
            {STEPS.map((s,i)=>(
              <FadeUp key={s.num} delay={i*110}>
                <div className="lp-step">
                  <div className="lp-step__top">
                    <div className="lp-step__icon">{s.icon}</div>
                    <span className="lp-step__num">{s.num}</span>
                  </div>
                  <h3 className="lp-step__title">{s.title}</h3>
                  <p className="lp-step__body">{s.body}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT YOU GET — white bg, visual two-col */}
      <section className="lp-what" id="features">
        <div className="lp-what__inner">
          <FadeUp className="lp-what__head">
            <span className="lp-tag-pill">What you get</span>
            <h2 className="lp-h2">Your lease, fully decoded.</h2>
            <p className="lp-lead">Every upload produces the same five sections — so you always know where to look and nothing catches you by surprise.</p>
          </FadeUp>

          <div className="lp-what__body">
            {/* Left — feature list */}
            <div className="lp-what__list">
              {FEATURES.map((f,i)=>(
                <FadeUp key={f.num} delay={i*70}>
                  <div className="lp-what-row">
                    <div className="lp-what-row__num">{f.num}</div>
                    <div className="lp-what-row__content">
                      <div className="lp-what-row__header">
                        <h3 className="lp-what-row__title">{f.title}</h3>
                        <span className="lp-what-row__tag">{f.tag}</span>
                      </div>
                      <p className="lp-what-row__body">{f.body}</p>
                    </div>
                  </div>
                </FadeUp>
              ))}
            </div>

            {/* Right — sample output visual */}
            <FadeUp className="lp-what__visual" delay={100}>
              <div className="lp-sample">
                <div className="lp-sample__header">
                  <span className="lp-sample__title">Sample Analysis</span>
                  <span className="lp-sample__lease">my-lease.pdf</span>
                </div>

                <div className="lp-sample__section">
                  <div className="lp-sample__section-label">Risk Flags</div>
                  <div className="lp-sample__risk lp-sample__risk--high">
                    <span className="lp-sample__risk-dot lp-sample__risk-dot--high"/>
                    <span className="lp-sample__risk-text">Concession forfeited if you leave early</span>
                    <span className="lp-sample__risk-badge lp-sample__risk-badge--high">HIGH</span>
                  </div>
                  <div className="lp-sample__risk lp-sample__risk--med">
                    <span className="lp-sample__risk-dot lp-sample__risk-dot--med"/>
                    <span className="lp-sample__risk-text">Late fees start after 5 days</span>
                    <span className="lp-sample__risk-badge lp-sample__risk-badge--med">MED</span>
                  </div>
                  <div className="lp-sample__risk lp-sample__risk--low">
                    <span className="lp-sample__risk-dot lp-sample__risk-dot--low"/>
                    <span className="lp-sample__risk-text">Tenant responsible for repairs under $100</span>
                    <span className="lp-sample__risk-badge lp-sample__risk-badge--low">LOW</span>
                  </div>
                </div>

                <div className="lp-sample__section">
                  <div className="lp-sample__section-label">Key Terms</div>
                  <div className="lp-sample__terms">
                    <div className="lp-sample__term">
                      <span className="lp-sample__term-k">Monthly rent</span>
                      <span className="lp-sample__term-v">$1,650</span>
                    </div>
                    <div className="lp-sample__term">
                      <span className="lp-sample__term-k">Lease term</span>
                      <span className="lp-sample__term-v">Sep 2025 – Aug 2026</span>
                    </div>
                    <div className="lp-sample__term">
                      <span className="lp-sample__term-k">Security deposit</span>
                      <span className="lp-sample__term-v">$1,650</span>
                    </div>
                    <div className="lp-sample__term">
                      <span className="lp-sample__term-k">Early termination</span>
                      <span className="lp-sample__term-v">6 months rent</span>
                    </div>
                  </div>
                </div>

                <div className="lp-sample__footer">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
                  Analysis complete · 5 sections · PDF ready
                </div>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* CTA — split layout with mini visual */}
      <section className="lp-cta">
        <div className="lp-cta__noise" aria-hidden/>
        <div className="lp-cta__arc1"  aria-hidden/>
        <div className="lp-cta__arc2"  aria-hidden/>
        <div className="lp-cta__inner">
          <FadeUp className="lp-cta__left">
            <span className="lp-cta__kicker">Ready?</span>
            <h2 className="lp-cta__h2">
              Stop guessing.<br/>
              <em className="lp-cta__em">Start understanding.</em>
            </h2>
            <p className="lp-cta__sub">Sign in free — takes 30 seconds. No credit card. No legal jargon.</p>
            <div className="lp-cta__btns">
              <Link to="/login" className="lp-btn-green lp-btn-green--lg">
                Get Started
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </Link>
              <Link to="/security" className="lp-btn-ghost">Privacy &amp; Security</Link>
            </div>
            <p className="lp-cta__note">Free &middot; Sign in required &middot; Not legal advice</p>
          </FadeUp>

          <FadeUp className="lp-cta__right" delay={150}>
            <div className="lp-cta-card">
              <div className="lp-cta-card__row">
                <div className="lp-cta-card__icon lp-cta-card__icon--green">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                </div>
                <div>
                  <div className="lp-cta-card__label">Never stored</div>
                  <div className="lp-cta-card__desc">Your lease is deleted after analysis</div>
                </div>
              </div>
              <div className="lp-cta-card__row">
                <div className="lp-cta-card__icon lp-cta-card__icon--blue">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                </div>
                <div>
                  <div className="lp-cta-card__label">Instant analysis</div>
                  <div className="lp-cta-card__desc">Full breakdown in minutes</div>
                </div>
              </div>
              <div className="lp-cta-card__row">
                <div className="lp-cta-card__icon lp-cta-card__icon--amber">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                </div>
                <div>
                  <div className="lp-cta-card__label">PDF report</div>
                  <div className="lp-cta-card__desc">Download and keep your results</div>
                </div>
              </div>
              <div className="lp-cta-card__row">
                <div className="lp-cta-card__icon lp-cta-card__icon--purple">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                </div>
                <div>
                  <div className="lp-cta-card__label">Free to use</div>
                  <div className="lp-cta-card__desc">Sign in with Google or Microsoft</div>
                </div>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

    </div>
  );
}