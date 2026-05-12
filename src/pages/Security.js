import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './LandingPage.css';
import './Security.css';

function Security() {
  return (
    <div className="page security-page">
      <Navbar />

      <section className="page-banner">
        <div className="page-banner__eyebrow">Privacy &amp; Security</div>
        <h1 className="page-banner__title">How We Handle Your Data</h1>
        <p className="page-banner__sub">
          Clear, honest answers about what happens to your lease and your information.
        </p>
      </section>

      {/* Lead statement */}
      <section className="sec-lead">
        <div className="sec-lead__inner">
          <p className="sec-lead__text">
            Lease Lens is built around a simple principle: your lease belongs to you.
            We process your document to generate insights, and we do not retain the
            original file after your session ends. Below is a plain-language explanation
            of every step.
          </p>
        </div>
      </section>

      {/* Three-column quick facts */}
      <section className="sec-facts">
        <div className="sec-facts__inner">
          <div className="sec-fact">
            <div className="sec-fact__icon-wrap sec-fact__icon-wrap--blue">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>
            <h3 className="sec-fact__title">Your lease is never stored</h3>
            <p className="sec-fact__body">The PDF you upload is sent for analysis and discarded immediately after. We do not save, index, or retain your original lease document.</p>
          </div>

          <div className="sec-fact">
            <div className="sec-fact__icon-wrap sec-fact__icon-wrap--green">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 11 12 14 22 4"/>
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
              </svg>
            </div>
            <h3 className="sec-fact__title">Insights are yours to control</h3>
            <p className="sec-fact__body">The analysis results — summaries, key terms, risk flags — can optionally be saved to your account. You can delete them at any time, permanently.</p>
          </div>

          <div className="sec-fact">
            <div className="sec-fact__icon-wrap sec-fact__icon-wrap--slate">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </div>
            <h3 className="sec-fact__title">No advertising, no selling</h3>
            <p className="sec-fact__body">Your data is not used for advertising, shared with third parties, or sold. It exists only to serve your lease review.</p>
          </div>
        </div>
      </section>

      {/* Detailed sections */}
      <section className="sec-details">
        <div className="sec-details__inner">

          {/* Document handling */}
          <div className="sec-block">
            <div className="sec-block__label">Document Handling</div>
            <h2 className="sec-block__title">What happens to your lease file</h2>
            <div className="sec-block__body">
              <p>When you upload a PDF, it is transmitted over an encrypted connection and passed directly to the analysis service. The file is held in memory only for the duration of the analysis request — typically a few seconds — and is not written to any persistent storage on our servers.</p>
              <p>Once the analysis is complete, the file is discarded. We do not have a copy of your lease. If you close your browser or start a new session, the document is gone from our infrastructure entirely.</p>
            </div>
            <div className="sec-block__callout sec-block__callout--blue">
              <strong>In plain terms:</strong> we cannot retrieve your lease after your session ends because we never saved it.
            </div>
          </div>

          {/* AI and LLM */}
          <div className="sec-block">
            <div className="sec-block__label">AI &amp; Language Model</div>
            <h2 className="sec-block__title">How AI generates your insights</h2>
            <div className="sec-block__body">
              <p>Lease Lens uses Google Gemini, a large language model (LLM), to read and interpret your lease. The model receives the text of your document as input and returns structured analysis — summaries, key terms, risk flags, and plain-language explanations.</p>
              <p>The AI does not have memory between sessions and does not learn from or retain your lease content. Each analysis request is independent and stateless. The model is not fine-tuned on user documents; it applies general language understanding to your specific lease.</p>
              <p>Because this is an AI-generated analysis, the output is intended to help you understand your lease more clearly — it is not a substitute for legal advice. We recommend reviewing the original document and consulting a professional for any legally significant decisions.</p>
            </div>
            <div className="sec-block__callout sec-block__callout--yellow">
              <strong>Important:</strong> AI analysis may not catch every nuance in a complex legal document. Always read your lease in full before signing.
            </div>
          </div>

          {/* Saved insights */}
          <div className="sec-block">
            <div className="sec-block__label">Saved Insights</div>
            <h2 className="sec-block__title">What we store — and what we don't</h2>
            <div className="sec-block__body">
              <p>After analysis completes, you have the option to save the generated insights to your account. This includes the summaries, key terms, risk flags, and the top 10 items — the structured output of the analysis, not your lease file itself.</p>
              <p>Saved insights are associated with your account and are only accessible to you. They are stored so you can return to a previous analysis without re-uploading your lease.</p>
            </div>

            <div className="sec-comparison">
              <div className="sec-comparison__col sec-comparison__col--no">
                <div className="sec-comparison__header">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                  Never stored
                </div>
                <ul>
                  <li>Your original lease PDF</li>
                  <li>Your name or personal details from the lease</li>
                  <li>Landlord or property information</li>
                  <li>Any document not submitted for analysis</li>
                </ul>
              </div>
              <div className="sec-comparison__col sec-comparison__col--yes">
                <div className="sec-comparison__header">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Optionally stored (if you save)
                </div>
                <ul>
                  <li>AI-generated lease summary</li>
                  <li>Key terms and plain-language explanations</li>
                  <li>Risk flags and clause summaries</li>
                  <li>Date and filename of the analysis</li>
                </ul>
              </div>
            </div>

            <div className="sec-block__callout sec-block__callout--green">
              <strong>You can delete saved insights at any time</strong> from your account settings. Deletion is immediate and permanent — we do not retain backups of deleted insight records.
            </div>
          </div>

          {/* Account and auth */}
          <div className="sec-block">
            <div className="sec-block__label">Authentication</div>
            <h2 className="sec-block__title">Signing in with Google or Microsoft</h2>
            <div className="sec-block__body">
              <p>Lease Lens uses OAuth sign-in through Google or Microsoft. We do not store your password. The only account information we hold is your name, email address, and profile photo as provided by your identity provider — the minimum needed to identify your account and display your name in the interface.</p>
              <p>We do not have access to your Google Drive, email, calendar, or any other data beyond what is needed for authentication.</p>
            </div>
          </div>

        </div>
      </section>

      {/* Bottom CTA */}
      <section className="sec-cta">
        <div className="sec-cta__inner">
          <h2 className="sec-cta__title">Questions about privacy?</h2>
          <p className="sec-cta__sub">
            If you have concerns about how your data is handled, reach out or review our
            approach on the About page.
          </p>
          <div className="sec-cta__actions">
            <Link to="/upload" className="btn btn--green">
              Upload Your Lease &rarr;
            </Link>
            <Link to="/about" className="btn btn--outline">
              About Lease Lens
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}

export default Security;