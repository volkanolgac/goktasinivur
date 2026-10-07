import React from 'react';

interface BottomControlsProps {
  onRepeatWord: () => void;
  autoSpeak: boolean;
  onToggleAutoSpeak: () => void;
  isSpeaking: boolean;
}

export const BottomControls: React.FC<BottomControlsProps> = ({
  onRepeatWord,
  autoSpeak,
  onToggleAutoSpeak,
  isSpeaking,
}) => {
  return (
    <footer className="fixed bottom-3 left-3 sm:bottom-5 sm:left-6 z-20 flex flex-col sm:flex-row items-start sm:items-center gap-2 pointer-events-auto select-none">
      {/* 1. Tekrar Dinle Button */}
      <button
        type="button"
        onClick={onRepeatWord}
        className={`group flex items-center gap-2 px-3.5 py-2 sm:px-5 sm:py-2.5 rounded-2xl border font-black text-xs sm:text-sm shadow-xl transition-all duration-200 active:scale-95 cursor-pointer ${
          isSpeaking
            ? 'bg-amber-500/20 border-yellow-400 text-yellow-300 ring-2 ring-yellow-400/40'
            : 'bg-slate-900/90 hover:bg-slate-800 border-cyan-500/60 hover:border-cyan-400 text-cyan-200 hover:text-white shadow-[0_4px_16px_rgba(6,182,212,0.25)]'
        }`}
        title="Duyduğun kelimeyi tekrar dinle (Kısayol: Boşluk Tuşu)"
      >
        {/* Custom Audio Speaker Icon */}
        <div className="w-5 h-5 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M15.536 8.464a5 5 0 010 7.072M11 5L6 9H2v6h4l5 4V5z" />
          </svg>
        </div>
        <span>Tekrar Dinle</span>
      </button>

      {/* 2. Ses Sürekli Çal Toggle */}
      <button
        type="button"
        onClick={onToggleAutoSpeak}
        className={`flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-2xl border text-xs sm:text-xs font-bold transition-all duration-200 shadow-md cursor-pointer ${
          autoSpeak
            ? 'bg-emerald-950/70 border-emerald-500/70 text-emerald-300'
            : 'bg-slate-900/70 border-slate-700 text-slate-400 hover:text-slate-200'
        }`}
        title="Her turda hedef kelimenin otomatik okunmasını aç/kapat"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        <span>Ses Sürekli: {autoSpeak ? 'Açık' : 'Kapalı'}</span>
      </button>
    </footer>
  );
};
