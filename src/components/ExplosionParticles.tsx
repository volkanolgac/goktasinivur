import React, { useMemo } from 'react';
import { ExplosionState } from '../types/game';

interface Fragment {
  id: number;
  angle: number;
  distance: number;
  size: number;
  color: string;
  rotation: number;
  delay: number;
}

interface ExplosionParticlesProps {
  explosion: ExplosionState | null;
}

export const ExplosionParticles: React.FC<ExplosionParticlesProps> = ({ explosion }) => {
  const fragments = useMemo<Fragment[]>(() => {
    if (!explosion) return [];
    const list: Fragment[] = [];
    const colors = [
      '#facc15', // Gold
      '#38bdf8', // Cyan
      '#f472b6', // Pink
      '#a855f7', // Purple
      '#4ade80', // Emerald
      '#fb923c', // Orange
      '#ffffff', // White sparkle
    ];

    const count = explosion.fragmentsCount || 16;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * 360 + (Math.random() * 20 - 10);
      const distance = Math.random() * 90 + 55; // fly out distance
      const size = Math.random() * 14 + 8;
      const color = colors[i % colors.length];
      const rotation = Math.random() * 720 - 360;
      const delay = Math.random() * 0.05;
      list.push({ id: i, angle, distance, size, color, rotation, delay });
    }
    return list;
  }, [explosion]);

  if (!explosion) return null;

  return (
    <div
      className="pointer-events-none fixed z-30 select-none will-change-transform"
      style={{
        left: `${explosion.x}px`,
        top: `${explosion.y}px`,
        transform: 'translate(-50%, -50%)',
      }}
    >
      {/* 1. Sudden bright flash ring */}
      <div
        className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-yellow-200 bg-white/40 pointer-events-none animate-[ping_0.5s_cubic-bezier(0,0,0.2,1)_forwards]"
        style={{
          width: '120px',
          height: '120px',
        }}
      />

      {/* 2. Expanding golden shockwave circle */}
      <div
        className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-cyan-400 pointer-events-none animate-[ping_0.7s_ease-out_forwards]"
        style={{
          width: '170px',
          height: '170px',
        }}
      />

      {/* 3. Radial Flying Chunky Fragments */}
      {fragments.map(frag => {
        const rad = (frag.angle * Math.PI) / 180;
        const tx = Math.cos(rad) * frag.distance;
        const ty = Math.sin(rad) * frag.distance;

        return (
          <div
            key={frag.id}
            className="absolute rounded-lg shadow-md animate-[fragmentBurst_0.6s_cubic-bezier(0.16,1,0.3,1)_forwards]"
            style={{
              width: `${frag.size}px`,
              height: `${frag.size * 0.8}px`,
              backgroundColor: frag.color,
              boxShadow: `0 0 10px ${frag.color}`,
              // @ts-expect-error custom CSS property for keyframe
              '--target-x': `${tx}px`,
              '--target-y': `${ty}px`,
              '--target-rot': `${frag.rotation}deg`,
              animationDelay: `${frag.delay}s`,
            }}
          />
        );
      })}

      {/* 4. Little Star Sparkles */}
      <div className="absolute -top-6 -left-6 text-yellow-300 text-2xl animate-bounce">★</div>
      <div className="absolute top-4 -right-8 text-cyan-300 text-xl animate-pulse">✦</div>
      <div className="absolute -bottom-7 left-3 text-pink-300 text-lg animate-ping">✧</div>
    </div>
  );
};
