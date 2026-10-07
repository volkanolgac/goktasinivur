import React from 'react';
import { PlayerStats } from '../types/game';

interface TopBarHUDProps {
  currentRound: number;
  totalRounds: number;
  player1: PlayerStats;
  player2?: PlayerStats;
  isTwoPlayer: boolean;
  isSpeaking: boolean;
  onBackToMenu: () => void;
  onOpenSettings: () => void;
}

export const TopBarHUD: React.FC<TopBarHUDProps> = ({
  currentRound,
  totalRounds,
  player1,
  player2,
  isTwoPlayer,
  isSpeaking,
  onBackToMenu,
  onOpenSettings,
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-20 h-16 sm:h-20 px-3 sm:px-6 flex items-center justify-between select-none bg-gradient-to-b from-slate-950/80 via-slate-950/40 to-transparent pointer-events-auto">
      {/* TOP LEFT: Back & Settings */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onBackToMenu}
          className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/60 shadow-md text-slate-200 hover:text-white text-xs sm:text-sm font-bold transition-transform active:scale-95 cursor-pointer"
          title="Ana Menüye Dön"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="hidden xs:inline">Menü</span>
        </button>

        <button
          type="button"
          onClick={onOpenSettings}
          className="p-1.5 sm:p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/60 shadow-md text-slate-200 hover:text-white transition-transform active:scale-95 cursor-pointer"
          title="Ayarlar"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>

      {/* TOP CENTER: Spoken-word status indicator */}
      <div className="flex items-center">
        <div
          className={`flex items-center gap-2 px-3 py-1.5 sm:px-5 sm:py-2 rounded-2xl border transition-all duration-300 shadow-lg ${
            isSpeaking
              ? 'bg-gradient-to-r from-amber-500/25 via-yellow-500/30 to-amber-500/25 border-yellow-400/80 shadow-[0_0_20px_rgba(250,204,21,0.4)]'
              : 'bg-slate-900/80 border-slate-700/80'
          }`}
        >
          {/* Custom Animated Sound Waves Vector Icon */}
          <div className="relative flex items-center justify-center w-5 h-5 text-yellow-300">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072M18.364 5.636a9 9 0 010 12.728M11 5L6 9H2v6h4l5 4V5z" />
            </svg>
            {isSpeaking && (
              <span className="absolute -inset-1 rounded-full border border-yellow-300 animate-ping opacity-60" />
            )}
          </div>

          <span
            className={`font-black text-xs sm:text-base tracking-wide transition-colors ${
              isSpeaking ? 'text-yellow-200' : 'text-slate-200'
            }`}
          >
            {isSpeaking ? 'Dinle...' : 'Bul ve vur!'}
          </span>
        </div>
      </div>

      {/* TOP RIGHT: Game Stats (Round, Score, Lives, Combo) */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Round Counter */}
        <div className="flex flex-col items-center px-2 sm:px-3 py-0.5 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Tur</span>
          <span className="text-xs sm:text-sm font-black text-cyan-300 tabular-nums">
            {currentRound} / {totalRounds}
          </span>
        </div>

        {/* Lives (3 Soft Hearts) */}
        {!isTwoPlayer && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-900/80 border border-slate-800" title="Kalan Canlar">
            {[1, 2, 3].map(heartIdx => {
              const isAlive = heartIdx <= player1.lives;
              return (
                <svg
                  key={heartIdx}
                  className={`w-5 h-5 sm:w-6 sm:h-6 transition-all duration-300 ${
                    isAlive
                      ? 'text-rose-500 fill-rose-500 scale-100 drop-shadow-[0_0_8px_rgba(244,63,94,0.7)] animate-pulse'
                      : 'text-slate-600 fill-slate-800 scale-75 opacity-30 grayscale'
                  }`}
                  viewBox="0 0 24 24"
                >
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              );
            })}
          </div>
        )}

        {/* Player 1 Score & Combo */}
        <div className="flex items-center gap-2">
          <div className="flex flex-col items-end px-2.5 sm:px-3.5 py-0.5 sm:py-1 rounded-xl bg-cyan-950/60 border border-cyan-800/60 shadow-sm">
            <span className="text-[10px] text-cyan-300 font-bold">
              {isTwoPlayer ? '1. Oyuncu' : 'Puan'}
            </span>
            <span className="text-sm sm:text-lg font-black text-yellow-300 tabular-nums">
              {player1.score}
            </span>
          </div>

          {/* Combo badge if > 1 */}
          {player1.combo > 1 && (
            <div className="animate-bounce px-2 py-0.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-[11px] sm:text-xs shadow-md">
              {player1.combo}x
            </div>
          )}
        </div>

        {/* Player 2 Stats in 2P Mode */}
        {isTwoPlayer && player2 && (
          <div className="flex items-center gap-2">
            <div className="flex flex-col items-end px-2.5 sm:px-3.5 py-0.5 sm:py-1 rounded-xl bg-orange-950/60 border border-orange-800/60 shadow-sm">
              <span className="text-[10px] text-orange-300 font-bold">2. Oyuncu</span>
              <span className="text-sm sm:text-lg font-black text-amber-300 tabular-nums">
                {player2.score}
              </span>
            </div>
            {player2.combo > 1 && (
              <div className="animate-bounce px-2 py-0.5 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-black text-[11px] sm:text-xs shadow-md">
                {player2.combo}x
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
