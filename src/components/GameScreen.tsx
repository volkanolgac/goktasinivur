import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  AsteroidData,
  FloatingScore,
  GameSettings,
  LetterSettingConfig,
  PlayerStats,
  ProjectileState,
  ExplosionState,
} from '../types/game';
import { Asteroid } from './Asteroid';
import { Spaceship } from './Spaceship';
import { ProjectileEffect } from './ProjectileEffect';
import { ExplosionParticles } from './ExplosionParticles';
import { ScorePopup } from './ScorePopup';
import { TopBarHUD } from './TopBarHUD';
import { BottomControls } from './BottomControls';
import { DebugOverlay } from './DebugOverlay';
import { getFilteredWordPool } from '../data/wordBank';
import { SpeechManager } from '../services/SpeechManager';
import { AudioManager } from '../services/AudioManager';

interface GameScreenProps {
  settings: GameSettings;
  letterConfig: LetterSettingConfig;
  onGameComplete: (p1: PlayerStats, p2?: PlayerStats) => void;
  onBackToMenu: () => void;
  onOpenSettings: () => void;
  onUpdateHighScore: (score: number) => void;
}

export const GameScreen: React.FC<GameScreenProps> = ({
  settings,
  letterConfig,
  onGameComplete,
  onBackToMenu,
  onOpenSettings,
  onUpdateHighScore,
}) => {
  const isTwoPlayer = settings.playerMode === '2P';

  // --- Players State ---
  const [player1, setPlayer1] = useState<PlayerStats>({
    id: 1,
    name: '1. Oyuncu',
    score: 0,
    combo: 0,
    bestCombo: 0,
    correctAnswers: 0,
    totalAttempts: 0,
    lives: 3,
    color: '#0ea5e9',
  });

  const [player2, setPlayer2] = useState<PlayerStats>({
    id: 2,
    name: '2. Oyuncu',
    score: 0,
    combo: 0,
    bestCombo: 0,
    correctAnswers: 0,
    totalAttempts: 0,
    lives: 3,
    color: '#f97316',
  });

  // --- Round & Target State ---
  const [currentRound, setCurrentRound] = useState<number>(1);
  const [currentTargetWord, setCurrentTargetWord] = useState<string>('');
  const [asteroidsP1, setAsteroidsP1] = useState<AsteroidData[]>([]);
  const [asteroidsP2, setAsteroidsP2] = useState<AsteroidData[]>([]);
  const [asteroidStatusesP1, setAsteroidStatusesP1] = useState<Record<string, 'idle' | 'selected-correct' | 'selected-wrong' | 'dimmed' | 'exploding'>>({});
  const [asteroidStatusesP2, setAsteroidStatusesP2] = useState<Record<string, 'idle' | 'selected-correct' | 'selected-wrong' | 'dimmed' | 'exploding'>>({});

  // Round locks & timing
  const [isRoundLocked, setIsRoundLocked] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const roundStartTimeRef = useRef<number>(Date.now());
  const recentWordsRef = useRef<string[]>([]);

  // Spaceship visual targeting states (Cursor tracking)
  const [ship1Angle, setShip1Angle] = useState<number>(0);
  const [isShip1Firing, setIsShip1Firing] = useState<boolean>(false);
  const [ship2Angle, setShip2Angle] = useState<number>(0);
  const [isShip2Firing, setIsShip2Firing] = useState<boolean>(false);

  // Transient projectile and particle animations
  const [activeProjectile, setActiveProjectile] = useState<ProjectileState | null>(null);
  const [activeExplosion, setActiveExplosion] = useState<ExplosionState | null>(null);
  const [floatingScores, setFloatingScores] = useState<FloatingScore[]>([]);

  // Oscillation time counter for fluid physics
  const [animTime, setAnimTime] = useState<number>(0);

  // Refs for positions
  const containerRef = useRef<HTMLDivElement>(null);
  const ship1Ref = useRef<HTMLDivElement>(null);
  const ship2Ref = useRef<HTMLDivElement>(null);

  // STRICT Filtered Word Pool based on Maarif letter filter & difficulty
  const wordPool = useMemo(() => {
    return getFilteredWordPool(
      letterConfig.enabledLetters,
      letterConfig.allLettersEnabled,
      settings.difficulty
    );
  }, [letterConfig, settings.difficulty]);

  // Speech listener hook
  useEffect(() => {
    const unsub = SpeechManager.addListener(speaking => {
      setIsSpeaking(speaking);
      AudioManager.duckMusic(speaking);
    });
    return () => {
      unsub();
    };
  }, []);

  // Continuous Sinusoidal Floating Animation Loop
  useEffect(() => {
    let animId: number;
    let start = performance.now();

    const loop = (time: number) => {
      const elapsed = (time - start) / 1000;
      setAnimTime(elapsed);
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Mouse / Pointer Cursor Tracking for Spaceship
  useEffect(() => {
    const handlePointerMove = (e: PointerEvent | MouseEvent) => {
      // Calculate Ship 1 angle toward mouse cursor
      const ship1Elem = ship1Ref.current;
      if (ship1Elem) {
        const rect = ship1Elem.getBoundingClientRect();
        const shipX = rect.left + rect.width / 2;
        const shipY = rect.top + rect.height / 2;
        const dx = e.clientX - shipX;
        const dy = e.clientY - shipY;
        const angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
        setShip1Angle(angle);
      }

      // If Two Player mode, Ship 2 tracks cursor on right half
      if (isTwoPlayer) {
        const ship2Elem = ship2Ref.current;
        if (ship2Elem) {
          const rect = ship2Elem.getBoundingClientRect();
          const shipX = rect.left + rect.width / 2;
          const shipY = rect.top + rect.height / 2;
          const dx = e.clientX - shipX;
          const dy = e.clientY - shipY;
          const angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
          setShip2Angle(angle);
        }
      }
    };

    window.addEventListener('pointermove', handlePointerMove);
    return () => window.removeEventListener('pointermove', handlePointerMove);
  }, [isTwoPlayer]);

  // Asteroid Count based on Difficulty
  const asteroidCount = useMemo(() => {
    if (settings.difficulty === 'easy') return 4;
    if (settings.difficulty === 'hard') return 6;
    return 5;
  }, [settings.difficulty]);

  // Candidate Asteroid Slot Coordinates Generator
  const generateSlots = useCallback((count: number, isRightZone: boolean) => {
    const themes: AsteroidData['colorTheme'][] = [
      'gem-cyan', 'gem-purple', 'gem-amber', 'gem-emerald', 'crystal-rose', 'rock'
    ];

    let xRangeStart = 12;
    let xRangeEnd = 88;

    if (isTwoPlayer) {
      if (!isRightZone) {
        xRangeStart = 8;
        xRangeEnd = 44;
      } else {
        xRangeStart = 56;
        xRangeEnd = 92;
      }
    }

    const stepX = (xRangeEnd - xRangeStart) / (count - 1 || 1);
    const slots: { x: number; y: number }[] = [];
    const yPresets = [26, 18, 34, 22, 38, 20];

    for (let i = 0; i < count; i++) {
      slots.push({
        x: xRangeStart + i * stepX + (Math.random() * 4 - 2),
        y: yPresets[i % yPresets.length] + (Math.random() * 4 - 2),
      });
    }

    return slots.map((pos, idx) => ({
      slotIdx: idx,
      baseX: pos.x,
      baseY: pos.y,
      theme: themes[idx % themes.length],
    }));
  }, [isTwoPlayer]);

  // Spawn New Round
  const startNewRound = useCallback((roundNum: number) => {
    setIsRoundLocked(false);
    setActiveProjectile(null);
    setActiveExplosion(null);
    setIsShip1Firing(false);
    setIsShip2Firing(false);

    if (wordPool.length === 0) return;

    // 1. Pick target word avoiding recent repeats
    let availableTargets = wordPool.filter(w => !recentWordsRef.current.includes(w.word));
    if (availableTargets.length === 0) {
      availableTargets = wordPool;
      recentWordsRef.current = [];
    }

    const targetItem = availableTargets[Math.floor(Math.random() * availableTargets.length)];
    const targetWord = targetItem.word;
    setCurrentTargetWord(targetWord);
    recentWordsRef.current.push(targetWord);
    if (recentWordsRef.current.length > 5) {
      recentWordsRef.current.shift();
    }

    // 2. Pick candidate words (1 target + N-1 distractors, strictly unique)
    const distractors = wordPool.filter(w => w.word !== targetWord);
    const shuffledDistractors = [...distractors].sort(() => Math.random() - 0.5);
    const selectedDistractors = shuffledDistractors.slice(0, asteroidCount - 1);

    const candidateWords = [targetWord, ...selectedDistractors.map(d => d.word)];
    // Shuffle candidates
    candidateWords.sort(() => Math.random() - 0.5);

    // 3. Generate Asteroids for Player 1
    const p1Slots = generateSlots(asteroidCount, false);
    const p1Asteroids: AsteroidData[] = candidateWords.map((w, idx) => {
      const slot = p1Slots[idx];
      return {
        id: `p1-ast-${roundNum}-${idx}`,
        word: w,
        isTarget: w === targetWord,
        baseX: slot.baseX,
        baseY: slot.baseY,
        size: isTwoPlayer ? 105 : 124,
        speedX: 0.8 + Math.random() * 0.6,
        speedY: 0.7 + Math.random() * 0.5,
        phaseX: Math.random() * Math.PI * 2,
        phaseY: Math.random() * Math.PI * 2,
        amplitudeX: 12 + Math.random() * 8,
        amplitudeY: 10 + Math.random() * 7,
        rotationSpeed: 0.5 + Math.random() * 0.5,
        rotationAmplitude: 6 + Math.random() * 5,
        colorTheme: slot.theme,
        craterSeeds: [1, 2, 3],
      };
    });

    setAsteroidsP1(p1Asteroids);
    const statusMap1: Record<string, 'idle'> = {};
    p1Asteroids.forEach(a => (statusMap1[a.id] = 'idle'));
    setAsteroidStatusesP1(statusMap1);

    // 4. Generate Asteroids for Player 2 if in 2P mode
    if (isTwoPlayer) {
      const p2Slots = generateSlots(asteroidCount, true);
      const p2Asteroids: AsteroidData[] = candidateWords.map((w, idx) => {
        const slot = p2Slots[idx];
        return {
          id: `p2-ast-${roundNum}-${idx}`,
          word: w,
          isTarget: w === targetWord,
          baseX: slot.baseX,
          baseY: slot.baseY,
          size: 105,
          speedX: 0.8 + Math.random() * 0.6,
          speedY: 0.7 + Math.random() * 0.5,
          phaseX: Math.random() * Math.PI * 2,
          phaseY: Math.random() * Math.PI * 2,
          amplitudeX: 12 + Math.random() * 8,
          amplitudeY: 10 + Math.random() * 7,
          rotationSpeed: 0.5 + Math.random() * 0.5,
          rotationAmplitude: 6 + Math.random() * 5,
          colorTheme: slot.theme,
          craterSeeds: [1, 2, 3],
        };
      });

      setAsteroidsP2(p2Asteroids);
      const statusMap2: Record<string, 'idle'> = {};
      p2Asteroids.forEach(a => (statusMap2[a.id] = 'idle'));
      setAsteroidStatusesP2(statusMap2);
    }

    roundStartTimeRef.current = Date.now();

    // Auto-Speak Word if enabled
    if (settings.autoSpeakNext) {
      setTimeout(() => {
        SpeechManager.speakWord(targetWord);
      }, 350);
    }
  }, [asteroidCount, generateSlots, isTwoPlayer, settings.autoSpeakNext, wordPool]);

  // Start initial round
  useEffect(() => {
    startNewRound(1);
  }, [startNewRound]);

  // Repeat current target word
  const handleRepeatWord = useCallback(() => {
    AudioManager.playClick();
    if (currentTargetWord) {
      SpeechManager.speakWord(currentTargetWord);
    }
  }, [currentTargetWord]);

  // Keyboard shortcut listener (Space: repeat, Escape: menu)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        handleRepeatWord();
      } else if (e.code === 'Escape') {
        e.preventDefault();
        onBackToMenu();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleRepeatWord, onBackToMenu]);

  // Spawn Score Pop-up
  const triggerScorePopup = (text: string, x: number, y: number, isPositive: boolean) => {
    const id = `score-${Date.now()}-${Math.random()}`;
    setFloatingScores(prev => [...prev, { id, text, x, y, isPositive }]);
    setTimeout(() => {
      setFloatingScores(prev => prev.filter(s => s.id !== id));
    }, 1100);
  };

  // Asteroid Selection Handler (Core Gameplay Sequence)
  const handleAsteroidClick = (
    asteroid: AsteroidData,
    targetElement: HTMLElement,
    playerId: 1 | 2
  ) => {
    if (isRoundLocked) return;

    const isP1 = playerId === 1;
    const isCorrect = asteroid.word === currentTargetWord;

    // Spatial calculations
    const targetRect = targetElement.getBoundingClientRect();
    const targetCenterX = targetRect.left + targetRect.width / 2;
    const targetCenterY = targetRect.top + targetRect.height / 2;

    const shipElem = isP1 ? ship1Ref.current : (ship2Ref.current || ship1Ref.current);
    let shipCenterX = window.innerWidth / (isTwoPlayer ? 4 : 2);
    let shipCenterY = window.innerHeight * 0.88;

    if (shipElem) {
      const shipRect = shipElem.getBoundingClientRect();
      shipCenterX = shipRect.left + shipRect.width / 2;
      shipCenterY = shipRect.top + shipRect.height / 2;
    }

    const deltaX = targetCenterX - shipCenterX;
    const deltaY = targetCenterY - shipCenterY;
    const targetAngle = Math.atan2(deltaY, deltaX) * (180 / Math.PI) + 90;

    // Lock round temporarily during projectile flight
    setIsRoundLocked(true);

    if (isP1) {
      setShip1Angle(targetAngle);
      setIsShip1Firing(true);
    } else {
      setShip2Angle(targetAngle);
      setIsShip2Firing(true);
    }

    AudioManager.playShoot();

    if (!isCorrect) {
      // ==========================================
      // INCORRECT SELECTION (Ateş ıskalayıp dışarı gider!)
      // ==========================================
      const dist = Math.hypot(deltaX, deltaY);
      const normX = deltaX / (dist || 1);
      const normY = deltaY / (dist || 1);
      const perpX = -normY;
      const perpY = normX;
      const sideOffset = (Math.random() > 0.5 ? 1 : -1) * 85;

      // Projectile passes right next to the asteroid and flies off the screen into space!
      const missTargetX = shipCenterX + normX * (dist + 750) + perpX * sideOffset;
      const missTargetY = shipCenterY + normY * (dist + 750) + perpY * sideOffset;
      const missAngle = Math.atan2(missTargetY - shipCenterY, missTargetX - shipCenterX) * (180 / Math.PI);

      const projId = `proj-miss-${Date.now()}`;
      const projectileObj: ProjectileState = {
        id: projId,
        startX: shipCenterX,
        startY: shipCenterY - 20,
        targetX: missTargetX,
        targetY: missTargetY,
        angle: missAngle,
        progress: 0,
        color: '#f43f5e',
        isMiss: true,
      };
      setActiveProjectile(projectileObj);

      // Soft pink flash & wobble on target asteroid
      if (isP1) {
        setAsteroidStatusesP1(prev => ({ ...prev, [asteroid.id]: 'selected-wrong' }));
        setTimeout(() => {
          setAsteroidStatusesP1(prev => ({ ...prev, [asteroid.id]: 'idle' }));
        }, 600);
      } else {
        setAsteroidStatusesP2(prev => ({ ...prev, [asteroid.id]: 'selected-wrong' }));
        setTimeout(() => {
          setAsteroidStatusesP2(prev => ({ ...prev, [asteroid.id]: 'idle' }));
        }, 600);
      }

      // Update player attempts
      if (isP1) {
        setPlayer1(prev => ({
          ...prev,
          totalAttempts: prev.totalAttempts + 1,
          combo: 0,
        }));
      } else {
        setPlayer2(prev => ({
          ...prev,
          totalAttempts: prev.totalAttempts + 1,
          combo: 0,
        }));
      }

      // Projectile animation loop (flies past and out into space)
      const travelDuration = 360; // ms
      const projStartTime = performance.now();

      const animMissProjectile = (now: number) => {
        const elapsed = now - projStartTime;
        const progress = Math.min(1, elapsed / travelDuration);

        setActiveProjectile(prev => prev ? { ...prev, progress } : null);

        if (progress < 1) {
          requestAnimationFrame(animMissProjectile);
        } else {
          // As laser leaves the screen, play the disappointed/miss cartoon sound!
          setActiveProjectile(null);
          setIsShip1Firing(false);
          setIsShip2Firing(false);
          AudioManager.playMiss();

          // Supportive voice & repeat target word
          SpeechManager.speakIncorrectSupport(() => {
            setTimeout(() => {
              SpeechManager.speakWord(currentTargetWord);
              setIsRoundLocked(false);
            }, 350);
          });
        }
      };

      requestAnimationFrame(animMissProjectile);
      return;
    }

    // ==========================================
    // CORRECT SELECTION (Doğru İsabet & Patlama)
    // ==========================================
    if (isP1) {
      setAsteroidStatusesP1(prev => {
        const next: Record<string, 'idle' | 'selected-correct' | 'dimmed'> = {};
        Object.keys(prev).forEach(k => {
          next[k] = k === asteroid.id ? 'selected-correct' : 'dimmed';
        });
        return next;
      });
    } else {
      setAsteroidStatusesP2(prev => {
        const next: Record<string, 'idle' | 'selected-correct' | 'dimmed'> = {};
        Object.keys(prev).forEach(k => {
          next[k] = k === asteroid.id ? 'selected-correct' : 'dimmed';
        });
        return next;
      });
    }

    const projId = `proj-${Date.now()}`;
    const projectileObj: ProjectileState = {
      id: projId,
      startX: shipCenterX,
      startY: shipCenterY - 20,
      targetX: targetCenterX,
      targetY: targetCenterY,
      angle: targetAngle - 90,
      progress: 0,
      color: isP1 ? '#38bdf8' : '#fb923c',
      isMiss: false,
    };
    setActiveProjectile(projectileObj);

    const travelDuration = 220; // ms
    const projStartTime = performance.now();

    const animProjectile = (now: number) => {
      const elapsed = now - projStartTime;
      const progress = Math.min(1, elapsed / travelDuration);

      setActiveProjectile(prev => prev ? { ...prev, progress } : null);

      if (progress < 1) {
        requestAnimationFrame(animProjectile);
      } else {
        // IMPACT!
        handleProjectileImpact(asteroid, targetCenterX, targetCenterY, isP1);
      }
    };

    requestAnimationFrame(animProjectile);
  };

  // Projectile Impact & Asteroid Explosion Sequence
  const handleProjectileImpact = (
    asteroid: AsteroidData,
    impactX: number,
    impactY: number,
    isP1: boolean
  ) => {
    setActiveProjectile(null);
    setIsShip1Firing(false);
    setIsShip2Firing(false);
    AudioManager.playImpact();
    AudioManager.playExplosion();

    // Trigger visual explosion and fragments
    setActiveExplosion({
      id: `expl-${Date.now()}`,
      x: impactX,
      y: impactY,
      color: isP1 ? '#38bdf8' : '#fb923c',
      fragmentsCount: 16,
    });

    // Mark asteroid as exploding
    if (isP1) {
      setAsteroidStatusesP1(prev => ({ ...prev, [asteroid.id]: 'exploding' }));
    } else {
      setAsteroidStatusesP2(prev => ({ ...prev, [asteroid.id]: 'exploding' }));
    }

    // Scoring & Combo Calculations
    const responseTimeSec = (Date.now() - roundStartTimeRef.current) / 1000;
    const isFast = responseTimeSec <= 3.2;

    const scoringPlayer = isP1 ? player1 : player2;
    const newCombo = scoringPlayer.combo + 1;
    let comboBonus = 0;
    if (newCombo === 2) comboBonus = 2;
    else if (newCombo === 3) comboBonus = 5;
    else if (newCombo === 4) comboBonus = 10;
    else if (newCombo >= 5) comboBonus = 15;

    const fastBonus = isFast ? 5 : 0;
    const totalGainedPoints = 10 + comboBonus + fastBonus;

    let popupText = `+${totalGainedPoints}`;
    if (newCombo > 1) {
      popupText += ` (${newCombo}x Kombo!)`;
    }
    triggerScorePopup(popupText, impactX, impactY, true);

    if (newCombo > 1) {
      AudioManager.playCombo();
    } else {
      AudioManager.playCorrect();
    }

    // Update Player Stats
    let updatedP1 = player1;
    let updatedP2 = player2;

    if (isP1) {
      updatedP1 = {
        ...player1,
        score: player1.score + totalGainedPoints,
        combo: newCombo,
        bestCombo: Math.max(player1.bestCombo, newCombo),
        correctAnswers: player1.correctAnswers + 1,
        totalAttempts: player1.totalAttempts + 1,
      };
      setPlayer1(updatedP1);
      onUpdateHighScore(updatedP1.score);
    } else {
      updatedP2 = {
        ...player2,
        score: player2.score + totalGainedPoints,
        combo: newCombo,
        bestCombo: Math.max(player2.bestCombo, newCombo),
        correctAnswers: player2.correctAnswers + 1,
        totalAttempts: player2.totalAttempts + 1,
      };
      setPlayer2(updatedP2);
      onUpdateHighScore(updatedP2.score);
    }

    // Celebratory Voice Feedback
    SpeechManager.speakCorrectFeedback();

    const nextRound = currentRound + 1;
    const maxRounds = letterConfig.finishScore || settings.targetRounds;

    setTimeout(() => {
      if (nextRound > maxRounds) {
        onGameComplete(updatedP1, isTwoPlayer ? updatedP2 : undefined);
      } else {
        setCurrentRound(nextRound);
        startNewRound(nextRound);
      }
    }, 1200);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-screen overflow-hidden select-none"
    >
      {/* Top HUD */}
      <TopBarHUD
        currentRound={currentRound}
        totalRounds={letterConfig.finishScore || settings.targetRounds}
        player1={player1}
        player2={isTwoPlayer ? player2 : undefined}
        isTwoPlayer={isTwoPlayer}
        isSpeaking={isSpeaking}
        onBackToMenu={onBackToMenu}
        onOpenSettings={onOpenSettings}
      />

      {/* Two Player Arena Divider */}
      {isTwoPlayer && (
        <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-0.5 bg-gradient-to-b from-transparent via-cyan-500/40 to-transparent pointer-events-none z-10">
          <div className="absolute top-20 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            Yarış
          </div>
        </div>
      )}

      {/* Main Asteroids Playground */}
      <div className="relative w-full h-full pt-16 pb-24 z-10 pointer-events-auto">
        {/* PLAYER 1 ASTEROIDS (Single Player Full Area or Left Side in 2P) */}
        {asteroidsP1.map(ast => (
          <Asteroid
            key={ast.id}
            data={ast}
            time={animTime}
            status={asteroidStatusesP1[ast.id] || 'idle'}
            onClick={(d, el) => handleAsteroidClick(d, el, 1)}
            disabled={isRoundLocked}
          />
        ))}

        {/* PLAYER 2 ASTEROIDS (Right Side in 2P) */}
        {isTwoPlayer &&
          asteroidsP2.map(ast => (
            <Asteroid
              key={ast.id}
              data={ast}
              time={animTime + 1.5}
              status={asteroidStatusesP2[ast.id] || 'idle'}
              onClick={(d, el) => handleAsteroidClick(d, el, 2)}
              disabled={isRoundLocked}
            />
          ))}
      </div>

      {/* SPACESHIP(S) AT BOTTOM: Continuous Mouse/Pointer Tracking & Gentle Idle Bouncing */}
      {!isTwoPlayer ? (
        /* Single Player Central Spaceship */
        <div
          ref={ship1Ref}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-20 pointer-events-none flex flex-col items-center"
        >
          <Spaceship
            rotationAngle={ship1Angle}
            isFiring={isShip1Firing}
            colorTheme={settings.spaceshipColor || 'cyan'}
            size={96}
          />
        </div>
      ) : (
        /* Two Player Spaceships (Left for P1, Right for P2) */
        <>
          <div
            ref={ship1Ref}
            className="fixed bottom-6 left-1/4 -translate-x-1/2 z-20 pointer-events-none flex flex-col items-center"
          >
            <div className="text-[10px] font-black text-cyan-300 -mb-1 drop-shadow">1. OYUNCU</div>
            <Spaceship
              rotationAngle={ship1Angle}
              isFiring={isShip1Firing}
              colorTheme={settings.spaceshipColor || 'cyan'}
              size={84}
            />
          </div>

          <div
            ref={ship2Ref}
            className="fixed bottom-6 left-3/4 -translate-x-1/2 z-20 pointer-events-none flex flex-col items-center"
          >
            <div className="text-[10px] font-black text-orange-300 -mb-1 drop-shadow">2. OYUNCU</div>
            <Spaceship
              rotationAngle={ship2Angle}
              isFiring={isShip2Firing}
              colorTheme={settings.spaceshipColor === 'orange' ? 'cyan' : 'orange'}
              size={84}
            />
          </div>
        </>
      )}

      {/* Active Projectile Energy Blast */}
      <ProjectileEffect projectile={activeProjectile} />

      {/* Active Asteroid Impact & Fragments Explosion */}
      <ExplosionParticles explosion={activeExplosion} />

      {/* Floating Animated Score Indicators */}
      <ScorePopup popups={floatingScores} />

      {/* Bottom Controls (Tekrar Dinle & Ses Sürekli Çal) */}
      <BottomControls
        onRepeatWord={handleRepeatWord}
        autoSpeak={settings.autoSpeakNext}
        onToggleAutoSpeak={() => onOpenSettings()}
        isSpeaking={isSpeaking}
      />

      {/* Debug Overlay (?debug=1) */}
      <DebugOverlay
        currentTargetWord={currentTargetWord}
        asteroids={asteroidsP1}
        settings={settings}
        letterConfig={letterConfig}
        player1={player1}
        currentRound={currentRound}
      />
    </div>
  );
};
