import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Document, Page } from 'react-pdf';
// If Annotation/Text layer CSS imports cause errors, comment them out.
// import 'react-pdf/dist/Page/AnnotationLayer.css';
// import 'react-pdf/dist/Page/TextLayer.css';
import Navbar from '../components/Navbar';
import './Analysis.css';

// Set up PDF.js worker
import { pdfjs } from 'react-pdf';
// Use local worker file to avoid CDN version mismatches and dynamic import issues
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

function Analysis() {
  const location = useLocation();
  const navigate = useNavigate();
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [file, setFile] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [expandedSections, setExpandedSections] = useState({
    executive: false,
    property: false,
    term: false,
    financial: false,
    conditions: false,
  });
  const toBullets = (text) => {
    if (!text) return [];
    return text
      .split(/\r?\n|\. |\? |\! /)
      .map((s) => s.trim())
      .filter(Boolean);
  };

  useEffect(() => {
    const uploadedFile = location.state?.file;

    if (!uploadedFile) {
      setError('No lease file provided. Please upload a lease first.');
      setLoading(false);
      return;
    }

    // If uploadedFile is a File, create an object URL for the viewer.
    // If it's already a string URL, use it directly.
    let fileUrl = null;
    if (uploadedFile instanceof File) {
      fileUrl = URL.createObjectURL(uploadedFile);
      setFile(fileUrl);
    } else {
      fileUrl = uploadedFile;
      setFile(fileUrl);
    }

    const analyzeLeaseFile = async () => {
      try {
        setLoading(true);
        // TODO: Send file to backend API for analysis
        // const formData = new FormData();
        // formData.append('file', uploadedFile);
        // const response = await fetch('/api/analyze-lease', {
        //   method: 'POST',
        //   body: formData,
        // });
        // const data = await response.json();
        // setAnalysisData(data);

        // For now, simulate processing with sample data structure
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
              'Utilities must be transferred into the tenant\'s name',
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
      } catch (err) {
        setError(`Error analyzing lease: ${err.message}`);
        setLoading(false);
      }
    };

    analyzeLeaseFile();

    // Cleanup: revoke created object URL when component unmounts or file changes
    return () => {
      if (uploadedFile instanceof File && fileUrl) {
        URL.revokeObjectURL(fileUrl);
      }
    };
  }, [location.state, navigate]);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

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
            ← Back to Upload
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
        <h1 className="page-banner__title">Analyze Lease</h1>
      </section>

      <section className="analysis-section">
        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>Analyzing your lease...</p>
          </div>
        ) : (
          <div className="analysis-container">
            {/* Left side - Lease Overview */}
            <div className="lease-overview">
              <h2 className="overview-title">Lease Overview</h2>

              {/* Executive Summary */}
              <div className="accordion-item">
                <button
                  className={`accordion-header ${expandedSections.executive ? 'active' : ''}`}
                  onClick={() => toggleSection('executive')}
                >
                  <span>Executive Summary</span>
                  <span className="accordion-icon">{expandedSections.executive ? '▲' : '▼'}</span>
                </button>
                {expandedSections.executive && (
                  <div className="accordion-content">
                    <ul className="executive-bullets">
                      {toBullets(analysisData?.executive_summary).map((line, idx) => (
                        <li key={idx}>{line}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Property Information */}
              <div className="accordion-item">
                <button
                  className={`accordion-header ${expandedSections.property ? 'active' : ''}`}
                  onClick={() => toggleSection('property')}
                >
                  <span>Property Information</span>
                  <span className="accordion-icon">{expandedSections.property ? '▲' : '▼'}</span>
                </button>
                {expandedSections.property && (
                  <div className="accordion-content">
                    <div className="info-item">
                      <strong>Property Type:</strong> {analysisData?.property_info?.property_type}
                    </div>
                    <div className="info-item">
                      <strong>Address:</strong> {analysisData?.property_info?.property_address}
                    </div>
                    <div className="info-item">
                      <strong>Unit:</strong> {analysisData?.property_info?.unit_or_suite}
                    </div>
                    <div className="info-item">
                      <strong>Square Footage:</strong> {analysisData?.property_info?.square_footage}
                    </div>
                    <div className="info-item">
                      <strong>Permitted Use:</strong> {analysisData?.property_info?.permitted_use}
                    </div>
                    <div className="info-item">
                      <strong>Lease Type:</strong> {analysisData?.lease_meta?.lease_category}
                    </div>
                  </div>
                )}
              </div>

              {/* Lease Term */}
              <div className="accordion-item">
                <button
                  className={`accordion-header ${expandedSections.term ? 'active' : ''}`}
                  onClick={() => toggleSection('term')}
                >
                  <span>Lease Term</span>
                  <span className="accordion-icon">{expandedSections.term ? '▲' : '▼'}</span>
                </button>
                {expandedSections.term && (
                  <div className="accordion-content">
                    <div className="info-item">
                      <strong>Term Length:</strong> {analysisData?.lease_term?.term_length}
                    </div>
                    <div className="info-item">
                      <strong>Start Date:</strong> {analysisData?.lease_term?.start_date}
                    </div>
                    <div className="info-item">
                      <strong>End Date:</strong> {analysisData?.lease_term?.end_date}
                    </div>
                    <div className="info-item">
                      <strong>Notice to Vacate:</strong> {analysisData?.lease_term?.notice_to_vacate}
                    </div>
                    <div className="info-item">
                      <strong>Renewal:</strong> {analysisData?.lease_term?.renewal_terms}
                    </div>
                  </div>
                )}
              </div>

              {/* Financial Summary */}
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

              {/* Key Contract Conditions */}
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
                        <li key={idx}>
                          {condition}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Right side - Lease Document Preview */}
            <div className="lease-preview">
              {file ? (
                <div className="pdf-viewer">
                  <Document
                    file={file}
                    onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                    loading={<div className="pdf-loading">Loading PDF...</div>}
                    error={<div className="pdf-error">Failed to load PDF</div>}
                  >
                    <Page pageNumber={pageNumber} width={480} />
                  </Document>
                  <div className="pdf-controls">
                    <button
                      onClick={() => setPageNumber(Math.max(1, pageNumber - 1))}
                      disabled={pageNumber <= 1}
                      className="pdf-nav-button"
                    >
                      ←
                    </button>
                    <span className="pdf-page-info">
                      Page {pageNumber} of {numPages || '?'}
                    </span>
                    <button
                      onClick={() => setPageNumber(Math.min(numPages, pageNumber + 1))}
                      disabled={pageNumber >= numPages}
                      className="pdf-nav-button"
                    >
                      →
                    </button>
                  </div>
                </div>
              ) : (
                <div className="document-placeholder">
                  <p>📄 Lease Document Preview</p>
                  <p style={{ fontSize: '0.85rem', color: '#999' }}>
                    No document loaded
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {analysisData && !loading && (
          <div className="action-buttons-section">
            <button className="btn btn--blue">Clause Summary</button>
            <button className="btn btn--blue">Highlight Key Terms</button>
            <button className="btn btn--blue">Risk Detection</button>
          </div>
        )}

        {/* Chatbot Button - Fixed Bottom Right */}
        <button className="btn btn--blue chatbot-button">Open Chatbot →</button>
      </section>
    </div>
  );
}

export default Analysis;
