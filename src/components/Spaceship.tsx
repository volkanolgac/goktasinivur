import React from 'react';
import { SpaceshipColor } from '../types/game';

interface SpaceshipProps {
  rotationAngle: number; // in degrees
  isFiring?: boolean;
  colorTheme?: SpaceshipColor;
  size?: number; // width/height in px (default 88)
}

export const SPACESHIP_THEMES: Record<
  SpaceshipColor,
  {
    name: string;
    primary: string;
    primaryDark: string;
    accent: string;
    wings: string;
    cockpit: string;
    glow: string;
    flame: string;
    flameCore: string;
  }
> = {
  cyan: {
    name: 'Gök Mavisi',
    primary: '#0ea5e9',
    primaryDark: '#0369a1',
    accent: '#38bdf8',
    wings: '#0284c7',
    cockpit: '#bae6fd',
    glow: 'rgba(14, 165, 233, 0.65)',
    flame: '#f97316',
    flameCore: '#fef08a',
  },
  orange: {
    name: 'Alev Turuncusu',
    primary: '#f97316',
    primaryDark: '#c2410c',
    accent: '#fb923c',
    wings: '#ea580c',
    cockpit: '#fed7aa',
    glow: 'rgba(249, 115, 22, 0.65)',
    flame: '#06b6d4',
    flameCore: '#e0f2fe',
  },
  purple: {
    name: 'Kozmik Mor',
    primary: '#a855f7',
    primaryDark: '#7e22ce',
    accent: '#c084fc',
    wings: '#9333ea',
    cockpit: '#f3e8ff',
    glow: 'rgba(168, 85, 247, 0.65)',
    flame: '#ec4899',
    flameCore: '#fdf2f8',
  },
  green: {
    name: 'Neon Zümrüt',
    primary: '#10b981',
    primaryDark: '#047857',
    accent: '#34d399',
    wings: '#059669',
    cockpit: '#d1fae5',
    glow: 'rgba(16, 185, 129, 0.65)',
    flame: '#f59e0b',
    flameCore: '#fef3c7',
  },
  ruby: {
    name: 'Parlak Yakut',
    primary: '#ef4444',
    primaryDark: '#b91c1c',
    accent: '#f87171',
    wings: '#dc2626',
    cockpit: '#fee2e2',
    glow: 'rgba(239, 68, 68, 0.65)',
    flame: '#fbbf24',
    flameCore: '#ffffff',
  },
  gold: {
    name: 'Altın Şampiyon',
    primary: '#eab308',
    primaryDark: '#a16207',
    accent: '#fde047',
    wings: '#ca8a04',
    cockpit: '#fef9c3',
    glow: 'rgba(234, 179, 8, 0.65)',
    flame: '#f97316',
    flameCore: '#ffffff',
  },
  pink: {
    name: 'Sakız Pembesi',
    primary: '#ec4899',
    primaryDark: '#be185d',
    accent: '#f472b6',
    wings: '#db2777',
    cockpit: '#fce7f3',
    glow: 'rgba(236, 72, 153, 0.65)',
    flame: '#a855f7',
    flameCore: '#ffffff',
  },
  midnight: {
    name: 'Geceyarısı Laciverti',
    primary: '#3b82f6',
    primaryDark: '#1e3a8a',
    accent: '#60a5fa',
    wings: '#1d4ed8',
    cockpit: '#dbeafe',
    glow: 'rgba(59, 130, 246, 0.65)',
    flame: '#06b6d4',
    flameCore: '#ffffff',
  },
  teal: {
    name: 'Turkuaz Dalga',
    primary: '#14b8a6',
    primaryDark: '#0f766e',
    accent: '#2dd4bf',
    wings: '#0d9488',
    cockpit: '#ccfbf1',
    glow: 'rgba(20, 184, 166, 0.65)',
    flame: '#f59e0b',
    flameCore: '#fef3c7',
  },
  lime: {
    name: 'Limon Parlaklığı',
    primary: '#84cc16',
    primaryDark: '#4d7c0f',
    accent: '#a3e635',
    wings: '#65a30d',
    cockpit: '#ecfccb',
    glow: 'rgba(132, 204, 22, 0.65)',
    flame: '#06b6d4',
    flameCore: '#ffffff',
  },
};

