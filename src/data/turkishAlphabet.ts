// Türkiye Yüzyılı Maarif Modeli 1. Sınıf Okuma Yazma Ses Sırası & Alfabesi

export interface TurkishLetterItem {
  id: string;
  upper: string;
  lower: string;
  display: string;
}

// Maarif Model: 'A' harfi temel ses olarak ilk bölümden itibaren daima etkindir!
export const BASE_FIXED_LETTER = 'A';

// Maarif Model Seçilebilir Harf Listesi (Ekteki image.png ile birebir aynı dizilim)
// 1. Sıra (Hepsi + 5 harf): Nn, Ee, Tt, İi, Ll
// 2. Sıra (6 harf): Oo, Kk, Uu, Rr, Iı, Mm
// 3. Sıra (6 harf): Üü, Ss, Öö, Yy, Dd, Zz
// 4. Sıra (6 harf): Çç, Bb, Gg, Cc, Şş, Pp
// 5. Sıra (5 harf): Hh, Vv, Ğğ, Ff, Jj
export const MAARIF_SELECTABLE_LETTERS: TurkishLetterItem[] = [
  // 1. Grup sesleri (A sabit + N, E, T, İ, L)
  { id: 'N', upper: 'N', lower: 'n', display: 'Nn' },
  { id: 'E', upper: 'E', lower: 'e', display: 'Ee' },
  { id: 'T', upper: 'T', lower: 't', display: 'Tt' },
  { id: 'İ', upper: 'İ', lower: 'i', display: 'İi' },
  { id: 'L', upper: 'L', lower: 'l', display: 'Ll' },

  // 2. Grup sesleri (O, K, U, R, I, M)
  { id: 'O', upper: 'O', lower: 'o', display: 'Oo' },
  { id: 'K', upper: 'K', lower: 'k', display: 'Kk' },
  { id: 'U', upper: 'U', lower: 'u', display: 'Uu' },
  { id: 'R', upper: 'R', lower: 'r', display: 'Rr' },
  { id: 'I', upper: 'I', lower: 'ı', display: 'Iı' },
  { id: 'M', upper: 'M', lower: 'm', display: 'Mm' },

  // 3. Grup sesleri (Ü, S, Ö, Y, D, Z)
  { id: 'Ü', upper: 'Ü', lower: 'ü', display: 'Üü' },
  { id: 'S', upper: 'S', lower: 's', display: 'Ss' },
  { id: 'Ö', upper: 'Ö', lower: 'ö', display: 'Öö' },
  { id: 'Y', upper: 'Y', lower: 'y', display: 'Yy' },
  { id: 'D', upper: 'D', lower: 'd', display: 'Dd' },
  { id: 'Z', upper: 'Z', lower: 'z', display: 'Zz' },

  // 4. Grup sesleri (Ç, B, G, C, Ş, P)
  { id: 'Ç', upper: 'Ç', lower: 'ç', display: 'Çç' },
  { id: 'B', upper: 'B', lower: 'b', display: 'Bb' },
  { id: 'G', upper: 'G', lower: 'g', display: 'Gg' },
  { id: 'C', upper: 'C', lower: 'c', display: 'Cc' },
  { id: 'Ş', upper: 'Ş', lower: 'ş', display: 'Şş' },
  { id: 'P', upper: 'P', lower: 'p', display: 'Pp' },

  // 5. Grup sesleri (H, V, Ğ, F, J)
  { id: 'H', upper: 'H', lower: 'h', display: 'Hh' },
  { id: 'V', upper: 'V', lower: 'v', display: 'Vv' },
  { id: 'Ğ', upper: 'Ğ', lower: 'ğ', display: 'Ğğ' },
  { id: 'F', upper: 'F', lower: 'f', display: 'Ff' },
  { id: 'J', upper: 'J', lower: 'j', display: 'Jj' },
];

export const ALL_TURKISH_LETTERS = [
  'A',
  ...MAARIF_SELECTABLE_LETTERS.map(l => l.upper),
];

/**
 * Turkish uppercase converter (handles 'i' -> 'İ', 'ı' -> 'I')
 */
export function toTurkishUpper(str: string): string {
  return str.toLocaleUpperCase('tr-TR');
}

/**
 * Turkish lowercase converter (handles 'İ' -> 'i', 'I' -> 'ı')
 */
export function toTurkishLower(str: string): string {
  return str.toLocaleLowerCase('tr-TR');
}

/**
 * STRICT letter validator:
 * Every single character in word MUST be present in enabledSet!
 * If even one character is not allowed, returns false immediately.
 */
export function isWordStrictlyAllowed(word: string, enabledLetterUpperSet: Set<string>): boolean {
  if (enabledLetterUpperSet.size === 0) return false;
  const upperWord = toTurkishUpper(word.trim());
  for (let i = 0; i < upperWord.length; i++) {
    const char = upperWord[i];
    if (char === ' ' || char === '-') continue;
    if (!enabledLetterUpperSet.has(char)) {
      return false;
    }
  }
  return true;
}
