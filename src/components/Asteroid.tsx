import React from 'react';
import { AsteroidData } from '../types/game';

interface AsteroidProps {
  data: AsteroidData;
  time: number; // elapsed time for sinusoidal float
  status: 'idle' | 'selected-correct' | 'selected-wrong' | 'dimmed' | 'exploding';
  onClick: (data: AsteroidData, element: HTMLElement) => void;
  disabled?: boolean;
}

export const Asteroid: React.FC<AsteroidProps> = ({
  data,
  time,
  status,
  onClick,
  disabled = false,
}) => {
  // Smooth zero-gravity floating oscillation
  const offsetX = Math.sin(time * data.speedX + data.phaseX) * data.amplitudeX;
  const offsetY = Math.cos(time * data.speedY + data.phaseY) * data.amplitudeY;
  const rot = Math.sin(time * data.rotationSpeed + data.phaseX) * data.rotationAmplitude;

  // Color schemes for friendly cartoon cosmic asteroids
  const themes = {
    rock: {
      bgGrad: 'linear-gradient(145deg, #78716c 0%, #44403c 75%, #292524 100%)',
      border: '#a8a29e',
      crater: '#292524',
      glow: 'rgba(168, 162, 158, 0.4)',
      textShadow: '0 2px 4px rgba(0,0,0,0.8)',
    },
    'gem-cyan': {
      bgGrad: 'linear-gradient(145deg, #38bdf8 0%, #0284c7 70%, #0369a1 100%)',
      border: '#bae6fd',
      crater: '#075985',
      glow: 'rgba(56, 189, 248, 0.55)',
      textShadow: '0 2px 4px rgba(2, 44, 75, 0.9)',
    },
    'gem-purple': {
      bgGrad: 'linear-gradient(145deg, #c084fc 0%, #7e22ce 70%, #581c87 100%)',
      border: '#e9d5ff',
      crater: '#3b0764',
      glow: 'rgba(192, 132, 252, 0.55)',
      textShadow: '0 2px 4px rgba(59, 7, 100, 0.9)',
    },
    'gem-amber': {
      bgGrad: 'linear-gradient(145deg, #fbbf24 0%, #d97706 70%, #92400e 100%)',
      border: '#fef3c7',
      crater: '#78350f',
      glow: 'rgba(251, 191, 36, 0.55)',
      textShadow: '0 2px 4px rgba(120, 53, 15, 0.9)',
    },
    'gem-emerald': {
      bgGrad: 'linear-gradient(145deg, #34d399 0%, #059669 70%, #064e3b 100%)',
      border: '#a7f3d0',
      crater: '#022c22',
      glow: 'rgba(52, 211, 153, 0.55)',
      textShadow: '0 2px 4px rgba(2, 44, 34, 0.9)',
    },
    'crystal-rose': {
      bgGrad: 'linear-gradient(145deg, #f472b6 0%, #db2777 70%, #9d174d 100%)',
      border: '#fce7f3',
      crater: '#831843',
      glow: 'rgba(244, 114, 182, 0.55)',
      textShadow: '0 2px 4px rgba(131, 24, 67, 0.9)',
    },
  };

  const currentTheme = themes[data.colorTheme] || themes['gem-cyan'];

  // Status visual overrides
  let statusClasses = 'hover:scale-105 active:scale-95 cursor-pointer';
  let glowStyle = `0 8px 24px ${currentTheme.glow}, inset 0 3px 6px rgba(255,255,255,0.45)`;

  if (status === 'selected-correct') {
    statusClasses = 'scale-110 ring-4 ring-emerald-400 ring-offset-2 ring-offset-transparent animate-pulse';
    glowStyle = '0 0 36px rgba(52, 211, 153, 0.95), inset 0 0 16px rgba(255,255,255,0.8)';
  } else if (status === 'selected-wrong') {
    statusClasses = 'scale-95 ring-4 ring-rose-400 animate-[shake_0.4s_ease-in-out]';
    glowStyle = '0 0 28px rgba(244, 63, 94, 0.85), inset 0 0 12px rgba(255,255,255,0.6)';
  } else if (status === 'dimmed') {
    statusClasses = 'opacity-35 scale-95 pointer-events-none transition-opacity duration-300';
  } else if (status === 'exploding') {
    statusClasses = 'opacity-0 scale-125 transition-all duration-200 pointer-events-none';
  }

  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (disabled || status !== 'idle') return;
    onClick(data, e.currentTarget);
  };

  return (
    <button
      type="button"
      disabled={disabled || status !== 'idle'}
      onPointerDown={handlePointerDown}
      className={`absolute flex items-center justify-center select-none outline-none focus-visible:ring-4 focus-visible:ring-amber-300 transition-transform duration-200 ${statusClasses}`}
      style={{
        left: `calc(${data.baseX}% + ${offsetX}px)`,
        top: `calc(${data.baseY}% + ${offsetY}px)`,
        width: `${data.size}px`,
        height: `${data.size * 0.88}px`,
        transform: `translate(-50%, -50%) rotate(${rot}deg)`,
        transformOrigin: 'center center',
      }}
      aria-label={`Gök taşı: ${data.word}`}
    >
      {/* Cartoon Asteroid SVG Container */}
      <div
        className="w-full h-full relative flex items-center justify-center rounded-[40%_45%_38%_42%/42%_38%_45%_40%] transition-shadow duration-200"
        style={{
          background: currentTheme.bgGrad,
          border: `3px solid ${currentTheme.border}`,
          boxShadow: glowStyle,
        }}
      >
        {/* Soft 3D Specular Highlight at Top Rim */}
        <div
          className="absolute top-1.5 left-4 right-5 h-3 rounded-full opacity-60 pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, rgba(255,255,255,0.7), transparent)',
          }}
        />

        {/* Cute Cartoon Craters */}
        <div
          className="absolute top-2.5 left-3.5 w-4 h-3.5 rounded-full pointer-events-none opacity-45 shadow-inner"
          style={{ backgroundColor: currentTheme.crater }}
        />
        <div
          className="absolute bottom-3 right-4 w-5 h-4.5 rounded-full pointer-events-none opacity-40 shadow-inner"
          style={{ backgroundColor: currentTheme.crater }}
        />
        <div
          className="absolute top-4 right-3.5 w-3 h-2.5 rounded-full pointer-events-none opacity-30 shadow-inner"
          style={{ backgroundColor: currentTheme.crater }}
        />
        <div
          className="absolute bottom-2 left-6 w-3.5 h-3 rounded-full pointer-events-none opacity-35 shadow-inner"
          style={{ backgroundColor: currentTheme.crater }}
        />

        {/* The Turkish Word Badge */}
        <div className="relative z-10 px-2 py-0.5 flex items-center justify-center max-w-[90%] overflow-hidden">
          <span
            className="text-white font-black tracking-wide drop-shadow-md text-center break-keep select-none truncate"
            style={{
              fontSize: (() => {
                const scale = (data.size || 115) / 115;
                if (data.word.length > 6) return `${Math.max(0.75, 1.1 * scale).toFixed(2)}rem`;
                if (data.word.length > 4) return `${Math.max(0.85, 1.3 * scale).toFixed(2)}rem`;
                if (data.word.length > 2) return `${Math.max(0.95, 1.55 * scale).toFixed(2)}rem`;
                return `${Math.max(1.05, 1.75 * scale).toFixed(2)}rem`;
              })(),
              lineHeight: 1.1,
              textShadow: currentTheme.textShadow,
              fontFamily: "'Nunito', sans-serif",
            }}
          >
            {data.word}
          </span>
        </div>
      </div>
    </button>
  );
};
