import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Document, Page, pdfjs } from 'react-pdf';
import Navbar from '../components/Navbar';
import './Analysis.css';

pdfjs.GlobalWorkerOptions.workerSrc =
  `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';

const buildDemoAnalysis = (uploadedFile) => ({
  fileName: uploadedFile?.name || 'Uploaded Document',
  processedAt: new Date().toISOString(),
  analysis: {
    overview: {
      tldr: 'This lease includes monthly rent obligations, fees, renewal terms, and other conditions you should review before signing.',
      lease_type: 'Residential Lease Agreement',
      parties: ['Landlord: Example Property Management', 'Tenant: Student Renter'],
      term_summary: '12-month lease with renewal language and notice requirements.',
      financial_summary: 'Monthly rent, security deposit, and potential late fees apply.'
    },
    clause_summaries: [
      {
        title: 'Late Fees',
        summary: 'The lease charges a penalty if rent is not paid on time.',
        why_it_matters: 'Missing the due date increases the total you owe.',
        risk_level: 'medium'
      },
      {
        title: 'Renewal',
        summary: 'The lease may automatically continue unless proper notice is given.',
        why_it_matters: 'You could stay financially responsible longer than expected.',
        risk_level: 'high'
      }
    ],
    key_terms: [
      {
        term: 'Security Deposit',
        value: 'See lease',
        plain_english: 'An upfront amount you may get back if the unit is left in good condition.'
      }
    ],
    top_10_things: [
      'Check the lease end date.',
      'Understand how much notice is required before moving out.',
      'Look for late fees and penalties.',
      'Confirm total monthly cost.',
      'Review renewal language.',
      'Check who pays utilities.',
      'Review maintenance responsibilities.',
      'Look for subletting rules.',
      'Understand deposit return terms.',
      'Check any extra fees.'
    ],
    risk_flags: [
      { flag: 'Automatic renewal language may apply.', severity: 'high' }
    ]
  }
});

function Analysis() {
  const location = useLocation();
  const navigate = useNavigate();
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [file, setFile] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [usingDemoData, setUsingDemoData] = useState(false);
  const [pdfError, setPdfError] = useState('');
  const [expandedSections, setExpandedSections] = useState({
    executive: false,
    property: false,
    term: false,
    financial: false,
    conditions: false,
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  useEffect(() => {
    const uploadedFile = location.state?.file;

    if (!uploadedFile) {
      setError('No lease file provided. Please upload a lease first.');
      setLoading(false);
      return undefined;
    }

    let fileUrl = null;

    if (uploadedFile instanceof File) {
      fileUrl = URL.createObjectURL(uploadedFile);
      setFile(fileUrl);
    } else {
      fileUrl = uploadedFile;
      setFile(fileUrl);
    }

    setPdfError('');
    setPageNumber(1);
    setNumPages(null);

    const analyzeLeaseFile = async () => {
      try {
        setLoading(true);
        const formData = new FormData();
        formData.append('file', uploadedFile);

        const response = await fetch(`${API_BASE_URL}/api/analyze-lease`, {
          method: 'POST',
          body: formData
        });

        if (!response.ok) {
          throw new Error(`API returned ${response.status}`);
        }

        const data = await response.json();
        setAnalysisData(data);
        setUsingDemoData(data.source === 'mock');
      } catch (err) {
        setUsingDemoData(true);
        setAnalysisData(buildDemoAnalysis(uploadedFile));
        console.warn('Falling back to demo data:', err);
      } finally {
        setLoading(false);
      }
    };

    analyzeLeaseFile();

    return () => {
      if (uploadedFile instanceof File && fileUrl) {
        URL.revokeObjectURL(fileUrl);
      }
    };
  }, [location.state]);

  const analysis = analysisData?.analysis;
  const riskFlags = analysis?.risk_flags || [];
  const highRiskCount = riskFlags.filter((item) => item.severity === 'high').length;
  const mediumRiskCount = riskFlags.filter((item) => item.severity === 'medium').length;
  const keyConditions = analysis?.clause_summaries || [];

  if (error) {
    return (
      <div className="page">
        <Navbar />
        <section className="page-banner">
          <div className="page-banner__eyebrow">Analysis</div>
          <h1 className="page-banner__title">Lease Analysis</h1>
        </section>
        <section className="analysis-section">
          <div className="error-message">{error}</div>
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
        <div className="page-banner__eyebrow">Analyze Lease</div>
        <h1 className="page-banner__title">Lease Insights</h1>
      </section>

      <section className="analysis-section">
        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>Analyzing your lease...</p>
          </div>
        ) : (
          <>
            {usingDemoData && (
              <div className="demo-banner">
                Gemini analysis is unavailable right now, so demo analysis is being shown.
              </div>
            )}

            <div className="insights-strip">
              <div className="insight-card">
                <span className="insight-card__label">TL;DR</span>
                <p>{analysis?.overview?.tldr}</p>
              </div>

              <div className="insight-card">
                <span className="insight-card__label">Lease Type</span>
                <p>{analysis?.overview?.lease_type}</p>
              </div>

              <div className="insight-card">
                <span className="insight-card__label">Risk Snapshot</span>
                <p>{highRiskCount} high risk, {mediumRiskCount} medium risk</p>
              </div>

              {/* Financial Summary Accordion */}
              <div className="accordion-item">
                <button
                  className={`accordion-header ${expandedSections.financial ? 'active' : ''}`}
                  onClick={() => toggleSection('financial')}
                >
                  <span>Financial Summary</span>
                  <span className="accordion-icon">{expandedSections.financial ? '▲' : '▼'}</span>
                </button>
                {expandedSections.financial && (
                  <div className="accordion-content">
                    <p className="accordion-copy">
                      {analysis?.overview?.financial_summary || 'No financial summary is available yet.'}
                    </p>
                  </div>
                )}
              </div>

              {/* Key Contract Conditions Accordion */}
              <div className="accordion-item">
                <button
                  className={`accordion-header ${expandedSections.conditions ? 'active' : ''}`}
                  onClick={() => toggleSection('conditions')}
                >
                  <span>Key Contract Conditions</span>
                  <span className="accordion-icon">{expandedSections.conditions ? '▲' : '▼'}</span>
                </button>
                {expandedSections.conditions && (
                  <div className="accordion-content">
                    <ul className="conditions-list">
                      {keyConditions.map((condition, idx) => (
                        <li key={`${condition.title}-${idx}`}>
                          <strong>{condition.title}:</strong> {condition.summary}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>{/* end insights-strip */}

            <div className="analysis-container">
              <div className="lease-overview">
                <div className="dashboard-panel">
                  <h2 className="overview-title">Clause Summaries</h2>
                  <div className="summary-list">
                    {analysis?.clause_summaries?.map((clause, idx) => (
                      <article className="summary-card" key={`${clause.title}-${idx}`}>
                        <div className="summary-card__header">
                          <h3>{clause.title}</h3>
                          <span className={`risk-pill risk-pill--${clause.risk_level}`}>
                            {clause.risk_level} risk
                          </span>
                        </div>
                        <p>{clause.summary}</p>
                        <p className="summary-card__meta">{clause.why_it_matters}</p>
                      </article>
                    ))}
                  </div>
                </div>

                <div className="dashboard-panel">
                  <h2 className="overview-title">Top 10 Things to Know Before Signing</h2>
                  <ol className="top-ten-list">
                    {analysis?.top_10_things?.map((item, idx) => (
                      <li key={`${item}-${idx}`}>{item}</li>
                    ))}
                  </ol>
                </div>
              </div>

              <div className="lease-preview">
                <div className="dashboard-panel dashboard-panel--sticky">
                  <h2 className="overview-title">Key Terms</h2>
                  <div className="terms-list">
                    {analysis?.key_terms?.map((item, idx) => (
                      <article className="term-card" key={`${item.term}-${idx}`}>
                        <div className="term-card__header">
                          <h3>{item.term}</h3>
                          <span>{item.value}</span>
                        </div>
                        <p>{item.plain_english}</p>
                      </article>
                    ))}
                  </div>

                  <h2 className="overview-title overview-title--spaced">Document Preview</h2>
                  {file ? (
                    <div className="pdf-viewer">
                      <Document
                        file={file}
                        onLoadSuccess={({ numPages: loadedPages }) => {
                          setNumPages(loadedPages);
                          setPdfError('');
                        }}
                        onLoadError={(pdfLoadError) => {
                          console.error('PDF preview failed:', pdfLoadError);
                          setPdfError(pdfLoadError.message || 'Failed to load PDF preview.');
                        }}
                        loading={<div className="pdf-loading">Loading PDF...</div>}
                        error={<div className="pdf-error">{pdfError || 'Failed to load PDF'}</div>}
                      >
                        <Page pageNumber={pageNumber} width={420} />
                      </Document>
                      <div className="pdf-controls">
                        <button
                          onClick={() => setPageNumber(Math.max(1, pageNumber - 1))}
                          disabled={pageNumber <= 1}
                          className="pdf-nav-button"
                        >
                          Prev
                        </button>
                        <span className="pdf-page-info">
                          Page {pageNumber} of {numPages || '?'}
                        </span>
                        <button
                          onClick={() => setPageNumber(Math.min(numPages || pageNumber, pageNumber + 1))}
                          disabled={pageNumber >= numPages}
                          className="pdf-nav-button"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="document-placeholder">
                      <p>No document loaded</p>
                    </div>
                  )}
                </div>
              </div>
            </div>{/* end analysis-container */}
          </>
        )}
      </section>
    </div>
  );
}

export default Analysis;
