import React from 'react';

interface GioLogoProps {
  className?: string;
  variant?: 'full' | 'compact' | 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const GioLogo: React.FC<GioLogoProps> = ({
  className = '',
  variant = 'full',
  size = 'md',
}) => {
  // Height definitions for crisp scaling
  const heightClasses = {
    sm: 'h-8',
    md: 'h-11',
    lg: 'h-14',
    xl: 'h-20',
  }[size];

  // Colors: Gio Cyan Blue #00AEEF
  const primaryBlue = variant === 'light' ? '#ffffff' : '#00AEEF';
  const bannerBg = variant === 'light' ? '#ffffff' : '#00AEEF';
  const bannerText = variant === 'light' ? '#0f172a' : '#ffffff';
  const tagColor = variant === 'light' ? '#bae6fd' : '#00AEEF';

  return (
    <div className={`inline-flex flex-col items-center select-none ${className}`}>
      <svg
        viewBox="0 0 520 280"
        className={`${heightClasses} w-auto`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Top "GI" */}
        {/* Letter G */}
        <path
          d="M75 140 C35 140 10 112 10 74 C10 36 38 8 78 8 C108 8 130 24 138 48 L104 57 C98 42 88 34 76 34 C54 34 38 50 38 74 C38 98 54 114 77 114 C94 114 104 106 108 92 L75 92 L75 68 L136 68 L136 126 C121 135 100 140 75 140 Z"
          fill={primaryBlue}
        />

        {/* Letter I */}
        <path
          d="M165 14 L205 14 L190 74 L205 136 L165 136 L180 74 Z"
          fill={primaryBlue}
        />

        {/* Letter O with internal swirling t-shirt & washing water splash */}
        <g transform="translate(210, 0)">
          {/* Outer circle of O */}
          <path
            d="M74 140 C33 140 0 108 0 74 C0 40 33 8 74 8 C115 8 148 40 148 74 C148 108 115 140 74 140 Z"
            fill={primaryBlue}
          />
          {/* Inner cutout of O */}
          <circle cx="74" cy="74" r="56" fill={variant === 'light' ? '#0f172a' : '#ffffff'} />

          {/* T-Shirt Swirl Graphic in Center */}
          <path
            d="M50 48 L64 36 L74 44 L84 36 L98 48 L90 62 L82 56 L82 92 C82 96 78 100 74 100 C70 100 66 96 66 92 L66 56 L58 62 Z"
            fill={primaryBlue}
          />
          {/* Water Swirl Wave around shirt */}
          <path
            d="M40 78 C42 96 56 108 74 108 C90 108 104 96 106 80 C108 66 98 56 86 56 C74 56 68 64 68 70 C68 78 76 82 82 80 C78 84 72 84 66 80 C60 76 58 68 62 58 C68 44 86 42 98 52 C94 40 82 34 70 36 C52 38 40 54 40 78 Z"
            fill={primaryBlue}
          />
          {/* Splash droplets */}
          <circle cx="106" cy="30" r="4" fill={primaryBlue} />
          <path
            d="M102 18 C102 18 106 10 112 12 C116 14 116 20 110 22 C106 23 103 21 102 18 Z"
            fill={primaryBlue}
          />
          <circle cx="44" cy="44" r="3" fill={primaryBlue} />
        </g>

        {/* Apostrophe */}
        <path
          d="M366 12 C366 12 374 8 380 12 C384 15 382 24 374 28 C370 30 368 24 368 20 Z"
          fill={primaryBlue}
        />

        {/* Letter S */}
        <path
          d="M428 140 C398 140 378 126 376 102 L406 97 C408 109 416 116 428 116 C438 116 446 110 446 102 C446 92 438 88 424 82 C400 74 382 66 382 44 C382 22 400 8 426 8 C450 8 468 20 472 40 L444 46 C442 36 436 30 426 30 C418 30 410 36 410 42 C410 50 418 54 430 58 C456 68 474 76 474 100 C474 124 456 140 428 140 Z"
          fill={primaryBlue}
        />

        {/* Banner Bar for LAUNDROMAT */}
        <rect x="0" y="160" width="490" height="52" rx="4" fill={bannerBg} />
        <text
          x="245"
          y="198"
          fill={bannerText}
          fontFamily="system-ui, -apple-system, sans-serif"
          fontWeight="900"
          fontSize="40"
          letterSpacing="8"
          textAnchor="middle"
        >
          LAUNDROMAT
        </text>

        {/* Bottom Tagline: CLEAN WITHOUT LIMITS */}
        <text
          x="245"
          y="252"
          fill={tagColor}
          fontFamily="system-ui, -apple-system, sans-serif"
          fontWeight="700"
          fontSize="24"
          letterSpacing="8"
          textAnchor="middle"
        >
          CLEAN WITHOUT LIMITS
        </text>
      </svg>
    </div>
  );
};
