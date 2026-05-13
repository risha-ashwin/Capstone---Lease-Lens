import React from 'react';

export function LeaseLensLogo({ size = 24, theme = 'white' }) {
  const isWhite = theme === 'white';

  const docStroke   = isWhite ? 'rgba(255,255,255,0.88)' : '#2d60e8';
  const docFill     = isWhite ? 'rgba(255,255,255,0.1)'  : 'rgba(45,96,232,0.07)';
  const foldFill    = '#7aed9f';
  const foldStroke  = '#7aed9f';
  const line1       = isWhite ? 'rgba(255,255,255,0.82)' : '#2d60e8';
  const line2       = isWhite ? 'rgba(255,255,255,0.5)'  : '#7b93e0';
  const line3       = isWhite ? 'rgba(255,255,255,0.3)'  : '#a8b8ec';
  const lensBg      = '#2d60e8';
  const lensStroke  = isWhite ? '#7aed9f'                : 'white';
  const lensRing    = isWhite ? 'rgba(255,255,255,0.9)'  : 'rgba(255,255,255,0.95)';
  const handle      = isWhite ? 'rgba(255,255,255,0.9)'  : 'rgba(255,255,255,0.95)';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 38 38"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Document body */}
      <rect
        x="9" y="7" width="16" height="20"
        rx="2.5"
        fill={docFill}
        stroke={docStroke}
        strokeWidth="1.4"
      />
      {/* Green folded corner tab */}
      <path d="M19 7 L25 13 L19 13 Z" fill={foldFill}/>
      <path
        d="M19 7 L19 13 L25 13"
        stroke={foldStroke}
        strokeWidth="1.4"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Document text lines */}
      <rect x="12" y="16.5" width="6"   height="1.3" rx="0.65" fill={line1}/>
      <rect x="12" y="19.5" width="9.5" height="1.3" rx="0.65" fill={line2}/>
      <rect x="12" y="22.5" width="5"   height="1.3" rx="0.65" fill={line3}/>
      {/* Magnifier background */}
      <circle cx="28" cy="27" r="5.5" fill={lensBg} stroke={lensStroke} strokeWidth="1.4"/>
      {/* Magnifier lens ring */}
      <circle cx="28" cy="27" r="3" stroke={lensRing} strokeWidth="1.2" fill="none"/>
      {/* Magnifier handle */}
      <line
        x1="30.1" y1="29.1" x2="32" y2="31"
        stroke={handle}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default LeaseLensLogo;