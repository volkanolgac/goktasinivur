import React, { useEffect, useState } from 'react';
import { Spaceship } from './Spaceship';
import { SpeechManager } from '../services/SpeechManager';
import { AudioManager } from '../services/AudioManager';

interface StoryIntroModalProps {
  onStartCountdown: () => void;
  onSkip: () => void;
}

export const StoryIntroModal: React.FC<StoryIntroModalProps> = ({
  onStartCountdown,
  onSkip,
}) => {
  const [stage, setStage] = useState<1 | 2>(1);

  useEffect(() => {
    AudioManager.playClick();
    SpeechManager.speakWord('Uzayda kelimeler kaybolmuş!');

    const timer = setTimeout(() => {
      setStage(2);
      SpeechManager.speakWord('Doğru kelimeyi bul ve gök taşını vur!');
    }, 2800);

    const autoNext = setTimeout(() => {
      onStartCountdown();
    }, 6000);

    return () => {
      clearTimeout(timer);
      clearTimeout(autoNext);
    };
  }, [onStartCountdown]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md select-none pointer-events-auto overflow-y-auto">
      <div className="relative max-w-sm sm:max-w-lg w-full my-auto p-5 sm:p-8 rounded-3xl bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 border-2 border-indigo-500/50 shadow-[0_0_50px_rgba(99,102,241,0.4)] flex flex-col items-center text-center">
        {/* Animated Spaceship Hero */}
        <div className="my-2 sm:my-3 animate-bounce">
          <Spaceship rotationAngle={-12} isFiring={true} colorTheme="cyan" size={80} />
        </div>

        {/* Narrative Headline */}
        <div className="min-h-[75px] sm:min-h-[90px] flex flex-col items-center justify-center">
          {stage === 1 ? (
            <div className="animate-[fadeIn_0.5s_ease-out]">
              <h2 className="text-xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-200 to-indigo-200">
                Uzayda kelimeler kaybolmuş!
              </h2>
              <p className="mt-1.5 sm:mt-2 text-slate-300 text-xs sm:text-base font-medium">
                Gök taşları kelimelerle uzayda süzülüyor...
              </p>
            </div>
          ) : (
            <div className="animate-[fadeIn_0.5s_ease-out]">
              <h2 className="text-xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-orange-300">
                Doğru kelimeyi bul ve gök taşını vur!
              </h2>
              <p className="mt-1.5 sm:mt-2 text-slate-300 text-xs sm:text-base font-medium">
                Duyduğun kelimenin taşını seç, uzay gemin hedefi vursun!
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-4 sm:mt-6 flex items-center gap-2.5 sm:gap-3 w-full justify-center">
          <button
            type="button"
            onClick={onStartCountdown}
            className="flex-1 py-2.5 sm:py-3 px-4 sm:px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-sm sm:text-base shadow-[0_0_20px_rgba(16,185,129,0.5)] transition-transform active:scale-95 cursor-pointer"
          >
            Hemen Başla!
          </button>
          <button
            type="button"
            onClick={onSkip}
            className="py-2.5 sm:py-3 px-4 sm:px-5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-xs sm:text-sm transition-transform active:scale-95 cursor-pointer"
          >
            Atla
          </button>
        </div>
      </div>
    </div>
  );
};
