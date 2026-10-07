export type GameState =
  | 'MENU'
  | 'STORY_INTRO'
  | 'COUNTDOWN'
  | 'PLAYING'
  | 'ROUND_RESOLVING'
  | 'RESULT_SCREEN'
  | 'SETTINGS'
  | 'LETTER_SETTINGS';

export type PlayerMode = '1P' | '2P';

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface AsteroidData {
  id: string;
  word: string;
  isTarget: boolean;
  baseX: number; // percentage 0-100
  baseY: number; // percentage 0-100
  size: number;  // px: e.g. 110 - 150
  speedX: number;
  speedY: number;
  phaseX: number;
  phaseY: number;
  amplitudeX: number;
  amplitudeY: number;
  rotationSpeed: number;
  rotationAmplitude: number;
  colorTheme: 'rock' | 'gem-cyan' | 'gem-purple' | 'gem-amber' | 'gem-emerald' | 'crystal-rose';
  craterSeeds: number[];
}

export interface PlayerStats {
  id: 1 | 2;
  name: string;
  score: number;
  combo: number;
  bestCombo: number;
  correctAnswers: number;
  totalAttempts: number;
  lives: number;
  color: string;
}

export type SpaceshipColor =
  | 'cyan'
  | 'orange'
  | 'purple'
  | 'green'
  | 'ruby'
  | 'gold'
  | 'pink'
  | 'midnight'
  | 'teal'
  | 'lime';

export interface ProjectileState {
  id: string;
  startX: number; // px or %
  startY: number;
  targetX: number;
  targetY: number;
  angle: number;
  progress: number; // 0 to 1
  color: string;
  isMiss?: boolean;
}

export interface ExplosionState {
  id: string;
  x: number;
  y: number;
  color: string;
  fragmentsCount: number;
}

export interface FloatingScore {
  id: string;
  text: string;
  x: number;
  y: number;
  isPositive: boolean;
}

export interface GameSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  autoSpeakNext: boolean;
  difficulty: DifficultyLevel;
  playerMode: PlayerMode;
  spaceshipColor: SpaceshipColor;
  targetRounds: number;
  selectedVoiceURI: string;
  speechRate: number;
  speechPitch: number;
  speechVolume: number;
}

export interface LetterSettingConfig {
  allLettersEnabled: boolean;
  enabledLetters: string[]; // ['A', 'B', 'C', ...] uppercase
  finishScore: number;
}
