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
        setTimeout(() => {
          setAnalysisData({
            fileName: uploadedFile?.name || 'Uploaded Document',
            processedAt: new Date().toLocaleString(),
            lease_meta: {
              lease_category: 'Residential Lease Agreement',
              landlord_name: 'Property Management Inc.',
              tenant_name: 'John Doe',
              guarantor: 'Jane Doe',
            },
            executive_summary: 'This is a 12-month residential lease agreement for a standard apartment. The monthly rent is $1,500 with a $30 utility fee, resulting in a total monthly cost of $1,530. A security deposit of $500 is required, and there is an 18% annual interest on late payments.',
            property_info: {
              property_address: '123 Main Street, Apt 4B, Springfield, IL 62701',
              property_type: 'Standard Apartment',
              square_footage: '850 sq ft',
              unit_or_suite: 'Apt 4B',
              permitted_use: 'Residential use only',
            },
            lease_term: {
              term_length: '12 Months',
              start_date: 'August 1, 2024',
              end_date: 'July 31, 2025',
              renewal_terms: 'Automatic converts to month-to-month unless terminated with notice',
              notice_to_vacate: '30 days',
            },
            financial_summary: {
              base_rent: '$1,500',
              rent_frequency: 'Monthly',
              rent_due_date: '1st of each month',
              rent_escalation: '3% annual increase after first year',
              security_deposit: '$500',
              late_fee: '$50 if not received by the 5th day of the month',
              interest_on_unpaid: '18% annually',
              additional_fees: [
                { name: 'Monthly Utility Fee', amount: '$30' },
              ],
              total_monthly_cost: '$1,500 + $30 = $1,530',
            },
            key_conditions: [
              'Rent is due on the 1st of each month',
              "Utilities must be transferred into the tenant's name",
              'Concessions may be revoked in the event of default or lease violation',
              'Tenant is liable for maintenance and repairs beyond normal wear and tear',
              'Subletting is prohibited without landlord written consent',
            ],
            risk_flags: [
              { flag: 'Automatic renewal converts to month-to-month', severity: 'medium' },
              { flag: 'High late fee of $50', severity: 'low' },
              { flag: '18% annual interest on unpaid balances', severity: 'high' },
            ],
          });
          setLoading(false);
        }, 2000);
        setUsingDemoData(false);

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
                Backend not connected yet, so demo analysis is being shown.
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
                    <div className="info-item">
                      <strong>Base Monthly Rent:</strong> {analysisData?.financial_summary?.base_rent}
                    </div>
                    <div className="info-item">
                      <strong>Rent Due Date:</strong> {analysisData?.financial_summary?.rent_due_date}
                    </div>
                    <div className="info-item">
                      <strong>Monthly Utility Fee:</strong> {analysisData?.financial_summary?.additional_fees?.[0]?.amount}
                    </div>
                    <div className="info-item">
                      <strong>Total Monthly Cost:</strong> {analysisData?.financial_summary?.total_monthly_cost}
                    </div>
                    <div className="info-item">
                      <strong>Security Deposit:</strong> {analysisData?.financial_summary?.security_deposit}
                    </div>
                    <div className="info-item">
                      <strong>Late Fee:</strong> {analysisData?.financial_summary?.late_fee}
                    </div>
                    <div className="info-item">
                      <strong>Interest:</strong> {analysisData?.financial_summary?.interest_on_unpaid}
                    </div>
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
                      {analysisData?.key_conditions?.map((condition, idx) => (
                        <li key={idx}>{condition}</li>
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