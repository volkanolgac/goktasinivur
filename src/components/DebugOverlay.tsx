import React, { useEffect, useState } from 'react';
import { AsteroidData, GameSettings, LetterSettingConfig, PlayerStats } from '../types/game';

interface DebugOverlayProps {
  currentTargetWord: string;
  asteroids: AsteroidData[];
  settings: GameSettings;
  letterConfig: LetterSettingConfig;
  player1: PlayerStats;
  currentRound: number;
}

export const DebugOverlay: React.FC<DebugOverlayProps> = ({
  currentTargetWord,
  asteroids,
  settings,
  letterConfig,
  player1,
  currentRound,
}) => {
  const [fps, setFps] = useState<number>(60);
  const isDebug =
    typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).get('debug') === '1';

  useEffect(() => {
    if (!isDebug) return;
    let frameCount = 0;
    let lastTime = performance.now();
    let animId: number;

    const loop = (now: number) => {
      frameCount++;
      if (now - lastTime >= 1000) {
        setFps(frameCount);
        frameCount = 0;
        lastTime = now;
      }
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isDebug]);

  if (!isDebug) return null;

  return (
    <div className="fixed bottom-2 right-2 z-50 p-3 rounded-xl bg-black/85 border border-green-500/80 font-mono text-[11px] text-green-400 select-none pointer-events-none max-w-xs shadow-2xl">
      <div className="font-bold border-b border-green-800 pb-1 mb-1 text-green-300">
        🎮 GÖK TAŞINI VUR · DEBUG (?debug=1)
      </div>
      <div>FPS: {fps}</div>
      <div>Hedef Kelime: <span className="font-bold text-yellow-300">"{currentTargetWord}"</span></div>
      <div>Tur: {currentRound} / {settings.targetRounds}</div>
      <div>Puan: {player1.score} | Kombo: {player1.combo}x</div>
      <div>Zorluk: {settings.difficulty} | Taş Sayısı: {asteroids.length}</div>
      <div>Harfler: {letterConfig.allLettersEnabled ? 'Hepsi' : letterConfig.enabledLetters.join(',')}</div>
      <div className="mt-1 text-[10px] text-green-500">
        Taşlar: {asteroids.map(a => `${a.word}${a.isTarget ? '★' : ''}`).join(' | ')}
      </div>
    </div>
  );
};
