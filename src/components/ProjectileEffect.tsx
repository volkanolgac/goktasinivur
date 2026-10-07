import React from 'react';
import { ProjectileState } from '../types/game';

interface ProjectileEffectProps {
  projectile: ProjectileState | null;
}

export const ProjectileEffect: React.FC<ProjectileEffectProps> = ({ projectile }) => {
  if (!projectile) return null;

  // Linear interpolation from start to target
  const currentX = projectile.startX + (projectile.targetX - projectile.startX) * projectile.progress;
  const currentY = projectile.startY + (projectile.targetY - projectile.startY) * projectile.progress;
  const isMiss = projectile.isMiss;

  return (
    <div
      className="pointer-events-none fixed z-30 select-none will-change-transform"
      style={{
        left: `${currentX}px`,
        top: `${currentY}px`,
        transform: `translate(-50%, -50%) rotate(${projectile.angle}deg)`,
      }}
    >
      {/* High-energy plasma laser bolt */}
      <div className="relative flex items-center justify-center">
        {/* Core glowing missile */}
        <div
          className={`w-14 h-4 rounded-full flex items-center justify-center ${
            isMiss
              ? 'shadow-[0_0_24px_#f43f5e]'
              : 'shadow-[0_0_24px_#38bdf8]'
          }`}
          style={{
            background: isMiss
              ? 'linear-gradient(90deg, transparent 0%, #fb7185 30%, #ffffff 80%)'
              : 'linear-gradient(90deg, transparent 0%, #38bdf8 30%, #ffffff 80%)',
          }}
        >
          {/* Intense bright white core */}
          <div className="w-4 h-2 bg-white rounded-full shadow-[0_0_8px_#ffffff]" />
        </div>

        {/* Trail particles / Energy wake */}
        <div
          className={`absolute -left-6 w-10 h-1.5 opacity-80 blur-[1px] ${
            isMiss
              ? 'bg-gradient-to-r from-transparent to-rose-500'
              : 'bg-gradient-to-r from-transparent to-cyan-400'
          }`}
        />
        <div
          className={`absolute -left-14 w-10 h-0.5 opacity-60 ${
            isMiss
              ? 'bg-gradient-to-r from-transparent to-amber-500'
              : 'bg-gradient-to-r from-transparent to-purple-400'
          }`}
        />

        {/* Energy Pulse Ring */}
        <div
          className={`absolute w-8 h-8 rounded-full border opacity-50 animate-ping ${
            isMiss ? 'border-rose-300' : 'border-cyan-200'
          }`}
        />
      </div>
    </div>
  );
};
