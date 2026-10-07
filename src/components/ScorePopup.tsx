import React from 'react';
import { FloatingScore } from '../types/game';

interface ScorePopupProps {
  popups: FloatingScore[];
}

export const ScorePopup: React.FC<ScorePopupProps> = ({ popups }) => {
  return (
    <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden select-none">
      {popups.map(item => (
        <div
          key={item.id}
          className="absolute -translate-x-1/2 -translate-y-1/2 font-extrabold text-2xl md:text-3xl tracking-wider drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] animate-[floatScore_1s_ease-out_forwards]"
          style={{
            left: `${item.x}px`,
            top: `${item.y}px`,
            color: item.isPositive ? '#facc15' : '#fb7185',
            textShadow: item.isPositive
              ? '0 0 12px rgba(250, 204, 21, 0.9), 2px 2px 0 #854d0e'
              : '0 0 12px rgba(251, 113, 133, 0.9), 2px 2px 0 #9f1239',
            fontFamily: "'Fredoka', 'Nunito', sans-serif",
          }}
        >
          {item.text}
        </div>
      ))}
    </div>
  );
};
