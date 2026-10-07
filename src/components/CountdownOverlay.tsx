import React, { useEffect, useState } from 'react';
import { SpeechManager } from '../services/SpeechManager';
import { AudioManager } from '../services/AudioManager';

interface CountdownOverlayProps {
  onComplete: () => void;
}

export const CountdownOverlay: React.FC<CountdownOverlayProps> = ({ onComplete }) => {
  const [step, setStep] = useState<number>(3); // 3, 2, 1, 0 (BAŞLA)

  useEffect(() => {
    // Initial step 3
    AudioManager.playCountdownTick();
    SpeechManager.speakCountdown('Üç');

    const timer2 = setTimeout(() => {
      setStep(2);
      AudioManager.playCountdownTick();
      SpeechManager.speakCountdown('İki');
    }, 800);

    const timer1 = setTimeout(() => {
      setStep(1);
      AudioManager.playCountdownTick();
      SpeechManager.speakCountdown('Bir');
    }, 1600);

    const timer0 = setTimeout(() => {
      setStep(0);
      AudioManager.playCorrect();
      SpeechManager.speakCountdown('Başla!');
    }, 2400);

    const finishTimer = setTimeout(() => {
      onComplete();
    }, 3100);

    return () => {
      clearTimeout(timer2);
      clearTimeout(timer1);
      clearTimeout(timer0);
      clearTimeout(finishTimer);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm select-none pointer-events-auto">
      <div className="flex flex-col items-center">
        {step > 0 ? (
          <div
            key={step}
            className="text-8xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 via-amber-400 to-orange-500 drop-shadow-[0_10px_25px_rgba(251,191,36,0.6)] animate-[countdownScale_0.75s_cubic-bezier(0.16,1,0.3,1)_forwards]"
            style={{ fontFamily: "'Nunito', sans-serif" }}
          >
            {step}
          </div>
        ) : (
          <div
            key="go"
            className="text-7xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-400 drop-shadow-[0_10px_35px_rgba(52,211,153,0.8)] animate-[countdownScale_0.75s_cubic-bezier(0.16,1,0.3,1)_forwards]"
            style={{ fontFamily: "'Nunito', sans-serif" }}
          >
            BAŞLA!
          </div>
        )}

        <div className="mt-4 text-cyan-200 text-lg font-bold animate-pulse">
          Kulaklarını aç, kelime geliyor!
        </div>
      </div>
    </div>
  );
};
