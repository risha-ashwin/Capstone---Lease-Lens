import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './LandingPage.css';
import './MyLeases.css';

const HISTORY_KEY = 'leaseLensHistory';

export function saveToHistory(analysisResult) {
  try {
    const existing = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
    const entry = {
      id: Date.now().toString(),
      fileName: analysisResult.fileName || 'Untitled Lease',
      savedAt: new Date().toISOString(),
      analysis: analysisResult.analysis,
    };
    const updated = [entry, ...existing].slice(0, 50);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    return entry.id;
  } catch (_err) {
    return null;
  }
}

export function loadHistory() {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
  } catch (_err) {
    return [];
  }
}

export function deleteFromHistory(id) {
  try {
    const existing = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
    localStorage.setItem(
      HISTORY_KEY,
      JSON.stringify(existing.filter((e) => e.id !== id))
    );
  } catch (_err) {}
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
}

function RiskSummary({ flags = [] }) {
  const high = flags.filter((f) => f.severity === 'high').length;
  const med  = flags.filter((f) => f.severity === 'medium').length;
  const low  = flags.filter((f) => f.severity === 'low').length;
  return (
    <div className="hp-risk-row">
      {high > 0 && <span className="hp-badge hp-badge--high">{high} High</span>}
      {med  > 0 && <span className="hp-badge hp-badge--med">{med} Med</span>}
      {low  > 0 && <span className="hp-badge hp-badge--low">{low} Low</span>}
      {high === 0 && med === 0 && low === 0 && (
        <span className="hp-badge hp-badge--ok">No flags</span>
      )}
    </div>
  );
}

export default function MyLeasesPage() {
  const [entries, setEntries] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setEntries(loadHistory());
  }, []);

  const handleDelete = (id) => {
    deleteFromHistory(id);
    setEntries((prev) => prev.filter((e) => e.id !== id));
    setDeleteId(null);
  };

  const handleView = (entry) => {
    navigate('/analysis', {
      state: {
        analysisData: {
          fileName: entry.fileName,
          processedAt: entry.savedAt,
          analysis: entry.analysis,
        },
        file: null,
      },
    });
  };

  return (
    <div className="page hp-page">
      <Navbar />

      <section className="page-banner">
        <div className="page-banner__eyebrow">My Leases</div>
        <h1 className="page-banner__title">My Leases</h1>
        <p className="page-banner__sub">
          Your saved lease analyses — view, download, or delete at any time.
        </p>
      </section>

      <section className="hp-body">
        <div className="hp-inner">

          {entries.length === 0 ? (
            /* Empty state */
            <div className="hp-empty">
              <div className="hp-empty__icon">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                </svg>
              </div>
              <h2 className="hp-empty__title">No saved leases yet</h2>
              <p className="hp-empty__sub">
                After you analyze a lease, click <strong>Save to My Leases</strong> and
                your insights will appear here — no need to re-upload.
              </p>
              <Link to="/upload" className="hp-btn-primary">
                Upload a Lease
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"/>
                  <polyline points="12 5 19 12 12 19"/>
                </svg>
              </Link>
            </div>
          ) : (
            <>
              {/* Toolbar */}
              <div className="hp-toolbar">
                <p className="hp-toolbar__count">
                  {entries.length} saved {entries.length === 1 ? 'lease' : 'leases'}
                </p>
                <Link to="/upload" className="hp-btn-primary">
                  Upload New Lease
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"/>
                    <polyline points="12 5 19 12 12 19"/>
                  </svg>
                </Link>
              </div>

              {/* List */}
              <div className="hp-list">
                {entries.map((entry) => (
                  <div className="hp-card" key={entry.id}>
                    {/* Left: icon + name + date */}
                    <div className="hp-card__left">
                      <div className="hp-card__icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                          <polyline points="14 2 14 8 20 8"/>
                        </svg>
                      </div>
                      <div className="hp-card__meta">
                        <div className="hp-card__name">{entry.fileName}</div>
                        <div className="hp-card__date">Saved {formatDate(entry.savedAt)}</div>
                      </div>
                    </div>

                    {/* Middle: risk badges + clause count */}
                    <div className="hp-card__middle">
                      <RiskSummary flags={entry.analysis?.risk_flags || []} />
                      <span className="hp-card__detail">
                        {entry.analysis?.clause_summaries?.length || 0} clauses
                        &nbsp;&middot;&nbsp;
                        {entry.analysis?.key_terms?.length || 0} key terms
                      </span>
                    </div>

                    {/* Right: actions */}
                    <div className="hp-card__actions">
                      <button
                        className="hp-btn-view"
                        onClick={() => handleView(entry)}
                      >
                        View
                      </button>
                      <button
                        className="hp-btn-delete"
                        onClick={() => setDeleteId(entry.id)}
                        aria-label="Delete"
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6"/>
                          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                          <path d="M10 11v6"/><path d="M14 11v6"/>
                          <path d="M9 6V4h6v2"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

        </div>
      </section>

      {/* Delete confirmation dialog */}
      {deleteId && (
        <div
          className="hp-overlay"
          onClick={() => setDeleteId(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="hp-dialog-title"
        >
          <div className="hp-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="hp-dialog__icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                <path d="M9 6V4h6v2"/>
              </svg>
            </div>
            <h3 className="hp-dialog__title" id="hp-dialog-title">Delete this lease?</h3>
            <p className="hp-dialog__body">
              This permanently removes the saved insights. Your original lease file is
              never stored and is not affected.
            </p>
            <div className="hp-dialog__actions">
              <button className="hp-dialog__cancel" onClick={() => setDeleteId(null)}>
                Cancel
              </button>
              <button className="hp-dialog__confirm" onClick={() => handleDelete(deleteId)}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}