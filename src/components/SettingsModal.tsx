import React, { useEffect, useState } from 'react';
import { GameSettings, DifficultyLevel, PlayerMode, SpaceshipColor } from '../types/game';
import { SpeechManager, VoiceOption } from '../services/SpeechManager';
import { AudioManager } from '../services/AudioManager';
import { Spaceship, SPACESHIP_THEMES } from './Spaceship';

interface SettingsModalProps {
  settings: GameSettings;
  onChange: (settings: GameSettings) => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  onChange,
  onClose,
}) => {
  const [voices, setVoices] = useState<VoiceOption[]>([]);

  useEffect(() => {
    const list = SpeechManager.getAvailableVoices();
    setVoices(list);
  }, []);

  const handleToggleSound = () => {
    AudioManager.playClick();
    const updated = !settings.soundEnabled;
    AudioManager.setSfxEnabled(updated);
    onChange({ ...settings, soundEnabled: updated });
  };

  const handleToggleMusic = () => {
    AudioManager.playClick();
    const updated = !settings.musicEnabled;
    AudioManager.setMusicEnabled(updated);
    onChange({ ...settings, musicEnabled: updated });
  };

  const handleToggleAutoSpeak = () => {
    AudioManager.playClick();
    onChange({ ...settings, autoSpeakNext: !settings.autoSpeakNext });
  };

  const handleSetDifficulty = (difficulty: DifficultyLevel) => {
    AudioManager.playClick();
    onChange({ ...settings, difficulty });
  };

  const handleSetPlayerMode = (playerMode: PlayerMode) => {
    AudioManager.playClick();
    onChange({ ...settings, playerMode });
  };

  const handleSetRounds = (targetRounds: number) => {
    AudioManager.playClick();
    onChange({ ...settings, targetRounds });
  };

  const handleSetShipColor = (color: SpaceshipColor) => {
    AudioManager.playClick();
    onChange({ ...settings, spaceshipColor: color });
  };

  const handleVoiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const uri = e.target.value;
    SpeechManager.setVoiceByURI(uri);
    onChange({ ...settings, selectedVoiceURI: uri });
  };

  const handleSelectQuickVoice = (type: 'emel' | 'tolga' | 'filiz') => {
    AudioManager.playClick();
    const uri =
      type === 'emel'
        ? 'preset:microsoft-emel'
        : type === 'filiz'
        ? 'preset:microsoft-filiz'
        : 'preset:microsoft-tolga';

    SpeechManager.setVoiceByURI(uri);
    onChange({ ...settings, selectedVoiceURI: uri });
    SpeechManager.speakWord(
      type === 'emel'
        ? 'Merhaba! Ben Emel, uzay görevine hazırım!'
        : type === 'filiz'
        ? 'Merhaba! Ben Filiz, haydi başlayalım!'
        : 'Merhaba! Ben Tolga, uzay görevine başlayalım!'
    );
  };

  const handleTestVoice = () => {
    SpeechManager.speakWord('Merhaba! Ben senin Türkçe uzay rehberinim.');
  };

  const colorKeys = Object.keys(SPACESHIP_THEMES) as SpaceshipColor[];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md select-none overflow-y-auto">
      <div className="relative w-full max-w-xl my-auto p-5 sm:p-7 rounded-[32px] bg-slate-900 border-2 border-cyan-500/40 shadow-[0_0_50px_rgba(6,182,212,0.3)] flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <span className="text-cyan-400">⚙️</span>
            <span>Oyun Ayarları</span>
          </h2>
          <button
            type="button"
            onClick={() => {
              AudioManager.playClick();
              onClose();
            }}
            className="p-2 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Kapat"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto py-3 space-y-5 pr-1">
          {/* 1. UZAY MEKİĞİ RENK SEÇİMİ (Çok Miktarda Renk Opsiyonu & Canlı Önizleme) */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
                <span>🚀</span>
                <span>Uzay Mekiği Rengi: {SPACESHIP_THEMES[settings.spaceshipColor || 'cyan'].name}</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Animated Live Ship Preview with gentle hover bounce */}
              <div className="w-24 h-24 rounded-2xl bg-slate-900/90 border border-slate-700/80 flex items-center justify-center p-2 shrink-0 shadow-inner">
                <Spaceship
                  rotationAngle={0}
                  isFiring={true}
                  colorTheme={settings.spaceshipColor || 'cyan'}
                  size={68}
                />
              </div>

              {/* 10 Spaceship Color Options */}
              <div className="grid grid-cols-5 gap-2 flex-1">
                {colorKeys.map(key => {
                  const theme = SPACESHIP_THEMES[key];
                  const isSelected = (settings.spaceshipColor || 'cyan') === key;

                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => handleSetShipColor(key)}
                      className={`h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer border relative group ${
                        isSelected
                          ? 'ring-2 ring-white scale-110 shadow-lg'
                          : 'opacity-70 hover:opacity-100 hover:scale-105'
                      }`}
                      style={{
                        backgroundColor: theme.primary,
                        borderColor: theme.accent,
                      }}
                      title={theme.name}
                    >
                      {isSelected && <span className="text-white text-xs font-black drop-shadow">✓</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 2. TÜRKÇE SES SEÇENEKLERİ (Microsoft Emel, Microsoft Tolga & Doğal Sesler) */}
          <div className="space-y-2.5">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <span>🎙️</span>
              <span>Türkçe Seslendirmen</span>
            </div>

            {/* Quick Voice Shortcut Buttons */}
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleSelectQuickVoice('emel')}
                className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-all cursor-pointer flex flex-col justify-between ${
                  settings.selectedVoiceURI === 'preset:microsoft-emel' || !settings.selectedVoiceURI
                    ? 'bg-purple-900/90 border-purple-400 text-white ring-2 ring-purple-400 shadow-md scale-[1.02]'
                    : 'bg-purple-950/50 hover:bg-purple-900/60 border-purple-800/70 text-purple-200'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="font-black text-white">Emel</span>
                  <span>👩</span>
                </div>
                <div className="text-[10px] text-purple-300 mt-1 font-semibold">Microsoft (Kadın)</div>
              </button>

              <button
                type="button"
                onClick={() => handleSelectQuickVoice('tolga')}
                className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-all cursor-pointer flex flex-col justify-between ${
                  settings.selectedVoiceURI === 'preset:microsoft-tolga'
                    ? 'bg-blue-900/90 border-blue-400 text-white ring-2 ring-blue-400 shadow-md scale-[1.02]'
                    : 'bg-blue-950/50 hover:bg-blue-900/60 border-blue-800/70 text-blue-200'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="font-black text-white">Tolga</span>
                  <span>👨</span>
                </div>
                <div className="text-[10px] text-blue-300 mt-1 font-semibold">Microsoft (Erkek)</div>
              </button>

              <button
                type="button"
                onClick={() => handleSelectQuickVoice('filiz')}
                className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-all cursor-pointer flex flex-col justify-between ${
                  settings.selectedVoiceURI === 'preset:microsoft-filiz'
                    ? 'bg-pink-900/90 border-pink-400 text-white ring-2 ring-pink-400 shadow-md scale-[1.02]'
                    : 'bg-pink-950/50 hover:bg-pink-900/60 border-pink-800/70 text-pink-200'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="font-black text-white">Filiz</span>
                  <span>👩</span>
                </div>
                <div className="text-[10px] text-pink-300 mt-1 font-semibold">Microsoft (Kadın)</div>
              </button>
            </div>

            {/* Dropdown with all detected voices */}
            <div className="flex gap-2">
              <select
                value={settings.selectedVoiceURI || 'preset:microsoft-emel'}
                onChange={handleVoiceChange}
                className="flex-1 bg-slate-800 border border-slate-700 text-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-cyan-400 cursor-pointer"
              >
                {voices.map(v => (
                  <option key={v.voiceURI} value={v.voiceURI}>
                    {v.displayLabel || v.name}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={handleTestVoice}
                className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0"
                title="Sesi Test Et"
              >
                Sesi Dinle
              </button>
            </div>
          </div>

          {/* 3. SES & MÜZİK */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Ses Efektleri & Uzay Müziği
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleToggleSound}
                className={`p-3 rounded-2xl border font-bold text-xs sm:text-sm flex items-center justify-between transition-all cursor-pointer ${
                  settings.soundEnabled
                    ? 'bg-cyan-950/70 border-cyan-500/80 text-cyan-200'
                    : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}
              >
                <span>Ses Efektleri</span>
                <span className="font-black">{settings.soundEnabled ? 'Açık' : 'Kapalı'}</span>
              </button>

              <button
                type="button"
                onClick={handleToggleMusic}
                className={`p-3 rounded-2xl border font-bold text-xs sm:text-sm flex items-center justify-between transition-all cursor-pointer ${
                  settings.musicEnabled
                    ? 'bg-purple-950/70 border-purple-500/80 text-purple-200'
                    : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}
              >
                <span>Uzay Müziği</span>
                <span className="font-black">{settings.musicEnabled ? 'Açık' : 'Kapalı'}</span>
              </button>
            </div>

            <button
              type="button"
              onClick={handleToggleAutoSpeak}
              className={`w-full p-3 rounded-2xl border font-bold text-xs sm:text-sm flex items-center justify-between transition-all cursor-pointer ${
                settings.autoSpeakNext
                  ? 'bg-emerald-950/70 border-emerald-500/80 text-emerald-200'
                  : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}
            >
              <span>Ses Sürekli Çal (Yeni Turda Otomatik Oku)</span>
              <span className="font-black">{settings.autoSpeakNext ? 'Açık' : 'Kapalı'}</span>
            </button>
          </div>

          {/* 4. ZORLUK SEVİYESİ */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Zorluk Seviyesi
            </div>
            <div className="grid grid-cols-3 gap-2">
              {(['easy', 'medium', 'hard'] as DifficultyLevel[]).map(level => {
                const isCurrent = settings.difficulty === level;
                const labels = { easy: 'Kolay (4 Taş)', medium: 'Orta (5 Taş)', hard: 'Zor (6 Taş)' };
                return (
                  <button
                    key={level}
                    type="button"
                    onClick={() => handleSetDifficulty(level)}
                    className={`py-2.5 px-2 rounded-xl text-xs font-black border transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-cyan-500 text-slate-950 border-cyan-300 shadow-md scale-102'
                        : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                    }`}
                  >
                    {labels[level]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 5. OYUNCU MODU */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Oyuncu Modu
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleSetPlayerMode('1P')}
                className={`py-2.5 rounded-xl text-xs sm:text-sm font-black border transition-all cursor-pointer ${
                  settings.playerMode === '1P'
                    ? 'bg-cyan-600 text-white border-cyan-400 shadow-md'
                    : 'bg-slate-800 border-slate-700 text-slate-300'
                }`}
              >
                Tek Kişi
              </button>
              <button
                type="button"
                onClick={() => handleSetPlayerMode('2P')}
                className={`py-2.5 rounded-xl text-xs sm:text-sm font-black border transition-all cursor-pointer ${
                  settings.playerMode === '2P'
                    ? 'bg-orange-600 text-white border-orange-400 shadow-md'
                    : 'bg-slate-800 border-slate-700 text-slate-300'
                }`}
              >
                2 Kişi (Yarış)
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={() => {
              AudioManager.playClick();
              onClose();
            }}
            className="w-full sm:w-auto px-7 py-2.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-sm shadow-md transition-transform active:scale-95 cursor-pointer"
          >
            Tamam
          </button>
        </div>
      </div>
    </div>
  );
};
