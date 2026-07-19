import React from 'react';

export const AshokaChakra: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 500 500" 
    className={className}
    fill="none"
  >
    <circle cx="250" cy="250" r="225" stroke="#000080" strokeWidth="20" />
    <circle cx="250" cy="250" r="175" stroke="#000080" strokeWidth="5" />
    <circle cx="250" cy="250" r="40" fill="#000080" />
    <g stroke="#000080" strokeWidth="8">
      {/* 24 spokes */}
      {[...Array(24)].map((_, i) => (
        <line 
          key={i} 
          x1="250" y1="250" 
          x2="250" y2="75" 
          transform={`rotate(${i * 15} 250 250)`} 
        />
      ))}
    </g>
    {/* Decorative dots on the outer ring */}
    <g fill="#000080">
      {[...Array(24)].map((_, i) => (
        <circle 
          key={`dot-${i}`}
          cx="250" cy="62" 
          r="10" 
          transform={`rotate(${i * 15 + 7.5} 250 250)`} 
        />
      ))}
    </g>
  </svg>
);
