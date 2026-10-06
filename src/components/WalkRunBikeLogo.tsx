import React from 'react';

interface LogoProps {
  className?: string;
}

export const WalkRunBikeLogo: React.FC<LogoProps> = ({ className = 'w-40 h-14' }) => {
  return (
    <div className={`flex items-center justify-center select-none ${className}`}>
      <svg viewBox="0 0 320 120" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        {/* Background rounded badge (optional subtle backing) */}
        <rect width="320" height="120" rx="10" fill="#ffffff" fillOpacity="0.05" />

        {/* WALK */}
        <text
          x="12"
          y="34"
          fontFamily="Arial Black, Impact, sans-serif"
          fontWeight="900"
          fontSize="34"
          fill="#1b2a4a"
          letterSpacing="0.5"
        >
          WALK
        </text>

        {/* RUN with lightning bolt */}
        <text
          x="12"
          y="69"
          fontFamily="Arial Black, Impact, sans-serif"
          fontWeight="900"
          fontSize="36"
          fill="#d92525"
          letterSpacing="0.5"
        >
          RUN
        </text>
        <path
          d="M 32 44 L 40 54 L 35 54 L 42 64 L 32 56 L 36 56 Z"
          fill="#ffffff"
          stroke="#1b2a4a"
          strokeWidth="1.2"
        />

        {/* BIKE */}
        <text
          x="12"
          y="102"
          fontFamily="Arial Black, Impact, sans-serif"
          fontWeight="900"
          fontSize="34"
          fill="#1b2a4a"
          letterSpacing="0.5"
        >
          BIKE
        </text>

        {/* 12 */}
        <text
          x="152"
          y="99"
          fontFamily="Arial Black, Impact, sans-serif"
          fontWeight="900"
          fontSize="112"
          fill="#1b2a4a"
        >
          12
        </text>

        {/* Red Banner FIGHTING STROKE */}
        <rect x="10" y="106" width="300" height="13" fill="#d92525" rx="3" />
        <text
          x="160"
          y="116.5"
          fontFamily="Arial, sans-serif"
          fontWeight="900"
          fontSize="9.5"
          fill="#ffffff"
          textAnchor="middle"
          letterSpacing="2"
        >
          FIGHTING STROKE
        </text>
      </svg>
    </div>
  );
};
