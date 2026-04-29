import React, { useMemo } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { loadAnalysisData, slugifyClauseTitle } from '../utils/analysisStorage';
import './Analysis.css';

function ClausesPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { clauseId } = useParams();

  const analysisData = location.state?.analysisData || loadAnalysisData();
  const clauses = analysisData?.analysis?.clause_summaries || [];

  const selectedClause = useMemo(() => {
    if (!clauses.length) return null;
    if (!clauseId) return clauses[0];

    return clauses.find((clause) => slugifyClauseTitle(clause.title) === clauseId) || clauses[0];
  }, [clauses, clauseId]);

  if (!analysisData) {
    return (
      <div className="page">
        <Navbar />
        <section className="page-banner">
          <div className="page-banner__eyebrow">Clauses</div>
          <h1 className="page-banner__title">Clause Summaries</h1>
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
        <h1 className="page-banner__title">Clause Summaries</h1>
      </section>

      <section className="analysis-section">
        <div className="clauses-toolbar">
          <button
            type="button"
            className="panel-link panel-link--button"
            onClick={() => navigate('/analysis', { state: { analysisData } })}
          >
            Back to dashboard
          </button>
          <p className="clauses-toolbar__copy">
            Review each clause in more detail without losing the main dashboard as your overview.
          </p>
        </div>

        <div className="clauses-layout">
          <aside className="dashboard-panel clauses-sidebar">
            <h2 className="overview-title">All Clauses</h2>
            <div className="clauses-nav">
              {clauses.map((clause, idx) => {
                const isSelected = selectedClause?.title === clause.title;
                return (
                  <button
                    type="button"
                    key={`${clause.title}-${idx}`}
                    className={`clauses-nav__item${isSelected ? ' clauses-nav__item--active' : ''}`}
                    onClick={() =>
                      navigate(`/analysis/clauses/${slugifyClauseTitle(clause.title)}`, {
                        state: { analysisData, selectedClauseTitle: clause.title }
                      })
                    }
                  >
                    <span>{clause.title}</span>
                    <span className={`risk-pill risk-pill--${clause.risk_level}`}>
                      {clause.risk_level}
                    </span>
                  </button>
                );
              })}
            </div>
          </aside>

          <div className="dashboard-panel clauses-detail">
            {selectedClause ? (
              <>
                <div className="summary-card__header">
                  <h2 className="overview-title">{selectedClause.title}</h2>
                  <span className={`risk-pill risk-pill--${selectedClause.risk_level}`}>
                    {selectedClause.risk_level} risk
                  </span>
                </div>
                <p className="clauses-detail__lead">{selectedClause.summary}</p>

                <div className="clauses-detail__section">
                  <h3>Why It Matters</h3>
                  <p>{selectedClause.why_it_matters}</p>
                </div>
              </>
            ) : (
              <p>No clause summaries are available for this lease yet.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default ClausesPage;