export const Spaceship: React.FC<SpaceshipProps> = ({
  rotationAngle,
  isFiring = false,
  colorTheme = 'cyan',
  size = 88,
}) => {
  const t = SPACESHIP_THEMES[colorTheme] || SPACESHIP_THEMES.cyan;

  return (
    // Outer container provides the gentle playful floating bounce (yerinde zıplama hareketi)
    <div className="relative select-none pointer-events-none animate-[shipHover_2.2s_ease-in-out_infinite]">
      {/* Inner container provides cursor tracking rotation & fire recoil */}
      <div
        className="relative transition-transform duration-100 ease-out will-change-transform flex items-center justify-center select-none pointer-events-none"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          transform: `rotate(${rotationAngle}deg) ${isFiring ? 'scale(1.12) translateY(-8px)' : 'scale(1)'}`,
        }}
      >
        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="overflow-visible drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)]"
        >
          <defs>
            <filter id={`ship-glow-${colorTheme}`} x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor={t.glow} />
            </filter>

            {/* Hull linear gradient */}
            <linearGradient id={`hull-grad-${colorTheme}`} x1="50" y1="10" x2="50" y2="80" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="35%" stopColor={t.accent} />
              <stop offset="85%" stopColor={t.primary} />
              <stop offset="100%" stopColor={t.primaryDark} />
            </linearGradient>

            {/* Cockpit radial */}
            <radialGradient id={`cockpit-grad-${colorTheme}`} cx="50" cy="38" r="14" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="60%" stopColor={t.cockpit} />
              <stop offset="100%" stopColor={t.primary} />
            </radialGradient>

            {/* Engine Flame */}
            <linearGradient id={`flame-grad-${colorTheme}`} x1="50" y1="78" x2="50" y2="98" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor={t.flameCore} />
              <stop offset="50%" stopColor={t.flame} />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>

          {/* Thruster Flames */}
          <g className="origin-top animate-pulse">
            {/* Main central flame */}
            <path
              d="M 44 80 Q 50 104 56 80 Z"
              fill={`url(#flame-grad-${colorTheme})`}
              className="transition-all duration-150"
              style={{
                transform: isFiring ? 'scaleY(1.55)' : 'scaleY(1.0)',
                transformOrigin: '50px 80px',
              }}
            />
            {/* Side mini flames */}
            <path
              d="M 33 76 Q 37 89 41 76 Z"
              fill={`url(#flame-grad-${colorTheme})`}
              opacity="0.85"
            />
            <path
              d="M 59 76 Q 63 89 67 76 Z"
              fill={`url(#flame-grad-${colorTheme})`}
              opacity="0.85"
            />
          </g>

          {/* Wings */}
          <path
            d="M 22 75 L 35 55 L 35 78 L 22 75 Z"
            fill={t.wings}
            stroke="#ffffff"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
          <path
            d="M 78 75 L 65 55 L 65 78 L 78 75 Z"
            fill={t.wings}
            stroke="#ffffff"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />

          {/* Side Cannons / Blasters */}
          <rect x="25" y="58" width="4" height="14" rx="2" fill="#e2e8f0" stroke={t.primaryDark} strokeWidth="1" />
          <rect x="71" y="58" width="4" height="14" rx="2" fill="#e2e8f0" stroke={t.primaryDark} strokeWidth="1" />
          {isFiring && (
            <>
              <circle cx="27" cy="56" r="3.5" fill="#fef08a" className="animate-ping" />
              <circle cx="73" cy="56" r="3.5" fill="#fef08a" className="animate-ping" />
            </>
          )}

          {/* Spaceship Main Hull */}
          <path
            d="M 50 12 C 58 28 66 52 66 78 C 66 82 60 84 50 84 C 40 84 34 82 34 78 C 34 52 42 28 50 12 Z"
            fill={`url(#hull-grad-${colorTheme})`}
            stroke="#ffffff"
            strokeWidth="2"
            filter={`url(#ship-glow-${colorTheme})`}
          />

          {/* Cute Glass Canopy / Cockpit */}
          <ellipse
            cx="50"
            cy="42"
            rx="11"
            ry="15"
            fill={`url(#cockpit-grad-${colorTheme})`}
            stroke="#ffffff"
            strokeWidth="1.5"
          />
          {/* Canopy Glass Glare Highlight */}
          <path
            d="M 44 35 Q 48 31 54 33 Q 48 36 45 42 Z"
            fill="#ffffff"
            opacity="0.85"
          />

          {/* Nose Cone Tip */}
          <circle cx="50" cy="14" r="3" fill="#ffffff" />

          {/* Bottom Engine Exhaust Nozzle */}
          <rect x="42" y="78" width="16" height="5" rx="2.5" fill="#334155" stroke="#64748b" strokeWidth="1" />
        </svg>
      </div>
    </div>
  );
};
