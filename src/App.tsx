import { useState, useEffect, useMemo } from 'react';
import { GameState, GameSettings, LetterSettingConfig, PlayerStats, PlayerMode } from './types/game';
import { SpaceBackground } from './components/SpaceBackground';
import { MainMenu } from './components/MainMenu';
import { StoryIntroModal } from './components/StoryIntroModal';
import { CountdownOverlay } from './components/CountdownOverlay';
import { GameScreen } from './components/GameScreen';
import { ResultScreen } from './components/ResultScreen';
import { LetterSettingsModal } from './components/LetterSettingsModal';
import { SettingsModal } from './components/SettingsModal';
import {
  loadStoredSettings,
  saveStoredSettings,
  loadStoredLetterConfig,
  saveStoredLetterConfig,
  loadHighScore,
  saveHighScore,
} from './utils/storage';
import { getFilteredWordPool } from './data/wordBank';
import { AudioManager } from './services/AudioManager';
import { SpeechManager } from './services/SpeechManager';

export default function App() {
  // Main Game State Machine
  const [gameState, setGameState] = useState<GameState>('MENU');

  // Stored Settings & Letter Configurations
  const [settings, setSettings] = useState<GameSettings>(() => loadStoredSettings());
  const [letterConfig, setLetterConfig] = useState<LetterSettingConfig>(() => loadStoredLetterConfig());
  const [highScore, setHighScore] = useState<number>(() => loadHighScore());

  // Result stats from finished session
  const [finalPlayer1, setFinalPlayer1] = useState<PlayerStats | null>(null);
  const [finalPlayer2, setFinalPlayer2] = useState<PlayerStats | null>(null);

  // Sync settings changes to storage & audio managers
  useEffect(() => {
    saveStoredSettings(settings);
    AudioManager.setSfxEnabled(settings.soundEnabled);
    AudioManager.setMusicEnabled(settings.musicEnabled);
    if (settings.selectedVoiceURI) {
      SpeechManager.setVoiceByURI(settings.selectedVoiceURI);
    }
  }, [settings]);

  // Sync letter configuration changes
  useEffect(() => {
    saveStoredLetterConfig(letterConfig);
  }, [letterConfig]);

  // Count available words based on letter filter
  const totalFilteredWords = useMemo(() => {
    return getFilteredWordPool(
      letterConfig.enabledLetters,
      letterConfig.allLettersEnabled,
      settings.difficulty
    ).length;
  }, [letterConfig, settings.difficulty]);

  // Letter count summary for main menu badge
  const letterCountSummary = useMemo(() => {
    if (letterConfig.allLettersEnabled) {
      return `Hepsi (29)`;
    }
    if (letterConfig.enabledLetters.length === 1 && letterConfig.enabledLetters[0] === 'N') {
      return 'A + N Modeli';
    }
    if (letterConfig.enabledLetters.length <= 4) {
      return `A + ${letterConfig.enabledLetters.join(',')}`;
    }
    return `A + ${letterConfig.enabledLetters.length} Harf`;
  }, [letterConfig]);

  // High score update handler
  const handleUpdateHighScore = (score: number) => {
    if (score > highScore) {
      setHighScore(score);
      saveHighScore(score);
    }
  };

  // State Transitions
  const handleStartFromMenu = () => {
    // Show short story intro on first start
    setGameState('STORY_INTRO');
  };

  const handleStartCountdown = () => {
    setGameState('COUNTDOWN');
  };

  const handleCountdownFinish = () => {
    setGameState('PLAYING');
  };

  const handleGameComplete = (p1: PlayerStats, p2?: PlayerStats) => {
    setFinalPlayer1(p1);
    setFinalPlayer2(p2 || null);
    handleUpdateHighScore(p1.score);
    if (p2) handleUpdateHighScore(p2.score);
    setGameState('RESULT_SCREEN');
  };

  const handlePlayAgain = () => {
    setGameState('COUNTDOWN');
  };

  const handleBackToMenu = () => {
    SpeechManager.cancel();
    setGameState('MENU');
  };

  const handleSelectPlayerMode = (mode: PlayerMode) => {
    setSettings(prev => ({ ...prev, playerMode: mode }));
  };

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-slate-950 text-white font-['Fredoka','Nunito',sans-serif]">
      {/* Dynamic Cosmic Space Environment Background */}
      <SpaceBackground />

      {/* Primary Screen Views */}
      {gameState === 'MENU' && (
        <MainMenu
          onStartGame={handleStartFromMenu}
          onOpenLetterSettings={() => setGameState('LETTER_SETTINGS')}
          onOpenSettings={() => setGameState('SETTINGS')}
          playerMode={settings.playerMode}
          onSelectPlayerMode={handleSelectPlayerMode}
          difficulty={settings.difficulty}
          highScore={highScore}
          letterCountSummary={letterCountSummary}
          spaceshipColor={settings.spaceshipColor || 'cyan'}
        />
      )}

      {gameState === 'STORY_INTRO' && (
        <StoryIntroModal
          onStartCountdown={handleStartCountdown}
          onSkip={handleStartCountdown}
        />
      )}

      {gameState === 'COUNTDOWN' && (
        <CountdownOverlay onComplete={handleCountdownFinish} />
      )}

      {gameState === 'PLAYING' && (
        <GameScreen
          settings={settings}
          letterConfig={letterConfig}
          onGameComplete={handleGameComplete}
          onBackToMenu={handleBackToMenu}
          onOpenSettings={() => setGameState('SETTINGS')}
          onUpdateHighScore={handleUpdateHighScore}
        />
      )}

      {gameState === 'RESULT_SCREEN' && finalPlayer1 && (
        <ResultScreen
          player1={finalPlayer1}
          player2={finalPlayer2 || undefined}
          playerMode={settings.playerMode}
          totalRounds={letterConfig.finishScore || settings.targetRounds}
          onPlayAgain={handlePlayAgain}
          onBackToMenu={handleBackToMenu}
        />
      )}

      {/* Letter Settings Modal */}
      {gameState === 'LETTER_SETTINGS' && (
        <LetterSettingsModal
          config={letterConfig}
          onChange={cfg => setLetterConfig(cfg)}
          onClose={() => setGameState('MENU')}
          totalFilteredWords={totalFilteredWords}
        />
      )}

      {/* Settings Modal */}
      {gameState === 'SETTINGS' && (
        <SettingsModal
          settings={settings}
          onChange={st => setSettings(st)}
          onClose={() => setGameState(finalPlayer1 ? 'PLAYING' : 'MENU')}
        />
      )}
    </main>
  );
}
