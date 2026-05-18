import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { loadAnalysisData } from '../utils/analysisStorage';
import './Analysis.css';

function RisksPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const analysisData = location.state?.analysisData || loadAnalysisData();
  const file = location.state?.file || null;
  const riskFlags = analysisData?.analysis?.risk_flags || [];

  if (!analysisData) {
    return (
      <div className="page">
        <Navbar />
        <section className="page-banner">
          <div className="page-banner__eyebrow">Risks</div>
          <h1 className="page-banner__title">Risk Flags</h1>
        </section>
        <section className="analysis-section">
          <div className="error-message">No lease analysis is available yet. Please upload a lease first.</div>
          <button className="btn btn--blue" onClick={() => navigate('/upload')}>
            Back to Upload
          </button>
        </section>
      </div>
    );
  }

  return (
    <div className="page">
      <Navbar />

      <section className="page-banner">
        <div className="page-banner__eyebrow">Drill Down</div>
        <h1 className="page-banner__title">Risk Flags</h1>
      </section>

      <section className="analysis-section">
        <div className="clauses-toolbar">
          <button
            type="button"
            className="dashboard-back-btn"
            onClick={() => navigate('/analysis', { state: { analysisData, file } })}
          >
            <span aria-hidden="true">&larr;</span>
            Back to dashboard
          </button>
          <p className="clauses-toolbar__copy">
            Review the full set of flagged lease risks and their severity.
          </p>
        </div>

        <div className="dashboard-panel">
          <div className="dash-panel__header">
            <h2 className="dash-panel__title">All Risk Flags</h2>
            <span className="dash-panel__badge">{riskFlags.length} flagged</span>
          </div>
          {riskFlags.length ? (
            <div className="risk-flag-list">
              {riskFlags.map((flag, index) => (
                <div key={`${flag.flag}-${index}`} className={`risk-flag-row risk-flag-row--${flag.severity}`}>
                  <span className={`risk-dot risk-dot--${flag.severity}`} />
                  <span className="risk-flag-row__text">{flag.flag}</span>
                  <span className={`risk-pill risk-pill--${flag.severity}`}>{flag.severity}</span>
                </div>
              ))}
            </div>
          ) : (
            <p>No risk flags were identified for this lease.</p>
          )}
        </div>
      </section>
    </div>
  );
}

export default RisksPage;
