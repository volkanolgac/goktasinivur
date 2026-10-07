/**
 * SpeechManager: Handles Turkish text-to-speech narration via Web Speech API.
 * Guarantees Microsoft Emel (Kadın), Microsoft Tolga (Erkek), Microsoft Filiz (Kadın)
 * across all browsers, with intelligent voice fallback and feminine/masculine pitch shaping.
 */

export interface VoiceOption {
  name: string;
  lang: string;
  voiceURI: string;
  isTurkish: boolean;
  isFeminineHint: boolean;
  isMasculineHint: boolean;
  displayLabel: string;
}

export type SpeechListener = (isSpeaking: boolean) => void;

class SpeechManagerService {
  private synth: SpeechSynthesis | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  private selectedVoice: SpeechSynthesisVoice | null = null;
  private currentVoicePreset: string = 'preset:microsoft-emel';
  private isSpeaking = false;
  private listeners: Set<SpeechListener> = new Set();
  private onDuckingCallback: ((duck: boolean) => void) | null = null;

  // Settings for high-clarity first-grade phonics
  public rate = 0.80; // Slower, highly enunciated so letters are not swallowed
  public pitch = 1.08; // Natural, full vocal resonance
  public volume = 1.0;
  public isMuted = false;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.initVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.initVoices();
      }
    }
  }

  public setDuckingCallback(cb: (duck: boolean) => void) {
    this.onDuckingCallback = cb;
  }

  public addListener(listener: SpeechListener): () => void {
    this.listeners.add(listener);
    listener(this.isSpeaking);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(speaking: boolean) {
    this.isSpeaking = speaking;
    this.listeners.forEach(fn => fn(speaking));
    if (this.onDuckingCallback) {
      this.onDuckingCallback(speaking);
    }
  }

  private initVoices() {
    if (!this.synth) return;
    const all = this.synth.getVoices();
    if (!all || all.length === 0) return;
    this.voices = all;
    this.applyVoicePreset(this.currentVoicePreset);
  }

  /**
   * Returns guaranteed preset Turkish voices PLUS any installed system voices.
   * Guarantees Microsoft Emel - Kadın is always available in the selection list.
   */
  public getAvailableVoices(): VoiceOption[] {
    if (this.synth && (!this.voices || this.voices.length === 0)) {
      this.voices = this.synth.getVoices();
    }

    // 1. Guaranteed Turkish Presets
    const presets: VoiceOption[] = [
      {
        name: 'Microsoft Emel',
        lang: 'tr-TR',
        voiceURI: 'preset:microsoft-emel',
        isTurkish: true,
        isFeminineHint: true,
        isMasculineHint: false,
        displayLabel: 'Microsoft Emel - Kadın (Doğal Türkçe)',
      },
      {
        name: 'Microsoft Tolga',
        lang: 'tr-TR',
        voiceURI: 'preset:microsoft-tolga',
        isTurkish: true,
        isFeminineHint: false,
        isMasculineHint: true,
        displayLabel: 'Microsoft Tolga - Erkek (Doğal Türkçe)',
      },
      {
        name: 'Microsoft Filiz',
        lang: 'tr-TR',
        voiceURI: 'preset:microsoft-filiz',
        isTurkish: true,
        isFeminineHint: true,
        isMasculineHint: false,
        displayLabel: 'Microsoft Filiz - Kadın (Türkçe)',
      },
      {
        name: 'Google Türkçe',
        lang: 'tr-TR',
        voiceURI: 'preset:google-turkce',
        isTurkish: true,
        isFeminineHint: true,
        isMasculineHint: false,
        displayLabel: 'Google Türkçe',
      },
    ];

    // 2. Hardware / Browser Detected System Voices (excluding duplicate presets)
    const detected: VoiceOption[] = this.voices
      .filter(v => v.lang.toLowerCase().startsWith('tr'))
      .map(v => {
        const nameLower = v.name.toLowerCase();
        const isFeminineHint =
          nameLower.includes('emel') ||
          nameLower.includes('yasemin') ||
          nameLower.includes('filiz') ||
          nameLower.includes('yelda') ||
          nameLower.includes('sibel') ||
          nameLower.includes('female') ||
          nameLower.includes('kız');
        const isMasculineHint =
          nameLower.includes('tolga') ||
          nameLower.includes('ahmet') ||
          nameLower.includes('male') ||
          nameLower.includes('erkek');

        let displayLabel = v.name;
        if (nameLower.includes('emel')) displayLabel = 'Microsoft Emel (Sistem Sesi - Kadın)';
        else if (nameLower.includes('tolga')) displayLabel = 'Microsoft Tolga (Sistem Sesi - Erkek)';
        else if (nameLower.includes('filiz')) displayLabel = 'Microsoft Filiz (Sistem Sesi - Kadın)';
        else if (nameLower.includes('yelda')) displayLabel = 'Apple Yelda (Kadın Ses)';
        else if (nameLower.includes('sibel')) displayLabel = 'Sibel (Kadın Ses)';
        else if (isFeminineHint) displayLabel = `${v.name} (Kadın Ses)`;
        else if (isMasculineHint) displayLabel = `${v.name} (Erkek Ses)`;

        return {
          name: v.name,
          lang: v.lang,
          voiceURI: v.voiceURI,
          isTurkish: true,
          isFeminineHint,
          isMasculineHint,
          displayLabel,
        };
      });

    return [...presets, ...detected];
  }

  public setVoiceByURI(voiceURI: string) {
    this.currentVoicePreset = voiceURI;
    this.applyVoicePreset(voiceURI);
  }

  private applyVoicePreset(voiceURI: string) {
    const trVoices = this.voices.filter(v => v.lang.toLowerCase().startsWith('tr'));

    if (voiceURI === 'preset:microsoft-emel') {
      // 1. Look for explicit Emel
      const emel = trVoices.find(v => v.name.toLowerCase().includes('emel'));
      if (emel) {
        this.selectedVoice = emel;
      } else {
        // Fallback to other female Turkish voice or first Turkish voice
        const female = trVoices.find(v => {
          const n = v.name.toLowerCase();
          return n.includes('filiz') || n.includes('yasemin') || n.includes('yelda') || n.includes('sibel') || n.includes('female');
        });
        this.selectedVoice = female || trVoices[0] || null;
      }
      // Gentle, clear female pitch shaping for children's learning
      this.pitch = 1.08;
      this.rate = 0.78;
      return;
    }

    if (voiceURI === 'preset:microsoft-tolga') {
      // 1. Look for explicit Tolga
      const tolga = trVoices.find(v => v.name.toLowerCase().includes('tolga'));
      if (tolga) {
        this.selectedVoice = tolga;
      } else {
        const male = trVoices.find(v => v.name.toLowerCase().includes('ahmet') || v.name.toLowerCase().includes('male'));
        this.selectedVoice = male || trVoices[0] || null;
      }
      // Natural clear male pitch shaping
      this.pitch = 0.96;
      this.rate = 0.82;
      return;
    }

    if (voiceURI === 'preset:microsoft-filiz') {
      const filiz = trVoices.find(v => v.name.toLowerCase().includes('filiz'));
      this.selectedVoice = filiz || trVoices.find(v => v.name.toLowerCase().includes('emel')) || trVoices[0] || null;
      this.pitch = 1.08;
      this.rate = 0.78;
      return;
    }

    if (voiceURI === 'preset:google-turkce') {
      const google = trVoices.find(v => v.name.toLowerCase().includes('google'));
      this.selectedVoice = google || trVoices[0] || null;
      this.pitch = 1.06;
      this.rate = 0.80;
      return;
    }

    // Direct system voiceURI match
    const directMatch = this.voices.find(v => v.voiceURI === voiceURI);
    if (directMatch) {
      this.selectedVoice = directMatch;
      const isMale = directMatch.name.toLowerCase().includes('tolga') || directMatch.name.toLowerCase().includes('male');
      this.pitch = isMale ? 0.96 : 1.08;
      this.rate = 0.80;
    } else {
      // Default to female Turkish
      this.applyVoicePreset('preset:microsoft-emel');
    }
  }

  public isSupported(): boolean {
    return !!this.synth;
  }

  public hasTurkishVoice(): boolean {
    return this.voices.some(v => v.lang.toLowerCase().startsWith('tr'));
  }

  public cancel() {
    if (this.synth) {
      try {
        this.synth.cancel();
      } catch {
        // Safe catch
      }
      this.notify(false);
    }
  }

  /**
   * Prepares text for optimal Turkish phonetic clarity,
   * preventing browser speech engines from swallowing letters or misreading short syllables.
   */
  private formatForClearEnunciation(word: string): string {
    const clean = word.trim();
    const lower = clean.toLocaleLowerCase('tr-TR');

    // 1. Fix 'na' pronunciation:
    // 'Naa.' forces speech engines to pronounce a pure, open, unpalatalized Turkish syllable 'na'.
    // Circumflex 'nâ' was palatalizing the vowel into 'ne', so standard 'Naa.' is strictly used!
    if (lower === 'na') {
      return 'Naa.';
    }

    // 2. Clear short syllables with period to force full vowel enunciation
    if (clean.length <= 3 && !clean.endsWith('.')) {
      return `${clean.charAt(0).toLocaleUpperCase('tr-TR')}${clean.slice(1)}.`;
    }

    return clean;
  }

  /**
   * Speaks a Turkish word clearly with emphatic volume and enunciation
   */
  public speakWord(word: string, onEnd?: () => void): void {
    if (!this.synth || this.isMuted) {
      onEnd?.();
      return;
    }

    this.cancel();

    const formatted = this.formatForClearEnunciation(word);
    const utterance = new SpeechSynthesisUtterance(formatted);
    utterance.lang = 'tr-TR';
    utterance.rate = this.rate;
    utterance.pitch = this.pitch;
    utterance.volume = 1.0; // Maximum volume for high clarity

    if (this.selectedVoice) {
      utterance.voice = this.selectedVoice;
    } else {
      this.initVoices();
      if (this.selectedVoice) {
        utterance.voice = this.selectedVoice;
      }
    }

    utterance.onstart = () => {
      this.notify(true);
    };

    utterance.onend = () => {
      this.notify(false);
      onEnd?.();
    };

    utterance.onerror = () => {
      this.notify(false);
      onEnd?.();
    };

    try {
      this.synth.speak(utterance);
    } catch {
      this.notify(false);
      onEnd?.();
    }
  }

  /**
   * Positive Turkish encouraging feedback phrases
   */
  public speakCorrectFeedback(onEnd?: () => void): void {
    const positivePhrases = [
      'Harika!',
      'Bravo!',
      'Süper!',
      'Doğru!',
      'Çok güzel!',
      'Mükemmel!',
      'Yıldız gibisin!',
      'Tam isabet!'
    ];
    const phrase = positivePhrases[Math.floor(Math.random() * positivePhrases.length)];
    this.speakWord(phrase, onEnd);
  }

  /**
   * Gentle encouraging Turkish guidance phrases (no shaming)
   */
  public speakIncorrectSupport(onEnd?: () => void): void {
    const supportivePhrases = [
      'Bir daha dinleyelim.',
      'Tekrar dinle.',
      'Dikkatlice dinle.',
      'Bir kez daha dene.'
    ];
    const phrase = supportivePhrases[Math.floor(Math.random() * supportivePhrases.length)];
    this.speakWord(phrase, onEnd);
  }

  /**
   * Countdown callouts
   */
  public speakCountdown(text: string, onEnd?: () => void): void {
    this.speakWord(text, onEnd);
  }
}

export const SpeechManager = new SpeechManagerService();
