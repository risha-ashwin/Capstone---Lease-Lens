import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './LandingPage.css';
import './Upload.css';

function UploadPage() {
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const validateFile = (f) => {
    if (!f) return false;
    if (f.type !== 'application/pdf') {
      setError('Only PDF files are accepted. Please upload a .pdf file.');
      return false;
    }
    if (f.size > 20 * 1024 * 1024) {
      setError('File size must be under 20 MB.');
      return false;
    }
    setError('');
    return true;
  };

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (f && validateFile(f)) setFile(f);
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f && validateFile(f)) setFile(f);
  }, []);

  const handleDragOver = (e) => { e.preventDefault(); setDragging(true); };
  const handleDragLeave = () => setDragging(false);

  const handleCancel = () => {
    setFile(null);
    setError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleContinue = () => {
    if (!file) {
      setError('Please upload a PDF before continuing.');
      return;
    }
    navigate('/results', { state: { file } });
  };

  const formatBytes = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="page">
      <Navbar />

      <section className="page-banner">
        <div className="page-banner__eyebrow">Upload</div>
        <h1 className="page-banner__title">Upload a Lease</h1>
        <p className="page-banner__sub">
          Securely upload your PDF lease and get a plain-language breakdown in minutes.
        </p>
      </section>

      <section className="upload-section">
        <div className="upload-card">

          <div className="upload-card__header">
            <h2 className="upload-card__title">File Upload</h2>
          </div>

          <div className="upload-card__body">
            <div
              className={`upload-dropzone${dragging ? ' upload-dropzone--active' : ''}${file ? ' upload-dropzone--has-file' : ''}`}
              onClick={() => !file && fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              role="button"
              tabIndex={0}
              aria-label="File upload area"
              onKeyDown={(e) => e.key === 'Enter' && !file && fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />

              {file ? (
                <div className="upload-dropzone__file-info">
                  <div className="upload-dropzone__file-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                      <line x1="9" y1="13" x2="15" y2="13"/>
                      <line x1="9" y1="17" x2="13" y2="17"/>
                    </svg>
                  </div>
                  <div className="upload-dropzone__file-meta">
                    <span className="upload-dropzone__file-name">{file.name}</span>
                    <span className="upload-dropzone__file-size">{formatBytes(file.size)}</span>
                  </div>
                  <button
                    className="upload-dropzone__remove"
                    onClick={(e) => { e.stopPropagation(); handleCancel(); }}
                    aria-label="Remove file"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <>
                  <div className="upload-dropzone__icon">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="16 16 12 12 8 16"/>
                      <line x1="12" y1="12" x2="12" y2="21"/>
                      <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
                    </svg>
                  </div>
                  <p className="upload-dropzone__label">Click or drag file to this area to upload</p>
                  <p className="upload-dropzone__hint">Formats accepted are .pdf</p>
                </>
              )}
            </div>

            {error && (
              <div className="upload-error" role="alert">
                <span className="upload-error__icon">⚠</span>
                {error}
              </div>
            )}

            {!file && (
              <div className="upload-security">
                <span>🛡️</span>
                <span>Your document is encrypted and never stored or shared.</span>
              </div>
            )}
          </div>

          <div className="upload-card__footer">
            <button className="upload-btn upload-btn--cancel" onClick={handleCancel}>
              Cancel
            </button>
            <button
              className={`upload-btn upload-btn--continue${file ? '' : ' upload-btn--disabled'}`}
              onClick={handleContinue}
              disabled={!file}
            >
              Continue →
            </button>
          </div>
        </div>

        <div className="upload-trust">
          <div className="trust-pill">
            <span style={{ fontSize: 14 }}>🛡️</span>
            <span>Legal-grade security</span>
          </div>
          <div className="trust-pill">
            <span style={{ fontSize: 14 }}>⚡</span>
            <span>Results in seconds</span>
          </div>
          <div className="trust-pill">
            <span style={{ fontSize: 14 }}>🎓</span>
            <span>Built for students</span>
          </div>
        </div>
      </section>
    </div>
  );
}

export default UploadPage;



