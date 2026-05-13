import React, { useMemo } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { loadAnalysisData, slugifyClauseTitle } from '../utils/analysisStorage';
import './Analysis.css';

const getClauseQuote = (clause = {}) => {
  const quoteFields = [
    clause.lease_quote,
    clause.clause_quote,
    clause.source_quote,
    clause.supporting_quote,
    clause.exact_quote,
    clause.quote,
    clause.excerpt,
    clause.source_text
  ];

  const directQuote = quoteFields.find((quote) => typeof quote === 'string' && quote.trim());
  if (directQuote) return directQuote.trim();

  if (Array.isArray(clause.evidence)) {
    const evidenceQuote = clause.evidence.find((quote) => typeof quote === 'string' && quote.trim());
    if (evidenceQuote) return evidenceQuote.trim();
  }

  return 'Exact quote not captured for this saved analysis. Re-run the lease analysis to add verbatim lease language for this clause.';
};

const formatLeaseQuote = (quote = '') => {
  const trimmedQuote = quote.trim();
  if (!trimmedQuote) return '';

  const hasDoubleQuotes = trimmedQuote.startsWith('"') && trimmedQuote.endsWith('"');
  const hasSingleQuotes = trimmedQuote.startsWith("'") && trimmedQuote.endsWith("'");

  if (hasDoubleQuotes || hasSingleQuotes) return trimmedQuote;
  return `"${trimmedQuote}"`;
};

function ClausesPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { clauseId } = useParams();

  const analysisData = location.state?.analysisData || loadAnalysisData();
  const file = location.state?.file || null;
  const clauses = analysisData?.analysis?.clause_summaries || [];

  const selectedClause = useMemo(() => {
    if (!clauses.length) return null;
    if (!clauseId) return clauses[0];
    return clauses.find((clause) => slugifyClauseTitle(clause.title) === clauseId) || clauses[0];
  }, [clauses, clauseId]);

  const selectedIndex = useMemo(
    () => clauses.findIndex((clause) => clause.title === selectedClause?.title),
    [clauses, selectedClause]
  );

  const openClause = (clause) => {
    navigate(`/analysis/clauses/${slugifyClauseTitle(clause.title)}`, {
      state: { analysisData, file, selectedClauseTitle: clause.title }
    });
  };

  const previousClause = selectedIndex > 0 ? clauses[selectedIndex - 1] : null;
  const nextClause = selectedIndex >= 0 && selectedIndex < clauses.length - 1 ? clauses[selectedIndex + 1] : null;
  const selectedClauseQuote = selectedClause ? formatLeaseQuote(getClauseQuote(selectedClause)) : '';

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
        <h1 className="page-banner__title">Clause Summaries</h1>
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
            Review each clause in more detail without losing the main dashboard as your overview.
          </p>
        </div>

        <div className="dashboard-panel clauses-detail">
          {selectedClause ? (
            <>
              <div className="clauses-card-header">
                <div>
                  <div className="clauses-card__eyebrow">
                    Card {selectedIndex + 1} of {clauses.length}
                  </div>
                  <h2 className="overview-title clauses-card__title">{selectedClause.title}</h2>
                </div>
                <span className={`risk-pill risk-pill--${selectedClause.risk_level}`}>
                  {selectedClause.risk_level} risk
                </span>
              </div>

              <div className="clauses-study-card">
                <div className="clauses-study-card__section clauses-study-card__section--quote">
                  <span className="clauses-study-card__label">Specific Lease Language</span>
                  <blockquote className="clauses-quote">{selectedClauseQuote}</blockquote>
                </div>

                <div className="clauses-study-card__section">
                  <span className="clauses-study-card__label">Clause In Plain English</span>
                  <p className="clauses-detail__lead">{selectedClause.summary}</p>
                </div>

                <div className="clauses-study-card__section">
                  <span className="clauses-study-card__label">Why It Matters</span>
                  <p>{selectedClause.why_it_matters}</p>
                </div>
              </div>

              <div className="clauses-card-footer">
                <button
                  type="button"
                  className="pdf-nav-btn"
                  onClick={() => previousClause && openClause(previousClause)}
                  disabled={!previousClause}
                >
                  &larr; Previous
                </button>
                <button
                  type="button"
                  className="pdf-nav-btn"
                  onClick={() => nextClause && openClause(nextClause)}
                  disabled={!nextClause}
                >
                  Next &rarr;
                </button>
              </div>
            </>
          ) : (
            <p>No clause summaries are available for this lease yet.</p>
          )}
        </div>
      </section>
    </div>
  );
}

export default ClausesPage;
