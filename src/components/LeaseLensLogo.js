import React from 'react';

export function LeaseLensLogo({ size = 24, color = 'white', theme }) {
  // support legacy theme prop
  const mode = color || (theme === 'white' ? 'white' : 'brand');
  const isWhite = mode === 'white';

  const doc        = isWhite ? 'rgba(255,255,255,0.92)' : '#1e2d5e';
  const docFill    = isWhite ? 'rgba(255,255,255,0.1)'  : 'rgba(30,45,94,0.07)';
  const fold       = isWhite ? 'rgba(255,255,255,0.55)' : 'rgba(30,45,94,0.35)';
  const line1      = isWhite ? 'rgba(255,255,255,0.75)' : '#1e2d5e';
  const line2      = isWhite ? 'rgba(255,255,255,0.5)'  : '#4a6090';
  const line3      = isWhite ? 'rgba(255,255,255,0.35)' : '#7a90b8';
  const lensBg     = isWhite ? '#1e2d5e'                : '#1e2d5e';
  const lensRing   = '#D49E8D';
  const lensHandle = '#D49E8D';
  const lensOuter  = isWhite ? 'rgba(255,255,255,0.0)'  : 'rgba(0,0,0,0)';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Document body */}
      <rect
        x="1.5" y="1" width="13" height="17"
        rx="2"
        fill={docFill}
        stroke={doc}
        strokeWidth="1.25"
      />
      {/* Folded corner */}
      <path d="M10 1 L14.5 5.5 L10 5.5 Z" fill={fold} stroke="none" />
      <path
        d="M10 1 L10 5.5 L14.5 5.5"
        stroke={fold}
        strokeWidth="1.1"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Text lines */}
      <rect x="4" y="8.5"  width="5"   height="1.1" rx="0.55" fill={line1}/>
      <rect x="4" y="11"   width="7.5" height="1.1" rx="0.55" fill={line2}/>
      <rect x="4" y="13.5" width="4.5" height="1.1" rx="0.55" fill={line3}/>
      {/* Magnifier bg */}
      <circle cx="17.5" cy="17.5" r="5.5" fill={lensBg}/>
      <circle cx="17.5" cy="17.5" r="5.5" stroke={lensOuter} strokeWidth="1.1" fill="none"/>
      {/* Magnifier ring */}
      <circle cx="17.5" cy="17.5" r="3" stroke={lensRing} strokeWidth="1.3" fill="none"/>
      {/* Handle */}
      <line
        x1="19.7" y1="19.7" x2="21.8" y2="21.8"
        stroke={lensHandle}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default LeaseLensLogo;