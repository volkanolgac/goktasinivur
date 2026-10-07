import React from 'react';
import { Spaceship } from './Spaceship';
import { PlayerMode, DifficultyLevel } from '../types/game';
import { AudioManager } from '../services/AudioManager';

interface MainMenuProps {
  onStartGame: () => void;
  onOpenLetterSettings: () => void;
  onOpenSettings: () => void;
  playerMode: PlayerMode;
  onSelectPlayerMode: (mode: PlayerMode) => void;
  difficulty: DifficultyLevel;
  highScore: number;
  letterCountSummary: string;
  spaceshipColor: import('../types/game').SpaceshipColor;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  onStartGame,
  onOpenLetterSettings,
  onOpenSettings,
  playerMode,
  onSelectPlayerMode,
  difficulty,
  highScore,
  letterCountSummary,
  spaceshipColor,
}) => {
  const handleStart = () => {
    AudioManager.unlockAudio();
    AudioManager.playClick();
    onStartGame();
  };

  const handleModeChange = (mode: PlayerMode) => {
    AudioManager.playClick();
    onSelectPlayerMode(mode);
  };

  return (
    <div className="relative z-10 w-full h-full min-h-screen flex flex-col items-center justify-between p-3 sm:p-6 md:p-8 select-none overflow-y-auto">
      {/* Top Bar with High Score & Letter Badge */}
      <div className="w-full max-w-4xl flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs sm:text-sm font-bold text-amber-300 shadow-md">
          <span>🏆 En Yüksek:</span>
          <span className="font-black text-white tabular-nums">{highScore}</span>
        </div>

        <button
          type="button"
          onClick={() => {
            AudioManager.playClick();
            onOpenLetterSettings();
          }}
          className="flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-2xl bg-indigo-950/70 hover:bg-indigo-900/80 border border-indigo-700/60 text-xs sm:text-sm font-bold text-indigo-200 hover:text-white transition-all cursor-pointer shadow-sm"
        >
          <span>🎯 Harfler:</span>
          <span className="text-cyan-300 font-extrabold">{letterCountSummary}</span>
        </button>
      </div>

      {/* Center Hero Zone: Logo + Floating Cartoon Scene */}
      <div className="flex flex-col items-center my-auto max-w-2xl text-center">
        {/* Floating Cartoon Asteroids Cluster (Letters a, n, e, l, k, u) & Spaceship */}
        <div className="relative w-64 h-28 xs:w-72 xs:h-32 sm:w-96 sm:h-40 mb-3 flex items-center justify-center">
          {/* Letter Asteroid 1: 'a' (Cyan / Sky) */}
          <div
            className="absolute -left-7 sm:-left-12 top-0 w-12 h-11 sm:w-16 sm:h-15 rounded-[44%] bg-gradient-to-br from-cyan-300 via-sky-400 to-blue-600 border-2 border-cyan-100 shadow-[0_0_22px_rgba(6,182,212,0.6)] flex items-center justify-center animate-[floatGentle_3.8s_ease-in-out_infinite]"
          >
            <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-cyan-900/30"></div>
            <div className="absolute bottom-2 right-2 w-1.5 h-1.5 rounded-full bg-cyan-900/25"></div>
            <span className="text-lg sm:text-2xl font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">a</span>
          </div>

          {/* Letter Asteroid 2: 'n' (Amber / Orange) */}
          <div
            className="absolute -right-7 sm:-right-12 top-1 w-12 h-11 sm:w-16 sm:h-15 rounded-[46%] bg-gradient-to-br from-amber-300 via-orange-400 to-amber-600 border-2 border-amber-100 shadow-[0_0_22px_rgba(245,158,11,0.6)] flex items-center justify-center animate-[floatGentle_4.2s_ease-in-out_infinite_reverse]"
          >
            <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-amber-950/30"></div>
            <div className="absolute bottom-2 left-2 w-1.5 h-1.5 rounded-full bg-amber-950/25"></div>
            <span className="text-lg sm:text-2xl font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">n</span>
          </div>

          {/* Letter Asteroid 3: 'e' (Emerald / Teal) */}
          <div
            className="absolute -left-2.5 sm:-left-5 -bottom-2 w-10 h-9 sm:w-14 sm:h-13 rounded-[40%] bg-gradient-to-br from-emerald-300 via-emerald-400 to-teal-700 border-2 border-emerald-100 shadow-[0_0_20px_rgba(16,185,129,0.55)] flex items-center justify-center animate-[floatGentle_3.2s_ease-in-out_infinite]"
          >
            <div className="absolute top-1.5 right-2 w-1.5 h-1.5 rounded-full bg-teal-950/30"></div>
            <span className="text-base sm:text-xl font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">e</span>
          </div>

          {/* Letter Asteroid 4: 'l' (Fuchsia / Purple) */}
          <div
            className="absolute -right-2.5 sm:-right-5 -bottom-1 w-10 h-9 sm:w-14 sm:h-13 rounded-[42%] bg-gradient-to-br from-fuchsia-400 via-purple-500 to-indigo-700 border-2 border-fuchsia-100 shadow-[0_0_20px_rgba(192,38,211,0.55)] flex items-center justify-center animate-[floatGentle_4.5s_ease-in-out_infinite_reverse]"
          >
            <div className="absolute top-2 left-2 w-1.5 h-1.5 rounded-full bg-indigo-950/30"></div>
            <span className="text-base sm:text-xl font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">l</span>
          </div>

          {/* Letter Asteroid 5: 'k' (Coral / Rose) */}
          <div
            className="absolute left-7 sm:left-12 -top-5 sm:-top-6 w-10 h-9 sm:w-13 sm:h-12 rounded-[48%] bg-gradient-to-br from-rose-300 via-pink-400 to-rose-600 border-2 border-rose-100 shadow-[0_0_20px_rgba(244,63,94,0.55)] flex items-center justify-center animate-[floatGentle_3.5s_ease-in-out_infinite]"
          >
            <div className="absolute bottom-1.5 right-2 w-1.5 h-1.5 rounded-full bg-rose-950/30"></div>
            <span className="text-sm sm:text-lg font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">k</span>
          </div>

          {/* Letter Asteroid 6: 'u' (Lime / Electric Yellow-Green - Left of 'n', level with 'k') */}
          <div
            className="absolute right-7 sm:right-12 -top-5 sm:-top-6 w-10 h-9 sm:w-13 sm:h-12 rounded-[46%] bg-gradient-to-br from-lime-300 via-lime-400 to-emerald-600 border-2 border-lime-100 shadow-[0_0_20px_rgba(132,204,22,0.6)] flex items-center justify-center animate-[floatGentle_3.6s_ease-in-out_infinite_reverse]"
          >
            <div className="absolute bottom-1.5 left-2 w-1.5 h-1.5 rounded-full bg-emerald-950/30"></div>
            <span className="text-sm sm:text-lg font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">u</span>
          </div>

          {/* Central Cute Hero Spaceship */}
          <div className="animate-[floatGentle_2.5s_ease-in-out_infinite] z-10 scale-90 sm:scale-100">
            <Spaceship rotationAngle={0} isFiring={true} colorTheme={spaceshipColor} size={96} />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl xs:text-4xl sm:text-6xl md:text-7xl font-black tracking-normal drop-shadow-[0_8px_25px_rgba(0,0,0,0.85)] text-transparent bg-clip-text bg-gradient-to-b from-white via-cyan-100 to-cyan-300 pb-1 flex items-center justify-center gap-2 sm:gap-3.5">
          <span>Gök</span>
          <span>Taşını</span>
          <span>Vur</span>
        </h1>

        {/* Subtitle */}
        <p className="mt-1 sm:mt-2 text-slate-200 text-xs sm:text-lg md:text-xl font-bold max-w-lg leading-snug drop-shadow-md px-2">
          Duyduğun kelimenin yazılı olduğu gök taşını vur!
        </p>

        {/* Mode Selector Toggle (Tek Kişi / 2 Kişi) */}
        <div className="mt-6 flex items-center p-1.5 rounded-2xl bg-slate-900/90 border border-slate-700/80 shadow-inner">
          <button
            type="button"
            onClick={() => handleModeChange('1P')}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
              playerMode === '1P'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_15px_rgba(6,182,212,0.5)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
            <span>Tek Kişi</span>
          </button>

          <button
            type="button"
            onClick={() => handleModeChange('2P')}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
              playerMode === '2P'
                ? 'bg-gradient-to-r from-orange-500 to-pink-600 text-white shadow-[0_0_15px_rgba(249,115,22,0.5)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
            </svg>
            <span>2 Kişi (Yarış)</span>
          </button>
        </div>

        {/* Primary Action Button: BAŞLAT */}
        <div className="mt-5 sm:mt-7 w-full max-w-xs">
          <button
            type="button"
            onClick={handleStart}
            className="w-full py-3.5 sm:py-5 px-6 sm:px-8 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 hover:from-emerald-300 hover:to-teal-400 text-slate-950 font-black text-xl sm:text-3xl tracking-wide shadow-[0_8px_30px_rgba(16,185,129,0.6)] transform hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2.5 sm:gap-3 border-2 border-emerald-200"
          >
            <svg className="w-6 h-6 sm:w-8 sm:h-8 fill-slate-950" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
            <span>BAŞLAT</span>
          </button>
        </div>

        {/* Secondary Buttons: Harf Ayarları & Ayarlar */}
        <div className="mt-3 sm:mt-4 flex items-center gap-2.5 sm:gap-3 w-full max-w-xs">
          <button
            type="button"
            onClick={() => {
              AudioManager.playClick();
              onOpenLetterSettings();
            }}
            className="flex-1 py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl sm:rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 text-cyan-200 hover:text-white font-black text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 sm:gap-2"
          >
            <svg className="w-4 h-4 text-cyan-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <span>Harf Ayarları</span>
          </button>

          <button
            type="button"
            onClick={() => {
              AudioManager.playClick();
              onOpenSettings();
            }}
            className="flex-1 py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl sm:rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 text-slate-200 hover:text-white font-black text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 sm:gap-2"
          >
            <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>Ayarlar</span>
          </button>
        </div>
      </div>

      {/* Bottom Footer Credits & Level Info */}
      <div className="w-full max-w-4xl flex items-center justify-between text-xs text-slate-400 font-semibold pt-2">
        <span className="capitalize">Zorluk Seviyesi: {difficulty === 'easy' ? 'Kolay' : difficulty === 'medium' ? 'Orta' : 'Zor'}</span>
        <span>1. Sınıf Türkçe Okuma & Ses Eğitimi</span>
      </div>
    </div>
  );
};
