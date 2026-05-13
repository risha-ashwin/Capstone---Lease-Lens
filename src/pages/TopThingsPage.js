import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { loadAnalysisData } from '../utils/analysisStorage';
import './Analysis.css';

function TopThingsPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const analysisData = location.state?.analysisData || loadAnalysisData();
  const file = location.state?.file || null;
  const topThings = analysisData?.analysis?.top_10_things || [];

  if (!analysisData) {
    return (
      <div className="page">
        <Navbar />
        <section className="page-banner">
          <div className="page-banner__eyebrow">Highlights</div>
          <h1 className="page-banner__title">Top 10 Things to Know</h1>
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
        <h1 className="page-banner__title">Top 10 Things to Know</h1>
      </section>

      <section className="analysis-section">
        <div className="clauses-toolbar">
          <button
            type="button"
            className="panel-link panel-link--button"
            onClick={() => navigate('/analysis', { state: { analysisData, file } })}
          >
            Back to dashboard
          </button>
          <p className="clauses-toolbar__copy">
            Review the key takeaways from the lease in one place.
          </p>
        </div>

        <div className="dashboard-panel">
          <div className="dash-panel__header">
            <h2 className="dash-panel__title">All Top 10 Items</h2>
            <span className="dash-panel__badge">{topThings.length} items</span>
          </div>
          <ol className="top10-list">
            {topThings.map((item, idx) => (
              <li key={`${item}-${idx}`} className="top10-item">
                <span className="top10-item__num">{idx + 1}</span>
                <span className="top10-item__text">{item}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </div>
  );
}

export default TopThingsPage;
