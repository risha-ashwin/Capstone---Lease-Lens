import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Document, Page, pdfjs } from 'react-pdf';
import Navbar from '../components/Navbar';
import { clearAnalysisData, loadAnalysisData, saveAnalysisData, slugifyClauseTitle } from '../utils/analysisStorage';
import { saveToHistory } from './MyLeases';
import './Analysis.css';


pdfjs.GlobalWorkerOptions.workerSrc =
  `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';

const escapeRegExp = (value = '') => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const normalizeText = (value = '') => value.replace(/\s+/g, ' ').trim().toLowerCase();
const isRealAnalysis = (data) => data?.source === 'gemini';

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
      { title: 'Late Fees', summary: 'The lease charges a penalty if rent is not paid on time.', lease_quote: '"Late fees may be charged if rent is not received by the due date."', why_it_matters: 'Missing the due date increases the total you owe.', risk_level: 'medium' },
      { title: 'Renewal', summary: 'The lease may automatically continue unless proper notice is given.', lease_quote: '"This lease may renew or continue unless proper written notice is given."', why_it_matters: 'You could stay financially responsible longer than expected.', risk_level: 'high' },
      { title: 'Security Deposit', summary: 'A deposit is required upfront and returned under specific conditions.', lease_quote: '"The security deposit may be applied to unpaid amounts or damages beyond normal wear and tear."', why_it_matters: 'Deductions may be taken for damages beyond normal wear.', risk_level: 'medium' },
      { title: 'Maintenance', summary: 'Tenant is responsible for minor repairs under a certain cost threshold.', lease_quote: '"Resident is responsible for certain minor repair or maintenance costs under this agreement."', why_it_matters: 'Unexpected costs can arise if not understood upfront.', risk_level: 'low' },
    ],
    key_terms: [
      { term: 'Security Deposit', value: 'See lease', plain_english: 'An upfront amount you may get back if the unit is left in good condition.' },
      { term: 'Monthly Rent', value: '$1,450 / mo', plain_english: 'The base amount due each month before any fees or utilities.' },
      { term: 'Lease Duration', value: '12 months', plain_english: 'You are financially responsible for this full period.' },
      { term: 'Late Fee', value: '$75 after 5 days', plain_english: 'A penalty charged if rent is not received within 5 days of the due date.' },
      { term: 'Notice to Vacate', value: '30 days written', plain_english: 'You must give written notice 30 days before moving out.' },
    ],
    top_10_things: [
      'Check the lease end date and renewal terms carefully.',
      'Understand how much notice is required before moving out.',
      'Look for all late fees and when they apply.',
      'Confirm your total monthly cost including utilities.',
      'Review auto-renewal language to avoid being locked in.',
      'Check who is responsible for utilities and repairs.',
      'Review maintenance and repair responsibilities.',
      'Understand the subletting rules before making plans.',
      'Know the exact conditions for deposit return.',
      'Check for any additional monthly or one-time fees.'
    ],
    risk_flags: [
      { flag: 'Automatic renewal language may apply.', severity: 'high' },
      { flag: 'Late fees begin within 5 days of due date.', severity: 'medium' },
    ]
  }
});

// PDF generation

const loadJsPDF = () =>
  new Promise((resolve, reject) => {
    if (window.jspdf) { resolve(window.jspdf.jsPDF); return; }
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
    script.onload = () => resolve(window.jspdf.jsPDF);
    script.onerror = reject;
    document.head.appendChild(script);
  });

const C = {
  blue: [30, 45, 94], blueDark: [22, 35, 80], blueDeep: [15, 26, 61],
  green: [212, 158, 141], ink: [31, 41, 55], gray: [74, 85, 104],
  grayLight: [226, 232, 240], offWhite: [245, 247, 252], white: [255, 255, 255],
  rHigh: [180, 35, 24], rHighBg: [254, 243, 242],
  rMed: [181, 71, 8], rMedBg: [255, 250, 235],
  rLow: [6, 118, 71], rLowBg: [236, 253, 243],
};

const riskColors = (level) => {
  if (level === 'high')   return { fg: C.rHigh, bg: C.rHighBg };
  if (level === 'medium') return { fg: C.rMed,  bg: C.rMedBg  };
  return                         { fg: C.rLow,  bg: C.rLowBg  };
};

const PW = 210, PH = 297, M = 18, CW = PW - M * 2;
const FOOTER_Y = PH - 12, SAFE_BOTTOM = PH - 22;

function buildPDF(jsPDF, analysisData) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const data = analysisData.analysis;
  const fileName = analysisData.fileName || 'Lease Document';
  const dateStr = analysisData.processedAt
    ? new Date(analysisData.processedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : new Date().toLocaleDateString();
  let y = 0, pg = 1;

  const sectionPages = {};

  const newPage = () => { renderFooter(); doc.addPage(); pg++; y = 0; renderPageHeader(); };
  const need = (h) => { if (y + h > SAFE_BOTTOM) newPage(); };

  const renderFooter = () => {
    doc.setFillColor(...C.offWhite);
    doc.rect(0, FOOTER_Y - 2, PW, PH - FOOTER_Y + 2, 'F');
    doc.setDrawColor(...C.grayLight); doc.setLineWidth(0.25);
    doc.line(M, FOOTER_Y - 2, PW - M, FOOTER_Y - 2);
    doc.setFont('helvetica', 'normal'); doc.setFontSize(7); doc.setTextColor(...C.gray);
    doc.text('Lease Lens  |  AI-Powered Lease Analysis', M, FOOTER_Y + 3);
    doc.text('For informational purposes only. Not legal advice.', PW / 2, FOOTER_Y + 3, { align: 'center' });
    doc.text(String(pg), PW - M, FOOTER_Y + 3, { align: 'right' });
  };

  const renderPageHeader = () => {
    doc.setFillColor(...C.blue); doc.rect(0, 0, PW, 8, 'F');
    doc.setFont('helvetica', 'bold'); doc.setFontSize(7); doc.setTextColor(...C.white);
    doc.text('LEASE LENS', M, 5.5); doc.text(fileName, PW - M, 5.5, { align: 'right' });
    y = 16;
  };

  const sectionHeading = (label, sectionKey) => {
    need(14);
    if (sectionKey) sectionPages[sectionKey] = pg;
    doc.setFillColor(...C.blue); doc.roundedRect(M, y, CW, 8.5, 1, 1, 'F');
    doc.setFillColor(...C.green); doc.rect(M, y, 2, 8.5, 'F');
    doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.setTextColor(...C.white);
    doc.text(label.toUpperCase(), M + 7, y + 5.7);
    y += 12;
  };

  const keyTermRow = (term, value, plainEnglish, zebra) => {
    const labelLines = doc.splitTextToSize(term, CW * 0.38);
    const valueLines = doc.splitTextToSize(String(value), CW * 0.52);
    const peLines    = doc.splitTextToSize(plainEnglish, CW * 0.52);
    const leftH  = labelLines.length * 4.8;
    const rightH = valueLines.length * 4.8 + 2 + peLines.length * 4.2;
    const rowH   = Math.max(leftH, rightH) + 8;
    need(rowH + 2);

    doc.setFillColor(...(zebra ? C.offWhite : C.white));
    doc.rect(M, y, CW, rowH, 'F');
    doc.setDrawColor(...C.grayLight); doc.setLineWidth(0.2);
    doc.rect(M, y, CW, rowH, 'S');
    doc.line(M + CW * 0.42, y, M + CW * 0.42, y + rowH);

    doc.setFont('helvetica', 'bold'); doc.setFontSize(8.5); doc.setTextColor(...C.blue);
    let lY = y + 5.5;
    labelLines.forEach(ln => { doc.text(ln, M + 4, lY); lY += 4.8; });

    const rX = M + CW * 0.44;
    let rY = y + 5.5;
    doc.setFont('helvetica', 'bold'); doc.setFontSize(8.5); doc.setTextColor(...C.ink);
    valueLines.forEach(ln => { doc.text(ln, rX, rY); rY += 4.8; });

    rY += 1;
    doc.setFont('helvetica', 'italic'); doc.setFontSize(7.5); doc.setTextColor(...C.gray);
    peLines.forEach(ln => { doc.text(ln, rX, rY); rY += 4.2; });

    y += rowH;
  };

  const infoRow = (label, value, zebra) => {
    const labelLines = doc.splitTextToSize(String(label), CW * 0.38);
    const valLines   = doc.splitTextToSize(String(value),  CW * 0.52);
    const rowH = Math.max(labelLines.length, valLines.length) * 4.8 + 7;
    need(rowH + 1);

    doc.setFillColor(...(zebra ? C.offWhite : C.white));
    doc.rect(M, y, CW, rowH, 'F');
    doc.setDrawColor(...C.grayLight); doc.setLineWidth(0.2);
    doc.rect(M, y, CW, rowH, 'S');
    doc.line(M + CW * 0.42, y, M + CW * 0.42, y + rowH);

    doc.setFont('helvetica', 'bold'); doc.setFontSize(8.5); doc.setTextColor(...C.blue);
    let lY = y + 5.5;
    labelLines.forEach(ln => { doc.text(ln, M + 4, lY); lY += 4.8; });

    doc.setFont('helvetica', 'normal'); doc.setFontSize(8.5); doc.setTextColor(...C.ink);
    let vY = y + 5.5;
    valLines.forEach(ln => { doc.text(ln, M + CW * 0.44, vY); vY += 4.8; });

    y += rowH;
  };

  const severityBadge = (level, bx, by) => {
    const col = riskColors(level); const bw = 20, bh = 5;
    doc.setFillColor(...col.bg); doc.roundedRect(bx, by - 3.8, bw, bh, 1.2, 1.2, 'F');
    doc.setFont('helvetica', 'bold'); doc.setFontSize(6); doc.setTextColor(...col.fg);
    doc.text(level.toUpperCase(), bx + bw / 2, by, { align: 'center' });
  };

  const clauseCard = (clause) => {
    const titleLines = doc.splitTextToSize(clause.title, CW - 35);
    const sumLines   = doc.splitTextToSize(clause.summary, CW - 14);
    const whyLines   = doc.splitTextToSize(clause.why_it_matters, CW - 14);
    const titleH = titleLines.length * 5.5;
    const sumH   = sumLines.length * 4.8;
    const whyH   = whyLines.length * 4.5;
    const cardH  = titleH + sumH + whyH + 22;
    need(cardH + 4);

    const col = riskColors(clause.risk_level);
    doc.setFillColor(...C.white); doc.setDrawColor(...C.grayLight); doc.setLineWidth(0.3);
    doc.roundedRect(M, y, CW, cardH, 1.5, 1.5, 'FD');
    doc.setFillColor(...col.fg); doc.rect(M, y, 3, cardH, 'F');

    let cy = y + 6;
    doc.setFont('helvetica', 'bold'); doc.setFontSize(9.5); doc.setTextColor(...C.ink);
    titleLines.forEach(ln => { doc.text(ln, M + 8, cy); cy += 5.5; });
    severityBadge(clause.risk_level, M + CW - 24, y + 6);

    cy += 1;
    doc.setDrawColor(...C.grayLight); doc.setLineWidth(0.2);
    doc.line(M + 8, cy, M + CW - 4, cy); cy += 4;

    doc.setFont('helvetica', 'normal'); doc.setFontSize(8.5); doc.setTextColor(...C.ink);
    sumLines.forEach(ln => { doc.text(ln, M + 8, cy); cy += 4.8; });
    cy += 2;

    doc.setFont('helvetica', 'bold'); doc.setFontSize(7.5); doc.setTextColor(...C.blue);
    doc.text('WHY IT MATTERS', M + 8, cy); cy += 5;

    doc.setFont('helvetica', 'normal'); doc.setFontSize(8); doc.setTextColor(...C.gray);
    whyLines.forEach(ln => { doc.text(ln, M + 8, cy); cy += 4.5; });

    y += cardH + 4;
  };

  const riskRow = (flag, severity, idx) => {
    const col = riskColors(severity);
    const lines = doc.splitTextToSize(flag, CW - 34);
    const rh = lines.length * 4.8 + 8;
    need(rh + 2);

    doc.setFillColor(...(idx % 2 === 0 ? col.bg : C.white));
    doc.roundedRect(M, y, CW, rh, 1, 1, 'F');
    doc.setFillColor(...col.fg); doc.rect(M, y, 3, rh, 'F');
    severityBadge(severity, M + CW - 24, y + rh / 2 + 1);

    doc.setFont('helvetica', 'normal'); doc.setFontSize(8.5); doc.setTextColor(...C.ink);
    let ry = y + 5.5;
    lines.forEach(ln => { doc.text(ln, M + 8, ry); ry += 4.8; });
    y += rh + 2;
  };

  // COVER PAGE
  doc.setFillColor(...C.blue); doc.rect(0, 0, PW, PH, 'F');
  doc.setFillColor(...C.white);
  for (let gx = 10; gx < PW; gx += 14) for (let gy = 10; gy < PH; gy += 14) doc.circle(gx, gy, 0.35, 'F');
  doc.setDrawColor(...C.green); doc.setLineWidth(6); doc.circle(PW + 15, -15, 75, 'S');
  doc.setLineWidth(1.5); doc.circle(PW + 15, -15, 92, 'S');
  doc.setFillColor(...C.blueDeep); doc.rect(0, PH - 48, PW, 48, 'F');
  doc.setFillColor(...C.green); doc.rect(0, PH - 48, PW, 1.2, 'F');
  doc.setFont('helvetica', 'bold'); doc.setFontSize(8); doc.setTextColor(...C.green);
  doc.text('LEASE LENS', M, 22);
  doc.setFont('helvetica', 'normal'); doc.setFontSize(7.5); doc.setTextColor(...C.white);
  doc.text('AI-Powered Lease Analysis', M, 28);
  doc.setFont('helvetica', 'bold'); doc.setFontSize(36); doc.setTextColor(...C.white);
  doc.text('LEASE', M, 72); doc.text('ANALYSIS', M, 88); doc.text('REPORT', M, 104);
  doc.setFillColor(...C.green); doc.rect(M, 108, 72, 1.5, 'F');
  doc.setFont('helvetica', 'normal'); doc.setFontSize(10); doc.setTextColor(...C.white);
  doc.text(fileName, M, 118);
  doc.setFontSize(8.5); doc.setTextColor(200, 210, 240);
  doc.text('Generated  ' + dateStr, M, 126);
  doc.setDrawColor(...C.white); doc.setLineWidth(0.3); doc.line(M, 133, PW - M, 133);

  const rf = data.risk_flags || [];
  const pillDefs = [
    { label: rf.filter(f => f.severity === 'high').length   + '  HIGH RISK',   fg: C.rHigh, bg: C.rHighBg },
    { label: rf.filter(f => f.severity === 'medium').length + '  MEDIUM RISK', fg: C.rMed,  bg: C.rMedBg  },
    { label: rf.filter(f => f.severity === 'low').length    + '  LOW RISK',    fg: C.rLow,  bg: C.rLowBg  },
  ];
  let px = M;
  pillDefs.forEach(p => {
    doc.setFillColor(...p.bg); doc.roundedRect(px, 138, 46, 8, 2, 2, 'F');
    doc.setFont('helvetica', 'bold'); doc.setFontSize(7); doc.setTextColor(...p.fg);
    doc.text(p.label, px + 23, 143.4, { align: 'center' }); px += 50;
  });

  doc.setFillColor(...C.blueDeep); doc.roundedRect(M, 156, CW, 48, 2, 2, 'F');
  doc.setFillColor(...C.green); doc.rect(M, 156, 2.5, 48, 'F');
  doc.setFont('helvetica', 'bold'); doc.setFontSize(7.5); doc.setTextColor(...C.green);
  doc.text('SUMMARY', M + 7, 163);
  doc.setFont('helvetica', 'normal'); doc.setFontSize(8.5); doc.setTextColor(220, 228, 255);
  const tlLines = doc.splitTextToSize(data.overview && data.overview.tldr ? data.overview.tldr : '', CW - 14);
  let tlY = 169; tlLines.slice(0, 8).forEach(ln => { doc.text(ln, M + 7, tlY); tlY += 5; });

  const parties = (data.overview && data.overview.parties) ? data.overview.parties : [];
  if (parties.length) {
    doc.setFont('helvetica', 'bold'); doc.setFontSize(7.5); doc.setTextColor(...C.green);
    doc.text('PARTIES', M, 214);
    doc.setFont('helvetica', 'normal'); doc.setFontSize(8); doc.setTextColor(200, 212, 245);
    parties.forEach((p, i) => { doc.text(p, M + 4, 221 + i * 5.5); });
  }
  doc.setFont('helvetica', 'normal'); doc.setFontSize(6.5); doc.setTextColor(160, 175, 210);
  doc.text('This report is generated by AI for informational purposes only and does not constitute legal advice.', PW / 2, PH - 10, { align: 'center' });

  doc.addPage(); pg++;
  const tocPageIndex = pg;

  doc.addPage(); pg++; renderPageHeader();

  sectionHeading('01  Lease Overview', 'overview');
  infoRow('Lease Type',        (data.overview && data.overview.lease_type)        || 'Not stated', true);
  infoRow('Term',              (data.overview && data.overview.term_summary)       || 'Not stated', false);
  infoRow('Financial Summary', (data.overview && data.overview.financial_summary)  || 'Not stated', true);
  y += 8;

  sectionHeading('02  Risk Flags', 'riskflags');
  if (!rf.length) {
    doc.setFont('helvetica', 'normal'); doc.setFontSize(8.5); doc.setTextColor(...C.gray);
    need(6); doc.text('No risk flags were identified in this lease.', M, y); y += 6;
  } else { rf.forEach((f, i) => riskRow(f.flag, f.severity, i)); }
  y += 8;

  sectionHeading('03  Key Terms', 'keyterms');
  (data.key_terms || []).forEach((kt, i) => {
    keyTermRow(kt.term, kt.value, kt.plain_english, i % 2 === 0);
    y += 2;
  });
  y += 8;

  sectionHeading('04  Top 10 Things to Know Before Signing', 'top10');
  (data.top_10_things || []).forEach((item, i) => {
    const lines = doc.splitTextToSize(item, CW - 18);
    const rh = lines.length * 4.8 + 8; need(rh + 2);
    doc.setFillColor(...(i % 2 === 0 ? C.offWhite : C.white));
    doc.roundedRect(M, y, CW, rh, 1, 1, 'F');
    doc.setFillColor(...C.blue); doc.circle(M + 7, y + rh / 2, 4, 'F');
    doc.setFont('helvetica', 'bold'); doc.setFontSize(7); doc.setTextColor(...C.white);
    doc.text(String(i + 1), M + 7, y + rh / 2 + 2.5, { align: 'center' });
    doc.setFont('helvetica', 'normal'); doc.setFontSize(8.5); doc.setTextColor(...C.ink);
    let ly = y + 5.5; lines.forEach(ln => { doc.text(ln, M + 16, ly); ly += 4.8; });
    y += rh + 2;
  });
  y += 8;

  sectionHeading('05  Clause Summaries', 'clauses');
  (data.clause_summaries || []).forEach(cl => clauseCard(cl));

  renderFooter();

  doc.setPage(tocPageIndex);
  doc.setFillColor(...C.white); doc.rect(0, 0, PW, PH, 'F');
  doc.setFillColor(...C.blue); doc.rect(0, 0, PW, 8, 'F');
  doc.setFont('helvetica', 'bold'); doc.setFontSize(7); doc.setTextColor(...C.white);
  doc.text('LEASE LENS', M, 5.5); doc.text(fileName, PW - M, 5.5, { align: 'right' });

  let ty = 22;
  doc.setFont('helvetica', 'bold'); doc.setFontSize(18); doc.setTextColor(...C.blue);
  doc.text('TABLE OF CONTENTS', M, ty); ty += 3;
  doc.setFillColor(...C.green); doc.rect(M, ty, 52, 1.2, 'F'); ty += 9;
  doc.setFont('helvetica', 'normal'); doc.setFontSize(8); doc.setTextColor(...C.gray);
  doc.text('Navigate to any section using the page numbers on the right.', M, ty); ty += 10;

  const tocSections = [
    { num: '01', title: 'Lease Overview',        desc: 'Lease type, term, and financial summary',          key: 'overview'  },
    { num: '02', title: 'Risk Flags',            desc: 'Identified risks ranked by severity',              key: 'riskflags' },
    { num: '03', title: 'Key Terms',             desc: 'Important terms with plain-language explanations', key: 'keyterms'  },
    { num: '04', title: 'Top 10 Things to Know', desc: 'Critical points to review before signing',         key: 'top10'     },
    { num: '05', title: 'Clause Summaries',      desc: 'Detailed review of each lease clause',             key: 'clauses'   },
  ];

  tocSections.forEach((sec, i) => {
    const rowY = ty;
    doc.setFillColor(...(i % 2 === 0 ? C.offWhite : C.white));
    doc.roundedRect(M, rowY, CW, 15, 1, 1, 'F');

    doc.setFillColor(...C.blue);
    doc.roundedRect(M + 3, rowY + 3, 11, 9, 1.5, 1.5, 'F');
    doc.setFont('helvetica', 'bold'); doc.setFontSize(7.5); doc.setTextColor(...C.white);
    doc.text(sec.num, M + 8.5, rowY + 9, { align: 'center' });

    doc.setFont('helvetica', 'bold'); doc.setFontSize(9.5); doc.setTextColor(...C.ink);
    doc.text(sec.title, M + 18, rowY + 7);

    doc.setFont('helvetica', 'normal'); doc.setFontSize(7.5); doc.setTextColor(...C.gray);
    doc.text(sec.desc, M + 18, rowY + 12.5);

    const secPage = sectionPages[sec.key] || '—';
    const pgBadgeW = 12;
    doc.setFillColor(...C.blue);
    doc.roundedRect(PW - M - pgBadgeW, rowY + 3, pgBadgeW, 9, 1.5, 1.5, 'F');
    doc.setFont('helvetica', 'bold'); doc.setFontSize(8); doc.setTextColor(...C.white);
    doc.text(String(secPage), PW - M - pgBadgeW / 2, rowY + 9, { align: 'center' });

    doc.setFillColor(200, 210, 230);
    const titleW = doc.getTextWidth(sec.title);
    const lx1 = M + 18 + titleW + 3, lx2 = PW - M - pgBadgeW - 3;
    for (let lx = lx1; lx < lx2; lx += 2.5) doc.circle(lx, rowY + 7, 0.25, 'F');

    ty += 17;
  });

  ty += 6;
  doc.setFillColor(...C.offWhite); doc.roundedRect(M, ty, CW, 12, 1, 1, 'F');
  doc.setFillColor(...C.green); doc.rect(M, ty, 2.5, 12, 'F');
  doc.setFont('helvetica', 'normal'); doc.setFontSize(7.5); doc.setTextColor(...C.gray);
  const disclaimerLines = doc.splitTextToSize(
    'All analysis is derived from the uploaded lease document. Review the original for full legal context.',
    CW - 12
  );
  disclaimerLines.forEach((ln, i) => { doc.text(ln, M + 7, ty + 5 + i * 4.5); });

  doc.setFillColor(...C.offWhite); doc.rect(0, FOOTER_Y - 2, PW, PH - FOOTER_Y + 2, 'F');
  doc.setDrawColor(...C.grayLight); doc.setLineWidth(0.25); doc.line(M, FOOTER_Y - 2, PW - M, FOOTER_Y - 2);
  doc.setFont('helvetica', 'normal'); doc.setFontSize(7); doc.setTextColor(...C.gray);
  doc.text('Lease Lens  |  AI-Powered Lease Analysis', M, FOOTER_Y + 3);
  doc.text('For informational purposes only. Not legal advice.', PW / 2, FOOTER_Y + 3, { align: 'center' });
  doc.text(String(tocPageIndex), PW - M, FOOTER_Y + 3, { align: 'right' });

  return doc;
}

// React component

function Analysis() {
  const location  = useLocation();
  const navigate  = useNavigate();
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState('');
  const [file, setFile]                 = useState(null);
  const [numPages, setNumPages]         = useState(null);
  const [pageNumber, setPageNumber]     = useState(1);
  const [usingDemoData, setUsingDemoData]   = useState(false);
  const [fallbackReason, setFallbackReason] = useState('');
  const [pdfError, setPdfError]         = useState('');
  const [downloading, setDownloading]   = useState(false);
  const [savedTick, setSavedTick]       = useState(0);
  const [pdfDocument, setPdfDocument]   = useState(null);
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [termSearchMessage, setTermSearchMessage] = useState('');
  const [searchingTerm, setSearchingTerm] = useState(false);
  const reuploadInputRef = useRef(null);
  const previewPageRef = useRef(null);
  const [pdfPageWidth, setPdfPageWidth] = useState(390);

  useEffect(() => {
    if (!previewPageRef.current) return undefined;

    const updateWidth = () => {
      const nextWidth = Math.max(280, Math.min(520, previewPageRef.current?.clientWidth - 24 || 390));
      setPdfPageWidth(nextWidth);
    };

    updateWidth();

    const observer = new ResizeObserver(() => updateWidth());
    observer.observe(previewPageRef.current);
    window.addEventListener('resize', updateWidth);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateWidth);
    };
  }, []);

  useEffect(() => {
    const uploadedFile = location.state?.file;
    const hasFreshUpload = uploadedFile instanceof File;
    const routeAnalysis = location.state?.analysisData || null;
    const cachedAnalysis = loadAnalysisData();

    // Detect if this was opened from My Leases and persist that flag
    if (routeAnalysis && !hasFreshUpload && uploadedFile === null) {
      sessionStorage.setItem('leaseLensFromMyLeases', 'true');
      sessionStorage.removeItem('leaseLensFileUrl');
    } else if (hasFreshUpload) {
      sessionStorage.removeItem('leaseLensFromMyLeases');
    }

    const savedAnalysis = routeAnalysis || (!hasFreshUpload && isRealAnalysis(cachedAnalysis) ? cachedAnalysis : null);

    if (savedAnalysis && !hasFreshUpload) {
      setAnalysisData(savedAnalysis);
      setUsingDemoData(savedAnalysis.source === 'mock');
      setFallbackReason('');
      setError('');
      setLoading(false);
      // Restore file URL from sessionStorage if returning from a sub-page
      const storedFileUrl = sessionStorage.getItem('leaseLensFileUrl');
      const resolvedFile = (typeof uploadedFile === 'string' && uploadedFile) || storedFileUrl || null;
      setFile(resolvedFile);
      setSelectedTerm(null);
      setPdfDocument(null);
      setPdfError('');
      setNumPages(null);
      setPageNumber(1);
      return undefined;
    }

    if (!uploadedFile) {
      setError('No lease file provided. Please upload a lease first.');
      setLoading(false);
      return undefined;
    }

    let fileUrl = null;
    if (uploadedFile instanceof File) {
      fileUrl = URL.createObjectURL(uploadedFile);
      // Persist the blob URL so it survives sub-page navigation within the session
      sessionStorage.setItem('leaseLensFileUrl', fileUrl);
      setFile(fileUrl);
    } else {
      fileUrl = uploadedFile;
      setFile(fileUrl);
    }
    setPdfError(''); setPageNumber(1); setNumPages(null); setPdfDocument(null); setSelectedTerm(null); setTermSearchMessage('');

    const run = async () => {
      try {
        setLoading(true); setFallbackReason('');
        const fd = new FormData(); fd.append('file', uploadedFile);
        const res = await fetch(API_BASE_URL + '/api/analyze-lease', { method: 'POST', body: fd });
        if (!res.ok) {
          let msg = 'API returned ' + res.status;
          try { const ep = await res.json(); if (ep && ep.details) msg = ep.details; else if (ep && ep.error) msg = ep.error; } catch (_err) {}
          throw new Error(msg);
        }
        const d = await res.json();
        setAnalysisData(d);
        setUsingDemoData(d.source === 'mock');
        if (isRealAnalysis(d)) saveAnalysisData(d);
        else clearAnalysisData();
      } catch (err) {
        const demo = buildDemoAnalysis(uploadedFile);
        clearAnalysisData();
        setUsingDemoData(true); setFallbackReason(err.message || 'Unknown error.');
        setAnalysisData(demo); console.warn('Demo fallback:', err);
      } finally { setLoading(false); }
    };

    run();
    return undefined;
  }, [location.state]);

  const handleSaveToHistory = () => {
    if (!analysisData || saved || !savedKey) return;
    saveToHistory(analysisData);
    sessionStorage.setItem(savedKey, 'true');
    setSavedTick(t => t + 1);
  };

  const handleDownloadPDF = async () => {
    if (!analysisData) return;
    setDownloading(true);
    try {
      const jsPDF = await loadJsPDF();
      const doc = buildPDF(jsPDF, analysisData);
      const safe = (analysisData.fileName || 'lease').replace(/\.pdf$/i, '').replace(/[^a-z0-9_-]/gi, '_');
      doc.save('LeaseLens_Report_' + safe + '.pdf');
    } catch (err) { console.error('PDF error:', err); alert('PDF generation failed. Please try again.'); }
    finally { setDownloading(false); }
  };

  const handleReuploadOriginal = (event) => {
    const selectedFile = event.target.files && event.target.files[0];
    if (!selectedFile) return;

    if (selectedFile.type !== 'application/pdf') {
      setPdfError('Only PDF files can be previewed.');
      event.target.value = '';
      return;
    }

    const fileUrl = URL.createObjectURL(selectedFile);
    sessionStorage.setItem('leaseLensFileUrl', fileUrl);
    setFile(fileUrl);
    setPdfError('');
    setPageNumber(1);
    setNumPages(null);
    setPdfDocument(null);
    setSelectedTerm(null);
    setTermSearchMessage('PDF preview restored. Select a key term to find it in the document.');
    event.target.value = '';
  };

  const handleRefresh = () => {
    clearAnalysisData();
    sessionStorage.removeItem('leaseLensFileUrl');
    sessionStorage.removeItem('leaseLensFromMyLeases');
    if (savedKey) sessionStorage.removeItem(savedKey);
    setAnalysisData(null);
    setFallbackReason('');
    setError('');
    setLoading(true);
    setTimeout(() => { navigate('/upload'); }, 100);
  };

  const analysis        = analysisData && analysisData.analysis;
  const riskFlags       = (analysis && analysis.risk_flags) || [];
  const highRiskCount   = riskFlags.filter(f => f.severity === 'high').length;
  const mediumRiskCount = riskFlags.filter(f => f.severity === 'medium').length;
  const clauses         = (analysis && analysis.clause_summaries) || [];
  const keyTerms        = (analysis && analysis.key_terms) || [];
  const top10           = (analysis && analysis.top_10_things) || [];
  const visibleRiskFlags = riskFlags.slice(0, 3);
  const sharedRouteState = { analysisData, file };

  // True when opened from My Leases — persisted in sessionStorage so it survives sub-page nav
  const isFromMyLeases = sessionStorage.getItem('leaseLensFromMyLeases') === 'true';

  // Persist saved state in sessionStorage so it survives sub-page navigation
  // savedTick is incremented on save to trigger a re-render and re-read sessionStorage
  const savedKey = analysisData ? 'leaseLensSaved_' + (analysisData.fileName || 'lease') : null;
  const saved = savedTick >= 0 && savedKey ? sessionStorage.getItem(savedKey) === 'true' : false;
  const hasDocumentPreview = Boolean(file);
  const showSavedLeaseLayout = isFromMyLeases && !hasDocumentPreview;
  const showPreviewTwoColumnLayout = hasDocumentPreview;

  const goToClauses = (clause) => {
    const path = clause ? '/analysis/clauses/' + slugifyClauseTitle(clause.title) : '/analysis/clauses';
    navigate(path, { state: { analysisData, file, selectedClauseTitle: clause ? clause.title : null } });
  };

  const handleTermClick = async (termItem) => {
    setSelectedTerm(termItem.term);
    setTermSearchMessage('');

    if (!pdfDocument) {
      setTermSearchMessage(hasDocumentPreview ? 'Document preview is still loading.' : 'Upload the original PDF to search terms in the document preview.');
      return;
    }

    setSearchingTerm(true);

    try {
      const query = normalizeText(termItem.term);
      let matchedPage = null;

      for (let pageIndex = 1; pageIndex <= pdfDocument.numPages; pageIndex += 1) {
        const page = await pdfDocument.getPage(pageIndex);
        const textContent = await page.getTextContent();
        const pageText = normalizeText(textContent.items.map((item) => item.str).join(' '));

        if (pageText.includes(query)) {
          matchedPage = pageIndex;
          break;
        }
      }

      if (matchedPage) {
        setPageNumber(matchedPage);
        setTermSearchMessage(`Highlighted "${termItem.term}" on page ${matchedPage}.`);
      } else {
        setTermSearchMessage(`Couldn't find "${termItem.term}" in the preview text.`);
      }
    } catch (searchError) {
      console.error('Term search failed:', searchError);
      setTermSearchMessage('Unable to search the PDF text on this document.');
    } finally {
      setSearchingTerm(false);
    }
  };

  const renderHighlightedText = ({ str }) => {
    if (!selectedTerm) return str;

    const pattern = new RegExp(`(${escapeRegExp(selectedTerm)})`, 'ig');
    if (!pattern.test(str)) return str;

    pattern.lastIndex = 0;
    return str.replace(pattern, '<mark class="pdf-text-highlight">$1</mark>');
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
          <button className="btn btn--blue" onClick={() => navigate('/upload')}>Back to Upload</button>
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
          <div className="loading"><div className="spinner" /><p>Analyzing your lease...</p></div>
        ) : (
          <>
            {usingDemoData && (
              <div className="demo-banner">
                Gemini analysis is unavailable right now — demo data is shown.
                {fallbackReason && <div className="demo-banner__details"><strong>Reason:</strong> {fallbackReason}</div>}
                <div className="demo-banner__details"><strong>API URL:</strong> {API_BASE_URL}/api/analyze-lease</div>
              </div>
            )}

            <div className="download-bar">
              <div className="download-bar__info">
                <span className="download-bar__check">&#10003;</span>
                <div>
                  <span className="download-bar__title">Analysis complete</span>
                  <span className="download-bar__sub">
                    {(analysisData && analysisData.fileName) || 'Your lease'} &mdash; ready to export
                  </span>
                </div>
              </div>

              <div className="download-bar__actions">
                {isFromMyLeases && (
                  <>
                    <input
                      ref={reuploadInputRef}
                      type="file"
                      accept="application/pdf"
                      onChange={handleReuploadOriginal}
                      className="reupload-input"
                    />
                    <button
                      className="reupload-btn"
                      onClick={() => reuploadInputRef.current?.click()}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="17 8 12 3 7 8"/>
                        <line x1="12" y1="3" x2="12" y2="15"/>
                      </svg>
                      {hasDocumentPreview ? 'Replace PDF' : 'Upload Original PDF'}
                    </button>
                  </>
                )}
                {/* Save to History — hidden when viewing from My Leases */}
                {!isFromMyLeases && (
                  <button
                    className={'save-history-btn' + (saved ? ' save-history-btn--saved' : '')}
                    onClick={handleSaveToHistory}
                    disabled={saved}
                    title="Save insights to your History page"
                  >
                    {saved ? (
                      <>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                        Saved to History
                      </>
                    ) : (
                      <>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                          <polyline points="17 21 17 13 7 13 7 21"/>
                          <polyline points="7 3 7 8 15 8"/>
                        </svg>
                        Save to History
                      </>
                    )}
                  </button>
                )}

                {/* New Lease */}
                <button className="upload-btn upload-btn--cancel" onClick={handleRefresh}>
                  ↺ New Lease
                </button>

                {/* Download PDF */}
                <button
                  className={'download-btn' + (downloading ? ' download-btn--loading' : '')}
                  onClick={handleDownloadPDF}
                  disabled={downloading}
                >
                  {downloading ? (
                    <><span className="download-btn__spinner" />Generating PDF&hellip;</>
                  ) : (
                    <>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="7 10 12 15 17 10"/>
                        <line x1="12" y1="15" x2="12" y2="3"/>
                      </svg>
                      Download PDF Report
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="dashboard-stack">
              <div className="tldr-card">
                <div className="tldr-card__eyebrow">Overview</div>
                <p className="tldr-card__text">{analysis && analysis.overview && analysis.overview.tldr}</p>
                <div className="tldr-card__meta">
                  <div className="tldr-meta-item">
                    <span className="tldr-meta-label">Lease Type</span>
                    <span className="tldr-meta-value">{analysis && analysis.overview && analysis.overview.lease_type}</span>
                  </div>
                  <div className="tldr-meta-item">
                    <span className="tldr-meta-label">Risk</span>
                    <span className="tldr-meta-value">{highRiskCount} high &middot; {mediumRiskCount} medium</span>
                  </div>
                  <div className="tldr-meta-item">
                    <span className="tldr-meta-label">Term</span>
                    <span className="tldr-meta-value">{analysis && analysis.overview && analysis.overview.term_summary}</span>
                  </div>
                  {analysis?.overview?.parties?.length > 0 && (
                    <div className="tldr-meta-item">
                      <span className="tldr-meta-label">Parties</span>
                      {analysis.overview.parties.map((party, idx) => (
                        <div key={idx} className="tldr-meta-value">{party}</div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="dashboard-overview-grid">
                <div className="dash-panel">
                  <div className="dash-panel__header">
                    <h2 className="dash-panel__title">Top 10 Things to Know</h2>
                    <button className="dash-panel__link" onClick={() => navigate('/analysis/highlights', { state: sharedRouteState })}>
                      View all &rarr;
                    </button>
                  </div>
                  <ol className="top10-list">
                    {top10.slice(0, 4).map((item, idx) => (
                      <li key={idx} className="top10-item">
                        <span className="top10-item__num">{idx + 1}</span>
                        <span className="top10-item__text">{item}</span>
                      </li>
                    ))}
                  </ol>
                  {top10.length > 4 && (
                    <button className="see-all-btn" onClick={() => navigate('/analysis/highlights', { state: sharedRouteState })}>
                      View {top10.length - 4} more items &rarr;
                    </button>
                  )}
                </div>
              </div>

              <div className={showSavedLeaseLayout ? 'dashboard-saved-grid' : (showPreviewTwoColumnLayout ? 'dashboard-preview-grid' : 'dashboard-reading-grid')}>
                <div className={showPreviewTwoColumnLayout ? 'dashboard-left-stack' : 'dashboard-left-stack dashboard-left-stack--plain'}>
                <div className="dash-panel preview-terms-panel">
                  <div className="dash-panel__header">
                    <h2 className="dash-panel__title">Key Terms</h2>
                    {selectedTerm && <span className="dash-panel__badge">Selected</span>}
                  </div>
                  <div className="terms-preview-list">
                    {keyTerms.map((item, idx) => (
                      <button
                        key={idx}
                        type="button"
                        className={`term-row${selectedTerm === item.term ? ' term-row--active' : ''}`}
                        onClick={() => handleTermClick(item)}
                      >
                        <div className="term-row__top">
                          <span className="term-row__name">{item.term}</span>
                          <span className="term-row__value">{item.value}</span>
                        </div>
                        <span className="term-row__plain">{item.plain_english}</span>
                      </button>
                    ))}
                  </div>
                  <div className="term-search-status" aria-live="polite">
                    {searchingTerm
                      ? 'Searching document for the selected term...'
                      : (termSearchMessage || (hasDocumentPreview
                        ? 'Select a key term to highlight it in the document preview.'
                        : 'Upload the original PDF to search these terms in the preview.'))}
                  </div>
                </div>

                {showPreviewTwoColumnLayout && (
                  <>
                    <div className="dash-panel">
                      <div className="dash-panel__header">
                        <h2 className="dash-panel__title">Clause Summaries</h2>
                        <button className="dash-panel__link" onClick={() => goToClauses()}>
                          See all clauses &rarr;
                        </button>
                      </div>
                      <div className="clause-list">
                        {clauses.slice(0, 3).map((clause, idx) => (
                          <button key={idx} className="clause-row" onClick={() => goToClauses(clause)}>
                            <div className="clause-row__left">
                              <span className={'clause-row__bar clause-row__bar--' + clause.risk_level} />
                              <div className="clause-row__content">
                                <span className="clause-row__title">{clause.title}</span>
                                <span className="clause-row__summary">{clause.summary}</span>
                              </div>
                            </div>
                            <span className={'risk-pill risk-pill--' + clause.risk_level}>{clause.risk_level}</span>
                          </button>
                        ))}
                      </div>
                      {clauses.length > 3 && (
                        <button className="see-all-btn" onClick={() => goToClauses()}>
                          View all {clauses.length} clauses &rarr;
                        </button>
                      )}
                    </div>

                    {riskFlags.length > 0 && (
                      <div className="dash-panel">
                        <div className="dash-panel__header">
                          <h2 className="dash-panel__title">Risk Flags</h2>
                          <button className="dash-panel__link" onClick={() => navigate('/analysis/risks', { state: sharedRouteState })}>
                            See all risk flags &rarr;
                          </button>
                        </div>
                        <div className="risk-flag-list">
                          {visibleRiskFlags.map((f, i) => (
                            <div key={i} className={'risk-flag-row risk-flag-row--' + f.severity}>
                              <span className={'risk-dot risk-dot--' + f.severity} />
                              <span className="risk-flag-row__text">{f.flag}</span>
                              <span className={'risk-pill risk-pill--' + f.severity}>{f.severity}</span>
                            </div>
                          ))}
                        </div>
                        {riskFlags.length > visibleRiskFlags.length && (
                          <button className="see-all-btn" onClick={() => navigate('/analysis/risks', { state: sharedRouteState })}>
                            View all {riskFlags.length} risk flags &rarr;
                          </button>
                        )}
                      </div>
                    )}
                  </>
                )}
                </div>

                {!showSavedLeaseLayout && (
                <div className="preview-panel">
                  <div className="preview-panel__header">
                    <h2 className="dash-panel__title">Document Preview</h2>
                    {numPages && <span className="preview-panel__pager">{pageNumber} / {numPages}</span>}
                  </div>
                    {file ? (
                      <div className="pdf-viewer">
                        <div className="pdf-viewer__page" ref={previewPageRef}>
                          <Document
                            file={file}
                            onLoadSuccess={(pdf) => {
                              setPdfDocument(pdf);
                            setNumPages(pdf.numPages);
                            setPdfError('');
                          }}
                          onLoadError={(e) => {
                            setPdfError(e.message || 'Failed to load PDF.');
                            setPdfDocument(null);
                          }}
                          loading={<div className="pdf-loading">Loading document&hellip;</div>}
                          error={<div className="pdf-error">{pdfError || 'Failed to load PDF'}</div>}
                          >
                            <Page
                              pageNumber={pageNumber}
                              width={pdfPageWidth}
                              renderTextLayer
                              renderAnnotationLayer={false}
                              customTextRenderer={renderHighlightedText}
                            />
                        </Document>
                      </div>
                      <div className="pdf-controls">
                        <button className="pdf-nav-btn" onClick={() => setPageNumber(p => Math.max(1, p - 1))} disabled={pageNumber <= 1}>
                          &larr; Prev
                        </button>
                        <span className="pdf-page-label">Page {pageNumber} of {numPages || '?'}</span>
                        <button className="pdf-nav-btn" onClick={() => setPageNumber(p => Math.min(numPages || p, p + 1))} disabled={pageNumber >= numPages}>
                          Next &rarr;
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="pdf-placeholder">
                      {analysisData
                        ? 'Analysis restored. Upload the original PDF if you want the document preview back.'
                        : 'No document loaded'}
                    </div>
                  )}
                </div>
                )}
              </div>

              {!showPreviewTwoColumnLayout && (
              <div className="dashboard-lower-grid">
                <div className="dash-panel">
                  <div className="dash-panel__header">
                    <h2 className="dash-panel__title">Clause Summaries</h2>
                    <button className="dash-panel__link" onClick={() => goToClauses()}>
                      See all clauses &rarr;
                    </button>
                  </div>
                  <div className="clause-list">
                    {clauses.slice(0, 3).map((clause, idx) => (
                      <button key={idx} className="clause-row" onClick={() => goToClauses(clause)}>
                        <div className="clause-row__left">
                          <span className={'clause-row__bar clause-row__bar--' + clause.risk_level} />
                          <div className="clause-row__content">
                            <span className="clause-row__title">{clause.title}</span>
                            <span className="clause-row__summary">{clause.summary}</span>
                          </div>
                        </div>
                        <span className={'risk-pill risk-pill--' + clause.risk_level}>{clause.risk_level}</span>
                      </button>
                    ))}
                  </div>
                  {clauses.length > 3 && (
                    <button className="see-all-btn" onClick={() => goToClauses()}>
                      View all {clauses.length} clauses &rarr;
                    </button>
                  )}
                </div>

                {riskFlags.length > 0 && (
                  <div className="dash-panel">
                    <div className="dash-panel__header">
                      <h2 className="dash-panel__title">Risk Flags</h2>
                      <button className="dash-panel__link" onClick={() => navigate('/analysis/risks', { state: sharedRouteState })}>
                        See all risk flags &rarr;
                      </button>
                    </div>
                    <div className="risk-flag-list">
                      {visibleRiskFlags.map((f, i) => (
                        <div key={i} className={'risk-flag-row risk-flag-row--' + f.severity}>
                          <span className={'risk-dot risk-dot--' + f.severity} />
                          <span className="risk-flag-row__text">{f.flag}</span>
                          <span className={'risk-pill risk-pill--' + f.severity}>{f.severity}</span>
                        </div>
                      ))}
                    </div>
                    {riskFlags.length > visibleRiskFlags.length && (
                      <button className="see-all-btn" onClick={() => navigate('/analysis/risks', { state: sharedRouteState })}>
                        View all {riskFlags.length} risk flags &rarr;
                      </button>
                    )}
                  </div>
                )}
              </div>
              )}
            </div>
          </>
        )}
      </section>
    </div>
  );
}

export default Analysis;
