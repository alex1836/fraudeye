import React from 'react';

export const LogoIcon = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="shield_fill" x1="50" y1="0" x2="50" y2="100" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#2563EB" /> {/* Blue 600 */}
        <stop offset="1" stopColor="#172554" /> {/* Blue 950 */}
      </linearGradient>
      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    
    {/* Security Shield Base */}
    <path 
      d="M50 94C75.5 82 88 60 88 32V14L50 4L12 14V32C12 60 24.5 82 50 94Z" 
      fill="url(#shield_fill)" 
      stroke="#3B82F6" 
      strokeWidth="2"
    />

    {/* The Eye of Detection */}
    <g transform="translate(0, 5)">
      {/* Sclera - sleek, angular for tech feel */}
      <path 
        d="M50 62C68 62 80 45 80 45C80 45 68 28 50 28C32 28 20 45 20 45C20 45 32 62 50 62Z" 
        fill="white" 
      />
      
      {/* Iris (Technological/Digital) */}
      <circle cx="50" cy="45" r="14" fill="#1E40AF" stroke="#93C5FD" strokeWidth="2" />
      
      {/* Pupil (Lens/Camera Aperture) */}
      <circle cx="50" cy="45" r="6" fill="#0F172A" />
      
      {/* Digital Glint */}
      <circle cx="46" cy="41" r="3" fill="white" fillOpacity="0.8" />
    </g>

    {/* Tech Overlay / HUD Elements */}
    <g opacity="0.7">
        <path d="M50 18V24" stroke="#93C5FD" strokeWidth="2" strokeLinecap="round" />
        <path d="M50 76V82" stroke="#93C5FD" strokeWidth="2" strokeLinecap="round" />
        <path d="M18 50H24" stroke="#93C5FD" strokeWidth="2" strokeLinecap="round" />
        <path d="M82 50H76" stroke="#93C5FD" strokeWidth="2" strokeLinecap="round" />
    </g>

    {/* Scan Ring - implies active monitoring */}
    <circle cx="50" cy="50" r="34" stroke="#60A5FA" strokeWidth="1" strokeDasharray="4 4" opacity="0.5" />
  </svg>
);