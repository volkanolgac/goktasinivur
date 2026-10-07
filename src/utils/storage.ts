import { GameSettings, LetterSettingConfig } from '../types/game';

const SETTINGS_KEY = 'gok-tasini-vur-settings-v1';
const LETTERS_KEY = 'gok-tasini-vur-letters-v1';
const HIGHSCORE_KEY = 'gok-tasini-vur-highscore-v1';

export const DEFAULT_SETTINGS: GameSettings = {
  soundEnabled: true,
  musicEnabled: true,
  autoSpeakNext: true,
  difficulty: 'medium',
  playerMode: '1P',
  spaceshipColor: 'cyan',
  targetRounds: 10,
  selectedVoiceURI: 'preset:microsoft-emel',
  speechRate: 0.90,
  speechPitch: 1.18,
  speechVolume: 1.0,
};

export const DEFAULT_LETTER_CONFIG: LetterSettingConfig = {
  allLettersEnabled: false,
  enabledLetters: ['N'], // Maarif Modeli: 'A' sabit, 'N' ile başlar (A N modeli)
  finishScore: 10,
};

export function loadStoredSettings(): GameSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveStoredSettings(settings: GameSettings): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    // LocalStorage quota or privacy mode error handling
  }
}

export function loadStoredLetterConfig(): LetterSettingConfig {
  if (typeof window === 'undefined') return DEFAULT_LETTER_CONFIG;
  try {
    const raw = localStorage.getItem(LETTERS_KEY);
    if (!raw) return DEFAULT_LETTER_CONFIG;
    return { ...DEFAULT_LETTER_CONFIG, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_LETTER_CONFIG;
  }
}

export function saveStoredLetterConfig(config: LetterSettingConfig): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LETTERS_KEY, JSON.stringify(config));
  } catch {
    // Safe catch
  }
}

export function loadHighScore(): number {
  if (typeof window === 'undefined') return 0;
  try {
    const raw = localStorage.getItem(HIGHSCORE_KEY);
    return raw ? parseInt(raw, 10) : 0;
  } catch {
    return 0;
  }
}

export function saveHighScore(score: number): void {
  if (typeof window === 'undefined') return;
  try {
    const prev = loadHighScore();
    if (score > prev) {
      localStorage.setItem(HIGHSCORE_KEY, score.toString());
    }
  } catch {
    // Safe catch
  }
}
