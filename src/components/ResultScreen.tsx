import React, { useEffect } from 'react';
import { PlayerStats, PlayerMode } from '../types/game';
import { SpeechManager } from '../services/SpeechManager';
import { AudioManager } from '../services/AudioManager';

interface ResultScreenProps {
  player1: PlayerStats;
  player2?: PlayerStats;
  playerMode: PlayerMode;
  totalRounds: number;
  onPlayAgain: () => void;
  onBackToMenu: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  player1,
  player2,
  playerMode,
  totalRounds,
  onPlayAgain,
  onBackToMenu,
}) => {
  const isTwoPlayer = playerMode === '2P' && !!player2;

  // Accuracy calculation
  const p1Acc =
    player1.totalAttempts > 0
      ? Math.round((player1.correctAnswers / player1.totalAttempts) * 100)
      : 100;

  // Star rating (1 to 3 stars)
  const starCount = p1Acc >= 90 ? 3 : p1Acc >= 70 ? 2 : 1;

  useEffect(() => {
    AudioManager.playVictory();
    if (isTwoPlayer) {
      if (player1.score > player2.score) {
        SpeechManager.speakWord('Tebrikler! 1. Oyuncu kazandı!');
      } else if (player2.score > player1.score) {
        SpeechManager.speakWord('Tebrikler! 2. Oyuncu kazandı!');
      } else {
        SpeechManager.speakWord('Harika yarış! Dostluk kazandı!');
      }
    } else {
      SpeechManager.speakWord('Harika iş çıkardın! Çok güzel oynadın.');
    }
  }, [isTwoPlayer, player1.score, player2?.score]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md select-none overflow-y-auto pointer-events-auto">
      <div className="relative w-full max-w-lg my-auto p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 border-2 border-amber-400/60 shadow-[0_0_60px_rgba(251,191,36,0.35)] flex flex-col items-center text-center">
        {/* Animated Celebration Badge */}
        <div className="flex items-center gap-2 mb-2">
          {[1, 2, 3].map(starIndex => (
            <div
              key={starIndex}
              className={`text-4xl sm:text-5xl transition-transform ${
                starIndex <= starCount
                  ? 'text-amber-300 drop-shadow-[0_0_12px_rgba(251,191,36,0.9)] animate-bounce'
                  : 'text-slate-600 scale-75 opacity-40'
              }`}
              style={{ animationDelay: `${starIndex * 0.15}s` }}
            >
              ★
            </div>
          ))}
        </div>

        {/* Title */}
        <h2 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-amber-300 to-orange-400 drop-shadow">
          {isTwoPlayer
            ? player1.score > player2.score
              ? '1. Oyuncu Kazandı!'
              : player2.score > player1.score
              ? '2. Oyuncu Kazandı!'
              : 'Dostluk Kazandı!'
            : 'Harika İş Çıkardın!'}
        </h2>
        <p className="mt-1 text-slate-300 text-sm font-semibold">
          {totalRounds} turu başarıyla tamamladın!
        </p>

        {/* Stats Grid */}
        {!isTwoPlayer ? (
          <div className="w-full my-6 grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 flex flex-col items-center">
              <span className="text-xs text-slate-400 font-bold uppercase">Toplam Puan</span>
              <span className="text-3xl font-black text-amber-300 tabular-nums">{player1.score}</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 flex flex-col items-center">
              <span className="text-xs text-slate-400 font-bold uppercase">Doğru Cevap</span>
              <span className="text-3xl font-black text-emerald-300 tabular-nums">
                {player1.correctAnswers} / {totalRounds}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 flex flex-col items-center">
              <span className="text-xs text-slate-400 font-bold uppercase">İsabet Oranı</span>
              <span className="text-3xl font-black text-cyan-300 tabular-nums">%{p1Acc}</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 flex flex-col items-center">
              <span className="text-xs text-slate-400 font-bold uppercase">En İyi Kombo</span>
              <span className="text-3xl font-black text-purple-300 tabular-nums">{player1.bestCombo}x</span>
            </div>
          </div>
        ) : (
          /* 2-Player Side-by-Side Comparison */
          <div className="w-full my-6 grid grid-cols-2 gap-3 text-left">
            {/* Player 1 Box */}
            <div className="p-4 rounded-2xl bg-cyan-950/60 border border-cyan-500/60 flex flex-col">
              <div className="text-xs font-black text-cyan-300 uppercase">1. Oyuncu (Mavi)</div>
              <div className="mt-2 text-3xl font-black text-white tabular-nums">{player1.score} Puan</div>
              <div className="mt-2 text-xs text-cyan-200 font-semibold space-y-1">
                <div>Doğru: {player1.correctAnswers}</div>
                <div>En İyi Kombo: {player1.bestCombo}x</div>
              </div>
            </div>

            {/* Player 2 Box */}
            <div className="p-4 rounded-2xl bg-orange-950/60 border border-orange-500/60 flex flex-col">
              <div className="text-xs font-black text-orange-300 uppercase">2. Oyuncu (Turuncu)</div>
              <div className="mt-2 text-3xl font-black text-white tabular-nums">{player2.score} Puan</div>
              <div className="mt-2 text-xs text-orange-200 font-semibold space-y-1">
                <div>Doğru: {player2.correctAnswers}</div>
                <div>En İyi Kombo: {player2.bestCombo}x</div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-3 w-full">
          <button
            type="button"
            onClick={() => {
              AudioManager.playClick();
              onPlayAgain();
            }}
            className="flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 text-slate-950 font-black text-base shadow-[0_0_20px_rgba(16,185,129,0.5)] transition-transform active:scale-95 cursor-pointer"
          >
            Tekrar Oyna
          </button>

          <button
            type="button"
            onClick={() => {
              AudioManager.playClick();
              onBackToMenu();
            }}
            className="flex-1 py-3.5 px-6 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-black text-base border border-slate-700 transition-transform active:scale-95 cursor-pointer"
          >
            Ana Menü
          </button>
        </div>
      </div>
    </div>
  );
};
