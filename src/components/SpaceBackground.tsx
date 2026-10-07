import React, { useMemo } from 'react';

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  duration: number;
  delay: number;
  color: string;
}

export const SpaceBackground: React.FC = () => {
  // Generate stable starry field
  const stars = useMemo<Star[]>(() => {
    const list: Star[] = [];
    const colors = ['#ffffff', '#bae6fd', '#fed7aa', '#fbcfe8', '#ddd6fe'];
    for (let i = 0; i < 70; i++) {
      list.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2.5 + 1.2,
        opacity: Math.random() * 0.7 + 0.3,
        duration: Math.random() * 3 + 2,
        delay: Math.random() * 4,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
    return list;
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 overflow-hidden z-0 select-none bg-radial from-[#1e1b4b] via-[#0f172a] to-[#020617]"
    >
      {/* Soft Nebula Ambient Clouds */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-purple-600/15 blur-3xl" />
      <div className="absolute top-1/3 -right-24 w-80 h-80 rounded-full bg-cyan-500/15 blur-3xl" />
      <div className="absolute -bottom-24 left-1/4 w-[32rem] h-72 rounded-full bg-indigo-600/20 blur-3xl" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full bg-pink-500/10 blur-3xl" />

      {/* Cute Distant Stylized Planets */}
      {/* 1. Ringed Pastel Planet (top right) */}
      <div className="absolute top-8 right-16 opacity-75 hidden sm:block transform scale-90 md:scale-100">
        <svg width="100" height="70" viewBox="0 0 100 70" fill="none">
          <ellipse
            cx="50"
            cy="35"
            rx="46"
            ry="14"
            fill="none"
            stroke="rgba(216, 180, 254, 0.45)"
            strokeWidth="3.5"
            transform="rotate(-18 50 35)"
          />
          <circle cx="50" cy="35" r="22" fill="url(#planetGrad1)" />
          {/* Subtle planet craters */}
          <circle cx="44" cy="28" r="4" fill="#a855f7" opacity="0.3" />
          <circle cx="56" cy="40" r="3" fill="#a855f7" opacity="0.3" />
          <defs>
            <radialGradient id="planetGrad1" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#c084fc" />
              <stop offset="70%" stopColor="#7e22ce" />
              <stop offset="100%" stopColor="#4c1d95" />
            </radialGradient>
          </defs>
        </svg>
      </div>

      {/* 2. Cozy Mini Crater Moon (top left) */}
      <div className="absolute top-12 left-10 opacity-70 hidden md:block">
        <svg width="50" height="50" viewBox="0 0 50 50" fill="none">
          <circle cx="25" cy="25" r="20" fill="url(#moonGrad)" />
          <circle cx="20" cy="18" r="3.5" fill="#0284c7" opacity="0.35" />
          <circle cx="31" cy="27" r="4" fill="#0284c7" opacity="0.3" />
          <circle cx="22" cy="33" r="2.5" fill="#0284c7" opacity="0.25" />
          <defs>
            <radialGradient id="moonGrad" cx="30%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#7dd3fc" />
              <stop offset="70%" stopColor="#0284c7" />
              <stop offset="100%" stopColor="#075985" />
            </radialGradient>
          </defs>
        </svg>
      </div>

      {/* Twinkling Star Field */}
      {stars.map(star => (
        <span
          key={star.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            backgroundColor: star.color,
            boxShadow: `0 0 ${star.size * 2}px ${star.color}`,
            opacity: star.opacity,
            animation: `twinkle ${star.duration}s ease-in-out infinite alternate`,
            animationDelay: `${star.delay}s`,
          }}
        />
      ))}

      {/* Occasional Shooting Star Animation */}
      <div
        className="absolute w-24 h-0.5 bg-gradient-to-r from-transparent via-cyan-200 to-white rounded-full opacity-0 pointer-events-none"
        style={{
          top: '22%',
          left: '15%',
          transform: 'rotate(-32deg)',
          animation: 'shootingStar 8s cubic-bezier(0.2, 0.8, 0.2, 1) infinite',
          animationDelay: '3s',
        }}
      />
    </div>
  );
};
