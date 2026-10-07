import React from 'react';
import { MAARIF_SELECTABLE_LETTERS, ALL_TURKISH_LETTERS } from '../data/turkishAlphabet';
import { LetterSettingConfig } from '../types/game';
import { AudioManager } from '../services/AudioManager';

interface LetterSettingsModalProps {
  config: LetterSettingConfig;
  onChange: (config: LetterSettingConfig) => void;
  onClose: () => void;
  totalFilteredWords: number;
}

export const LetterSettingsModal: React.FC<LetterSettingsModalProps> = ({
  config,
  onChange,
  onClose,
  totalFilteredWords,
}) => {
  const toggleAll = () => {
    AudioManager.playClick();
    if (config.allLettersEnabled) {
      // Toggle back to base N
      onChange({
        ...config,
        allLettersEnabled: false,
        enabledLetters: ['N'],
      });
    } else {
      // Enable all letters
      onChange({
        ...config,
        allLettersEnabled: true,
        enabledLetters: ALL_TURKISH_LETTERS.filter(l => l !== 'A'),
      });
    }
  };

  const toggleLetter = (letterUpper: string) => {
    AudioManager.playClick();
    let updated: string[];

    if (config.allLettersEnabled) {
      // From all, select only this letter
      updated = [letterUpper];
      onChange({
        ...config,
        allLettersEnabled: false,
        enabledLetters: updated,
      });
      return;
    }

    if (config.enabledLetters.includes(letterUpper)) {
      // Keep at least one selected letter
      if (config.enabledLetters.length <= 1) return;
      updated = config.enabledLetters.filter(l => l !== letterUpper);
    } else {
      updated = [...config.enabledLetters, letterUpper];
    }

    const allSelected = updated.length === MAARIF_SELECTABLE_LETTERS.length;
    onChange({
      ...config,
      allLettersEnabled: allSelected,
      enabledLetters: updated,
    });
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    onChange({
      ...config,
      finishScore: val,
    });
  };

  // Group letters according to image.png layout
  // Row 1: Hepsi + Nn, Ee, Tt, İi, Ll
  const row1Letters = MAARIF_SELECTABLE_LETTERS.slice(0, 5); // N, E, T, İ, L
  // Row 2: Oo, Kk, Uu, Rr, Iı, Mm
  const row2Letters = MAARIF_SELECTABLE_LETTERS.slice(5, 11); // O, K, U, R, I, M
  // Row 3: Üü, Ss, Öö, Yy, Dd, Zz
  const row3Letters = MAARIF_SELECTABLE_LETTERS.slice(11, 17); // Ü, S, Ö, Y, D, Z
  // Row 4: Çç, Bb, Gg, Cc, Şş, Pp
  const row4Letters = MAARIF_SELECTABLE_LETTERS.slice(17, 23); // Ç, B, G, C, Ş, P
  // Row 5: Hh, Vv, Ğğ, Ff, Jj
  const row5Letters = MAARIF_SELECTABLE_LETTERS.slice(23, 28); // H, V, Ğ, F, J

  const renderLetterButton = (item: typeof MAARIF_SELECTABLE_LETTERS[0]) => {
    const isSelected = config.allLettersEnabled || config.enabledLetters.includes(item.upper);

    return (
      <button
        key={item.id}
        type="button"
        onClick={() => toggleLetter(item.upper)}
        className={`h-11 sm:h-12 flex-1 min-w-[48px] sm:min-w-[62px] rounded-2xl font-black text-sm sm:text-base transition-all duration-150 cursor-pointer shadow-sm select-none ${
          isSelected
            ? 'bg-amber-500 hover:bg-amber-400 text-white shadow-[0_4px_12px_rgba(245,158,11,0.5)] scale-[1.03] ring-2 ring-amber-300'
            : 'bg-slate-300/80 hover:bg-slate-200 text-slate-700'
        }`}
      >
        {item.display}
      </button>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-md select-none overflow-y-auto pointer-events-auto">
      {/* Modal card styled matching image.png */}
      <div className="relative w-full max-w-2xl my-auto p-6 sm:p-8 rounded-[36px] bg-slate-100 text-slate-800 shadow-[0_20px_60px_rgba(0,0,0,0.6)] flex flex-col border border-slate-200">
        {/* Close Button Top-Right (as in image.png) */}
        <button
          type="button"
          onClick={() => {
            AudioManager.playClick();
            onClose();
          }}
          className="absolute top-5 right-5 w-10 h-10 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Kapat"
        >
          <svg className="w-6 h-6 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Title */}
        <div className="text-center mb-5">
          <h2 className="text-2xl sm:text-3xl font-black text-indigo-950 tracking-tight">
            Harfleri Seçin
          </h2>
          <div className="mt-1 flex items-center justify-center gap-2 text-xs sm:text-sm font-bold text-slate-500">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
              ★ 'A' harfi temel ses olarak sabit etkindir
            </span>
            <span>•</span>
            <span className="text-emerald-700 font-extrabold">{totalFilteredWords} uygun kelime</span>
          </div>
        </div>

        {/* Button Rows matching image.png */}
        <div className="space-y-2.5 sm:space-y-3 my-2">
          {/* Row 1: [Hepsi] + [Nn] [Ee] [Tt] [İi] [Ll] */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            <button
              type="button"
              onClick={toggleAll}
              className={`h-11 sm:h-12 flex-1 min-w-[58px] sm:min-w-[76px] rounded-2xl font-black text-xs sm:text-sm transition-all duration-150 cursor-pointer shadow-sm select-none ${
                config.allLettersEnabled
                  ? 'bg-amber-500 hover:bg-amber-400 text-white shadow-[0_4px_12px_rgba(245,158,11,0.5)] scale-[1.03] ring-2 ring-amber-300'
                  : 'bg-slate-300/80 hover:bg-slate-200 text-slate-700'
              }`}
            >
              Hepsi
            </button>
            {row1Letters.map(renderLetterButton)}
          </div>

          {/* Row 2: [Oo] [Kk] [Uu] [Rr] [Iı] [Mm] */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {row2Letters.map(renderLetterButton)}
          </div>

          {/* Row 3: [Üü] [Ss] [Öö] [Yy] [Dd] [Zz] */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {row3Letters.map(renderLetterButton)}
          </div>

          {/* Row 4: [Çç] [Bb] [Gg] [Cc] [Şş] [Pp] */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {row4Letters.map(renderLetterButton)}
          </div>

          {/* Row 5: [Hh] [Vv] [Ğğ] [Ff] [Jj] */}
          <div className="flex items-center justify-center gap-2 sm:gap-2.5 max-w-lg mx-auto w-full">
            {row5Letters.map(renderLetterButton)}
          </div>
        </div>

        {/* Bitirme Puanı Slider matching image.png */}
        <div className="mt-7 pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-base sm:text-lg font-black text-slate-800 shrink-0">
            <span>Bitirme Puanı:</span>
            <span className="text-amber-600 tabular-nums text-xl">{config.finishScore}</span>
          </div>

          <div className="flex-1 w-full flex items-center gap-3">
            <span className="text-xs font-bold text-slate-400">5</span>
            <input
              type="range"
              min={5}
              max={25}
              step={5}
              value={config.finishScore}
              onChange={handleSliderChange}
              className="w-full h-3 bg-amber-200 rounded-lg appearance-none cursor-pointer accent-amber-500 focus:outline-none"
            />
            <span className="text-xs font-bold text-slate-400">25</span>
          </div>
        </div>

        {/* Complete / Save Button */}
        <div className="mt-5 flex justify-end">
          <button
            type="button"
            onClick={() => {
              AudioManager.playClick();
              onClose();
            }}
            className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-white font-black text-base shadow-lg transition-transform active:scale-95 cursor-pointer"
          >
            Kaydet ve Oyuna Başla
          </button>
        </div>
      </div>
    </div>
  );
};
