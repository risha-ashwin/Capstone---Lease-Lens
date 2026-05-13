import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './LandingPage.css';
import './HistoryPage.css';

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
    const updated = [entry, ...existing].slice(0, 50); // cap at 50
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
    localStorage.setItem(HISTORY_KEY, JSON.stringify(existing.filter(e => e.id !== id)));
  } catch (_err) {}
}

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function RiskBadge({ flags = [] }) {
  const high = flags.filter(f => f.severity === 'high').length;
  const med  = flags.filter(f => f.severity === 'medium').length;
  return (
    <div className="hp-risk-badges">
      {high > 0 && <span className="hp-badge hp-badge--high">{high} High</span>}
      {med  > 0 && <span className="hp-badge hp-badge--med">{med} Med</span>}
      {high === 0 && med === 0 && <span className="hp-badge hp-badge--ok">No major risks</span>}
    </div>
  );
}

export default function HistoryPage() {
  const [entries, setEntries] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setEntries(loadHistory());
  }, []);

  const handleDelete = (id) => {
    deleteFromHistory(id);
    setEntries(prev => prev.filter(e => e.id !== id));
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
        <div className="page-banner__eyebrow">Your Account</div>
        <h1 className="page-banner__title">Saved Analyses</h1>
        <p className="page-banner__sub">
          Your lease insights — review, download, or delete at any time.
        </p>
      </section>

      <section className="hp-body">
        <div className="hp-inner">

          {entries.length === 0 ? (
            <div className="hp-empty">
              <div className="hp-empty__icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                </svg>
              </div>
              <h2 className="hp-empty__title">No saved analyses yet</h2>
              <p className="hp-empty__sub">
                Upload a lease and choose to save your insights — they'll appear here.
              </p>
              <Link to="/upload" className="hp-btn-primary">
                Upload a Lease
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                </svg>
              </Link>
            </div>
          ) : (
            <>
              <div className="hp-toolbar">
                <p className="hp-toolbar__count">
                  {entries.length} saved {entries.length === 1 ? 'analysis' : 'analyses'}
                </p>
                <Link to="/upload" className="hp-btn-primary">
                  Upload New Lease
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                  </svg>
                </Link>
              </div>

              <div className="hp-list">
                {entries.map((entry) => (
                  <div className="hp-card" key={entry.id}>
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

                    <div className="hp-card__middle">
                      <RiskBadge flags={entry.analysis?.risk_flags || []} />
                      <span className="hp-card__sections">
                        {entry.analysis?.clause_summaries?.length || 0} clauses &middot;&nbsp;
                        {entry.analysis?.key_terms?.length || 0} key terms
                      </span>
                    </div>

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
                        aria-label="Delete analysis"
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

      {/* Delete confirm dialog */}
      {deleteId && (
        <div className="hp-dialog-overlay" onClick={() => setDeleteId(null)}>
          <div className="hp-dialog" onClick={e => e.stopPropagation()}>
            <div className="hp-dialog__icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                <path d="M9 6V4h6v2"/>
              </svg>
            </div>
            <h3 className="hp-dialog__title">Delete this analysis?</h3>
            <p className="hp-dialog__body">
              This will permanently remove the saved insights. Your original lease file is never stored and is not affected.
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