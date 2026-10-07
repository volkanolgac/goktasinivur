import { isWordStrictlyAllowed, ALL_TURKISH_LETTERS, toTurkishUpper } from './turkishAlphabet';

export interface WordItem {
  id: string;
  word: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category?: string;
}

// Maarif Modeli 1. Sınıf ses basamaklarına göre zenginleştirilmiş pedagojik kelime havuzu
export const WORD_BANK: WordItem[] = [
  // --- 1. A + N Basamağı ---
  { id: 'w_an_1', word: 'a', difficulty: 'easy', category: 'ses' },
  { id: 'w_an_2', word: 'an', difficulty: 'easy', category: 'hece' },
  { id: 'w_an_3', word: 'na', difficulty: 'easy', category: 'hece' },
  { id: 'w_an_4', word: 'ana', difficulty: 'easy', category: 'kelime' },
  { id: 'w_an_5', word: 'nan', difficulty: 'easy', category: 'hece' },
  { id: 'w_an_6', word: 'nana', difficulty: 'easy', category: 'kelime' },

  // --- 2. + E Basamağı (A, N, E) ---
  { id: 'w_ane_1', word: 'en', difficulty: 'easy', category: 'kelime' },
  { id: 'w_ane_2', word: 'ne', difficulty: 'easy', category: 'kelime' },
  { id: 'w_ane_3', word: 'anne', difficulty: 'easy', category: 'kelime' },
  { id: 'w_ane_4', word: 'nane', difficulty: 'easy', category: 'kelime' },
  { id: 'w_ane_5', word: 'nene', difficulty: 'easy', category: 'kelime' },
  { id: 'w_ane_6', word: 'ane', difficulty: 'easy', category: 'hece' },
  { id: 'w_ane_7', word: 'ene', difficulty: 'easy', category: 'hece' },
  { id: 'w_ane_8', word: 'nen', difficulty: 'easy', category: 'hece' },

  // --- 3. + T Basamağı (A, N, E, T) ---
  { id: 'w_t_1', word: 'at', difficulty: 'easy', category: 'kelime' },
  { id: 'w_t_2', word: 'et', difficulty: 'easy', category: 'kelime' },
  { id: 'w_t_3', word: 'ta', difficulty: 'easy', category: 'hece' },
  { id: 'w_t_4', word: 'te', difficulty: 'easy', category: 'hece' },
  { id: 'w_t_5', word: 'ata', difficulty: 'easy', category: 'kelime' },
  { id: 'w_t_6', word: 'tane', difficulty: 'easy', category: 'kelime' },
  { id: 'w_t_7', word: 'tat', difficulty: 'easy', category: 'kelime' },
  { id: 'w_t_8', word: 'net', difficulty: 'easy', category: 'kelime' },
  { id: 'w_t_9', word: 'tente', difficulty: 'medium', category: 'kelime' },
  { id: 'w_t_10', word: 'ten', difficulty: 'easy', category: 'kelime' },
  { id: 'w_t_11', word: 'ant', difficulty: 'easy', category: 'kelime' },

  // --- 4. + İ Basamağı (A, N, E, T, İ) ---
  { id: 'w_i_1', word: 'in', difficulty: 'easy', category: 'kelime' },
  { id: 'w_i_2', word: 'it', difficulty: 'easy', category: 'kelime' },
  { id: 'w_i_3', word: 'ni', difficulty: 'easy', category: 'hece' },
  { id: 'w_i_4', word: 'ti', difficulty: 'easy', category: 'hece' },
  { id: 'w_i_5', word: 'ani', difficulty: 'easy', category: 'kelime' },
  { id: 'w_i_6', word: 'ait', difficulty: 'easy', category: 'kelime' },
  { id: 'w_i_7', word: 'nine', difficulty: 'easy', category: 'kelime' },
  { id: 'w_i_8', word: 'tatil', difficulty: 'medium', category: 'kelime' },
  { id: 'w_i_9', word: 'itina', difficulty: 'medium', category: 'kelime' },
  { id: 'w_i_10', word: 'inlet', difficulty: 'medium', category: 'kelime' },
  { id: 'w_i_11', word: 'tin', difficulty: 'easy', category: 'hece' },

  // --- 5. + L Basamağı (A, N, E, T, İ, L) ---
  { id: 'w_l_1', word: 'al', difficulty: 'easy', category: 'kelime' },
  { id: 'w_l_2', word: 'el', difficulty: 'easy', category: 'kelime' },
  { id: 'w_l_3', word: 'il', difficulty: 'easy', category: 'kelime' },
  { id: 'w_l_4', word: 'la', difficulty: 'easy', category: 'hece' },
  { id: 'w_l_5', word: 'le', difficulty: 'easy', category: 'hece' },
  { id: 'w_l_6', word: 'li', difficulty: 'easy', category: 'hece' },
  { id: 'w_l_7', word: 'ala', difficulty: 'easy', category: 'kelime' },
  { id: 'w_l_8', word: 'ela', difficulty: 'easy', category: 'kelime' },
  { id: 'w_l_9', word: 'lale', difficulty: 'easy', category: 'kelime' },
  { id: 'w_l_10', word: 'ali', difficulty: 'easy', category: 'kelime' },
  { id: 'w_l_11', word: 'nil', difficulty: 'easy', category: 'kelime' },
  { id: 'w_l_12', word: 'tel', difficulty: 'easy', category: 'kelime' },
  { id: 'w_l_13', word: 'etli', difficulty: 'easy', category: 'kelime' },
  { id: 'w_l_14', word: 'ile', difficulty: 'easy', category: 'kelime' },
  { id: 'w_l_15', word: 'talat', difficulty: 'easy', category: 'kelime' },
  { id: 'w_l_16', word: 'atlet', difficulty: 'medium', category: 'kelime' },
  { id: 'w_l_17', word: 'lila', difficulty: 'easy', category: 'kelime' },
  { id: 'w_l_18', word: 'elit', difficulty: 'medium', category: 'kelime' },
  { id: 'w_l_19', word: 'elle', difficulty: 'easy', category: 'kelime' },
  { id: 'w_l_20', word: 'elli', difficulty: 'easy', category: 'kelime' },
  { id: 'w_l_21', word: 'alet', difficulty: 'easy', category: 'kelime' },
  { id: 'w_l_22', word: 'nal', difficulty: 'easy', category: 'kelime' },
  { id: 'w_l_23', word: 'nitel', difficulty: 'medium', category: 'kelime' },

  // --- 6. + O Basamağı ---
  { id: 'w_o_1', word: 'on', difficulty: 'easy', category: 'kelime' },
  { id: 'w_o_2', word: 'ot', difficulty: 'easy', category: 'kelime' },
  { id: 'w_o_3', word: 'oto', difficulty: 'easy', category: 'kelime' },
  { id: 'w_o_4', word: 'not', difficulty: 'easy', category: 'kelime' },
  { id: 'w_o_5', word: 'ton', difficulty: 'easy', category: 'kelime' },
  { id: 'w_o_6', word: 'alo', difficulty: 'easy', category: 'kelime' },
  { id: 'w_o_7', word: 'ol', difficulty: 'easy', category: 'kelime' },
  { id: 'w_o_8', word: 'olta', difficulty: 'medium', category: 'kelime' },
  { id: 'w_o_9', word: 'loto', difficulty: 'easy', category: 'kelime' },
  { id: 'w_o_10', word: 'otel', difficulty: 'medium', category: 'kelime' },
  { id: 'w_o_11', word: 'tonton', difficulty: 'medium', category: 'kelime' },
  { id: 'w_o_12', word: 'tolga', difficulty: 'hard', category: 'kelime' }, // G sonra

  // --- 7. + K Basamağı ---
  { id: 'w_k_1', word: 'ak', difficulty: 'easy', category: 'kelime' },
  { id: 'w_k_2', word: 'ek', difficulty: 'easy', category: 'kelime' },
  { id: 'w_k_3', word: 'ok', difficulty: 'easy', category: 'kelime' },
  { id: 'w_k_4', word: 'ka', difficulty: 'easy', category: 'hece' },
  { id: 'w_k_5', word: 'ke', difficulty: 'easy', category: 'hece' },
  { id: 'w_k_6', word: 'ki', difficulty: 'easy', category: 'hece' },
  { id: 'w_k_7', word: 'ko', difficulty: 'easy', category: 'hece' },
  { id: 'w_k_8', word: 'kek', difficulty: 'easy', category: 'kelime' },
  { id: 'w_k_9', word: 'kok', difficulty: 'easy', category: 'kelime' },
  { id: 'w_k_10', word: 'kale', difficulty: 'easy', category: 'kelime' },
  { id: 'w_k_11', word: 'kete', difficulty: 'medium', category: 'kelime' },
  { id: 'w_k_12', word: 'kene', difficulty: 'medium', category: 'kelime' },
  { id: 'w_k_13', word: 'etki', difficulty: 'medium', category: 'kelime' },
  { id: 'w_k_14', word: 'konak', difficulty: 'medium', category: 'kelime' },
  { id: 'w_k_15', word: 'koli', difficulty: 'easy', category: 'kelime' },
  { id: 'w_k_16', word: 'kol', difficulty: 'easy', category: 'kelime' },
  { id: 'w_k_17', word: 'kat', difficulty: 'easy', category: 'kelime' },
  { id: 'w_k_18', word: 'tek', difficulty: 'easy', category: 'kelime' },
  { id: 'w_k_19', word: 'kilit', difficulty: 'medium', category: 'kelime' },
  { id: 'w_k_20', word: 'ekle', difficulty: 'easy', category: 'kelime' },
  { id: 'w_k_21', word: 'kalk', difficulty: 'easy', category: 'kelime' },
  { id: 'w_k_22', word: 'elek', difficulty: 'easy', category: 'kelime' },
  { id: 'w_k_23', word: 'leke', difficulty: 'easy', category: 'kelime' },
  { id: 'w_k_24', word: 'kilo', difficulty: 'easy', category: 'kelime' },

  // --- 8. + U Basamağı ---
  { id: 'w_u_1', word: 'un', difficulty: 'easy', category: 'kelime' },
  { id: 'w_u_2', word: 'kul', difficulty: 'easy', category: 'kelime' },
  { id: 'w_u_3', word: 'kutu', difficulty: 'easy', category: 'kelime' },
  { id: 'w_u_4', word: 'tut', difficulty: 'easy', category: 'kelime' },
  { id: 'w_u_5', word: 'unut', difficulty: 'medium', category: 'kelime' },
  { id: 'w_u_6', word: 'ulu', difficulty: 'easy', category: 'kelime' },
  { id: 'w_u_7', word: 'unlu', difficulty: 'easy', category: 'kelime' },
  { id: 'w_u_8', word: 'otlu', difficulty: 'easy', category: 'kelime' },
  { id: 'w_u_9', word: 'koku', difficulty: 'easy', category: 'kelime' },
  { id: 'w_u_10', word: 'konuk', difficulty: 'medium', category: 'kelime' },
  { id: 'w_u_11', word: 'oku', difficulty: 'easy', category: 'kelime' },
  { id: 'w_u_12', word: 'tok', difficulty: 'easy', category: 'kelime' },

  // --- 9. + R Basamağı ---
  { id: 'w_r_1', word: 'nar', difficulty: 'easy', category: 'kelime' },
  { id: 'w_r_2', word: 'tur', difficulty: 'easy', category: 'kelime' },
  { id: 'w_r_3', word: 'kar', difficulty: 'easy', category: 'kelime' },
  { id: 'w_r_4', word: 'kor', difficulty: 'easy', category: 'kelime' },
  { id: 'w_r_5', word: 'kart', difficulty: 'easy', category: 'kelime' },
  { id: 'w_r_6', word: 'kurt', difficulty: 'easy', category: 'kelime' },
  { id: 'w_r_7', word: 'kare', difficulty: 'easy', category: 'kelime' },
  { id: 'w_r_8', word: 'orta', difficulty: 'medium', category: 'kelime' },
  { id: 'w_r_9', word: 'oran', difficulty: 'medium', category: 'kelime' },
  { id: 'w_r_10', word: 'kara', difficulty: 'easy', category: 'kelime' },
  { id: 'w_r_11', word: 'roket', difficulty: 'medium', category: 'kelime' },
  { id: 'w_r_12', word: 'renk', difficulty: 'easy', category: 'kelime' },
  { id: 'w_r_13', word: 'tren', difficulty: 'medium', category: 'kelime' },
  { id: 'w_r_14', word: 'tarla', difficulty: 'medium', category: 'kelime' },

  // --- 10. + I Basamağı ---
  { id: 'w_i2_1', word: 'arı', difficulty: 'easy', category: 'kelime' },
  { id: 'w_i2_2', word: 'altı', difficulty: 'easy', category: 'kelime' },
  { id: 'w_i2_3', word: 'katı', difficulty: 'easy', category: 'kelime' },
  { id: 'w_i2_4', word: 'artı', difficulty: 'easy', category: 'kelime' },
  { id: 'w_i2_5', word: 'atkı', difficulty: 'medium', category: 'kelime' },
  { id: 'w_i2_6', word: 'kartal', difficulty: 'medium', category: 'kelime' },
  { id: 'w_i2_7', word: 'ılık', difficulty: 'easy', category: 'kelime' },
  { id: 'w_i2_8', word: 'anı', difficulty: 'easy', category: 'kelime' },
  { id: 'w_i2_9', word: 'tanı', difficulty: 'easy', category: 'kelime' },
  { id: 'w_i2_10', word: 'martı', difficulty: 'medium', category: 'kelime' },

  // --- 11. + M Basamağı ---
  { id: 'w_m_1', word: 'elma', difficulty: 'easy', category: 'kelime' },
  { id: 'w_m_2', word: 'armut', difficulty: 'medium', category: 'kelime' },
  { id: 'w_m_3', word: 'limon', difficulty: 'medium', category: 'kelime' },
  { id: 'w_m_4', word: 'mola', difficulty: 'easy', category: 'kelime' },
  { id: 'w_m_5', word: 'mama', difficulty: 'easy', category: 'kelime' },
  { id: 'w_m_6', word: 'minik', difficulty: 'medium', category: 'kelime' },
  { id: 'w_m_7', word: 'mum', difficulty: 'easy', category: 'kelime' },
  { id: 'w_m_8', word: 'mor', difficulty: 'easy', category: 'kelime' },
  { id: 'w_m_9', word: 'mantar', difficulty: 'medium', category: 'kelime' },
  { id: 'w_m_10', word: 'kalem', difficulty: 'easy', category: 'kelime' },
  { id: 'w_m_11', word: 'kum', difficulty: 'easy', category: 'kelime' },

  // --- 12. + Ü Basamağı ---
  { id: 'w_u2_1', word: 'süt', difficulty: 'easy', category: 'kelime' }, // S sonra
  { id: 'w_u2_2', word: 'ütü', difficulty: 'easy', category: 'kelime' },
  { id: 'w_u2_3', word: 'tül', difficulty: 'easy', category: 'kelime' },
  { id: 'w_u2_4', word: 'ün', difficulty: 'easy', category: 'kelime' },
  { id: 'w_u2_5', word: 'kütük', difficulty: 'medium', category: 'kelime' },
  { id: 'w_u2_6', word: 'tür', difficulty: 'easy', category: 'kelime' },
  { id: 'w_u2_7', word: 'ünlü', difficulty: 'medium', category: 'kelime' },
  { id: 'w_u2_8', word: 'küme', difficulty: 'easy', category: 'kelime' },

  // --- 13. + S Basamağı ---
  { id: 'w_s_1', word: 'su', difficulty: 'easy', category: 'kelime' },
  { id: 'w_s_2', word: 'süt', difficulty: 'easy', category: 'kelime' },
  { id: 'w_s_3', word: 'saat', difficulty: 'easy', category: 'kelime' },
  { id: 'w_s_4', word: 'masa', difficulty: 'easy', category: 'kelime' },
  { id: 'w_s_5', word: 'sıra', difficulty: 'easy', category: 'kelime' },
  { id: 'w_s_6', word: 'sarı', difficulty: 'easy', category: 'kelime' },
  { id: 'w_s_7', word: 'silgi', difficulty: 'medium', category: 'kelime' }, // G sonra
  { id: 'w_s_8', word: 'simit', difficulty: 'medium', category: 'kelime' },
  { id: 'w_s_9', word: 'sınıf', difficulty: 'medium', category: 'kelime' },
  { id: 'w_s_10', word: 'usta', difficulty: 'easy', category: 'kelime' },
  { id: 'w_s_11', word: 'kasa', difficulty: 'easy', category: 'kelime' },

  // --- 14. + Ö Basamağı ---
  { id: 'w_o2_1', word: 'ön', difficulty: 'easy', category: 'kelime' },
  { id: 'w_o2_2', word: 'ördek', difficulty: 'medium', category: 'kelime' },
  { id: 'w_o2_3', word: 'örme', difficulty: 'medium', category: 'kelime' },
  { id: 'w_o2_4', word: 'körebe', difficulty: 'hard', category: 'kelime' },
  { id: 'w_o2_5', word: 'köstebek', difficulty: 'hard', category: 'kelime' },
  { id: 'w_o2_6', word: 'kömür', difficulty: 'medium', category: 'kelime' },
  { id: 'w_o2_7', word: 'tören', difficulty: 'medium', category: 'kelime' },
  { id: 'w_o2_8', word: 'kötü', difficulty: 'easy', category: 'kelime' },

  // --- 15. + Y Basamağı ---
  { id: 'w_y_1', word: 'ay', difficulty: 'easy', category: 'kelime' },
  { id: 'w_y_2', word: 'iyi', difficulty: 'easy', category: 'kelime' },
  { id: 'w_y_3', word: 'oyun', difficulty: 'easy', category: 'kelime' },
  { id: 'w_y_4', word: 'yol', difficulty: 'easy', category: 'kelime' },
  { id: 'w_y_5', word: 'yatak', difficulty: 'easy', category: 'kelime' },
  { id: 'w_y_6', word: 'yastık', difficulty: 'medium', category: 'kelime' },
  { id: 'w_y_7', word: 'ayna', difficulty: 'easy', category: 'kelime' },
  { id: 'w_y_8', word: 'kaya', difficulty: 'easy', category: 'kelime' },
  { id: 'w_y_9', word: 'yelek', difficulty: 'easy', category: 'kelime' },
  { id: 'w_y_10', word: 'yıldız', difficulty: 'medium', category: 'kelime' },
  { id: 'w_y_11', word: 'kamyon', difficulty: 'medium', category: 'kelime' },
  { id: 'w_y_12', word: 'maymun', difficulty: 'medium', category: 'kelime' },

  // --- 16. + D Basamağı ---
  { id: 'w_d_1', word: 'dede', difficulty: 'easy', category: 'kelime' },
  { id: 'w_d_2', word: 'dut', difficulty: 'easy', category: 'kelime' },
  { id: 'w_d_3', word: 'deve', difficulty: 'easy', category: 'kelime' }, // V sonra
  { id: 'w_d_4', word: 'dal', difficulty: 'easy', category: 'kelime' },
  { id: 'w_d_5', word: 'dere', difficulty: 'easy', category: 'kelime' },
  { id: 'w_d_6', word: 'deniz', difficulty: 'medium', category: 'kelime' },
  { id: 'w_d_7', word: 'dağ', difficulty: 'easy', category: 'kelime' },
  { id: 'w_d_8', word: 'defter', difficulty: 'medium', category: 'kelime' },
  { id: 'w_d_9', word: 'ördek', difficulty: 'medium', category: 'kelime' },
  { id: 'w_d_10', word: 'dondurma', difficulty: 'hard', category: 'kelime' },
  { id: 'w_d_11', word: 'dokuz', difficulty: 'medium', category: 'kelime' },
  { id: 'w_d_12', word: 'dört', difficulty: 'medium', category: 'kelime' },

  // --- 17. + Z Basamağı ---
  { id: 'w_z_1', word: 'zil', difficulty: 'easy', category: 'kelime' },
  { id: 'w_z_2', word: 'kuzu', difficulty: 'easy', category: 'kelime' },
  { id: 'w_z_3', word: 'tuz', difficulty: 'easy', category: 'kelime' },
  { id: 'w_z_4', word: 'zeytin', difficulty: 'medium', category: 'kelime' },
  { id: 'w_z_5', word: 'kiraz', difficulty: 'medium', category: 'kelime' },
  { id: 'w_z_6', word: 'horoz', difficulty: 'medium', category: 'kelime' },
  { id: 'w_z_7', word: 'yıldız', difficulty: 'medium', category: 'kelime' },
  { id: 'w_z_8', word: 'kaz', difficulty: 'easy', category: 'kelime' },
  { id: 'w_z_9', word: 'yüz', difficulty: 'easy', category: 'kelime' },
  { id: 'w_z_10', word: 'muz', difficulty: 'easy', category: 'kelime' },

  // --- 18. + Ç Basamağı ---
  { id: 'w_c1_1', word: 'çanta', difficulty: 'easy', category: 'kelime' },
  { id: 'w_c1_2', word: 'çilek', difficulty: 'medium', category: 'kelime' },
  { id: 'w_c1_3', word: 'çiçek', difficulty: 'medium', category: 'kelime' },
  { id: 'w_c1_4', word: 'çorba', difficulty: 'medium', category: 'kelime' },
  { id: 'w_c1_5', word: 'çatal', difficulty: 'medium', category: 'kelime' },
  { id: 'w_c1_6', word: 'çorap', difficulty: 'medium', category: 'kelime' },
  { id: 'w_c1_7', word: 'çam', difficulty: 'easy', category: 'kelime' },
  { id: 'w_c1_8', word: 'çay', difficulty: 'easy', category: 'kelime' },
  { id: 'w_c1_9', word: 'keçi', difficulty: 'easy', category: 'kelime' },
  { id: 'w_c1_10', word: 'uçak', difficulty: 'easy', category: 'kelime' },

  // --- 19. + B Basamağı ---
  { id: 'w_b_1', word: 'baba', difficulty: 'easy', category: 'kelime' },
  { id: 'w_b_2', word: 'bal', difficulty: 'easy', category: 'kelime' },
  { id: 'w_b_3', word: 'bebek', difficulty: 'easy', category: 'kelime' },
  { id: 'w_b_4', word: 'balık', difficulty: 'easy', category: 'kelime' },
  { id: 'w_b_5', word: 'bulut', difficulty: 'easy', category: 'kelime' },
  { id: 'w_b_6', word: 'balkon', difficulty: 'medium', category: 'kelime' },
  { id: 'w_b_7', word: 'bardak', difficulty: 'medium', category: 'kelime' },
  { id: 'w_b_8', word: 'börek', difficulty: 'medium', category: 'kelime' },
  { id: 'w_b_9', word: 'bıçak', difficulty: 'medium', category: 'kelime' },
  { id: 'w_b_10', word: 'bayrak', difficulty: 'medium', category: 'kelime' },
  { id: 'w_b_11', word: 'boya', difficulty: 'easy', category: 'kelime' },
  { id: 'w_b_12', word: 'bacak', difficulty: 'easy', category: 'kelime' },

  // --- 20. + G Basamağı ---
  { id: 'w_g_1', word: 'göz', difficulty: 'easy', category: 'kelime' },
  { id: 'w_g_2', word: 'gül', difficulty: 'easy', category: 'kelime' },
  { id: 'w_g_3', word: 'göl', difficulty: 'easy', category: 'kelime' },
  { id: 'w_g_4', word: 'gemi', difficulty: 'easy', category: 'kelime' },
  { id: 'w_g_5', word: 'güneş', difficulty: 'medium', category: 'kelime' },
  { id: 'w_g_6', word: 'gök', difficulty: 'easy', category: 'kelime' },
  { id: 'w_g_7', word: 'silgi', difficulty: 'easy', category: 'kelime' },
  { id: 'w_g_8', word: 'gazete', difficulty: 'medium', category: 'kelime' },
  { id: 'w_g_9', word: 'karga', difficulty: 'easy', category: 'kelime' },
  { id: 'w_g_10', word: 'gitar', difficulty: 'medium', category: 'kelime' },

  // --- 21. + C Basamağı ---
  { id: 'w_c2_1', word: 'cam', difficulty: 'easy', category: 'kelime' },
  { id: 'w_c2_2', word: 'cetvel', difficulty: 'medium', category: 'kelime' },
  { id: 'w_c2_3', word: 'cümle', difficulty: 'medium', category: 'kelime' },
  { id: 'w_c2_4', word: 'ceviz', difficulty: 'medium', category: 'kelime' },
  { id: 'w_c2_5', word: 'civciv', difficulty: 'medium', category: 'kelime' },
  { id: 'w_c2_6', word: 'cep', difficulty: 'easy', category: 'kelime' },
  { id: 'w_c2_7', word: 'böcek', difficulty: 'medium', category: 'kelime' },
  { id: 'w_c2_8', word: 'amca', difficulty: 'easy', category: 'kelime' },

  // --- 22. + Ş Basamağı ---
  { id: 'w_s2_1', word: 'kuş', difficulty: 'easy', category: 'kelime' },
  { id: 'w_s2_2', word: 'taş', difficulty: 'easy', category: 'kelime' },
  { id: 'w_s2_3', word: 'diş', difficulty: 'easy', category: 'kelime' },
  { id: 'w_s2_4', word: 'şapka', difficulty: 'medium', category: 'kelime' },
  { id: 'w_s2_5', word: 'kaşık', difficulty: 'medium', category: 'kelime' },
  { id: 'w_s2_6', word: 'şeker', difficulty: 'medium', category: 'kelime' },
  { id: 'w_s2_7', word: 'şişe', difficulty: 'easy', category: 'kelime' },
  { id: 'w_s2_8', word: 'beş', difficulty: 'easy', category: 'kelime' },
  { id: 'w_s2_9', word: 'kardeş', difficulty: 'medium', category: 'kelime' },

  // --- 23. + P Basamağı ---
  { id: 'w_p_1', word: 'top', difficulty: 'easy', category: 'kelime' },
  { id: 'w_p_2', word: 'ip', difficulty: 'easy', category: 'kelime' },
  { id: 'w_p_3', word: 'park', difficulty: 'easy', category: 'kelime' },
  { id: 'w_p_4', word: 'pasta', difficulty: 'easy', category: 'kelime' },
  { id: 'w_p_5', word: 'perde', difficulty: 'medium', category: 'kelime' },
  { id: 'w_p_6', word: 'pilav', difficulty: 'medium', category: 'kelime' },
  { id: 'w_p_7', word: 'peynir', difficulty: 'medium', category: 'kelime' },
  { id: 'w_p_8', word: 'kapı', difficulty: 'easy', category: 'kelime' },
  { id: 'w_p_9', word: 'köpek', difficulty: 'medium', category: 'kelime' },
  { id: 'w_p_10', word: 'kitap', difficulty: 'easy', category: 'kelime' },
  { id: 'w_p_11', word: 'çorap', difficulty: 'medium', category: 'kelime' },

  // --- 24. + H Basamağı ---
  { id: 'w_h_1', word: 'halı', difficulty: 'easy', category: 'kelime' },
  { id: 'w_h_2', word: 'havlu', difficulty: 'medium', category: 'kelime' },
  { id: 'w_h_3', word: 'horoz', difficulty: 'medium', category: 'kelime' },
  { id: 'w_h_4', word: 'bahçe', difficulty: 'medium', category: 'kelime' },
  { id: 'w_h_5', word: 'sabah', difficulty: 'medium', category: 'kelime' },
  { id: 'w_h_6', word: 'harf', difficulty: 'easy', category: 'kelime' },
  { id: 'w_h_7', word: 'hece', difficulty: 'easy', category: 'kelime' },
  { id: 'w_h_8', word: 'hafta', difficulty: 'medium', category: 'kelime' },

  // --- 25. + V Basamağı ---
  { id: 'w_v_1', word: 'ev', difficulty: 'easy', category: 'kelime' },
  { id: 'w_v_2', word: 'deve', difficulty: 'easy', category: 'kelime' },
  { id: 'w_v_3', word: 'tava', difficulty: 'easy', category: 'kelime' },
  { id: 'w_v_4', word: 'mavi', difficulty: 'easy', category: 'kelime' },
  { id: 'w_v_5', word: 'havuç', difficulty: 'medium', category: 'kelime' },
  { id: 'w_v_6', word: 'vatan', difficulty: 'medium', category: 'kelime' },
  { id: 'w_v_7', word: 'vazo', difficulty: 'easy', category: 'kelime' },
  { id: 'w_v_8', word: 'eldiven', difficulty: 'medium', category: 'kelime' },

  // --- 26. + Ğ Basamağı ---
  { id: 'w_g2_1', word: 'ağaç', difficulty: 'medium', category: 'kelime' },
  { id: 'w_g2_2', word: 'dağ', difficulty: 'easy', category: 'kelime' },
  { id: 'w_g2_3', word: 'yağmur', difficulty: 'medium', category: 'kelime' },
  { id: 'w_g2_4', word: 'kurbağa', difficulty: 'medium', category: 'kelime' },
  { id: 'w_g2_5', word: 'öğretmen', difficulty: 'hard', category: 'kelime' },
  { id: 'w_g2_6', word: 'öğrenci', difficulty: 'hard', category: 'kelime' },
  { id: 'w_g2_7', word: 'bağ', difficulty: 'easy', category: 'kelime' },
  { id: 'w_g2_8', word: 'iğne', difficulty: 'medium', category: 'kelime' },

  // --- 27. + F Basamağı ---
  { id: 'w_f_1', word: 'fındık', difficulty: 'medium', category: 'kelime' },
  { id: 'w_f_2', word: 'fil', difficulty: 'easy', category: 'kelime' },
  { id: 'w_f_3', word: 'fare', difficulty: 'easy', category: 'kelime' },
  { id: 'w_f_4', word: 'fener', difficulty: 'medium', category: 'kelime' },
  { id: 'w_f_5', word: 'fırça', difficulty: 'medium', category: 'kelime' },
  { id: 'w_f_6', word: 'fotoğraf', difficulty: 'hard', category: 'kelime' },
  { id: 'w_f_7', word: 'fırın', difficulty: 'medium', category: 'kelime' },

  // --- 28. + J Basamağı ---
  { id: 'w_j_1', word: 'jale', difficulty: 'easy', category: 'kelime' },
  { id: 'w_j_2', word: 'jant', difficulty: 'medium', category: 'kelime' },
  { id: 'w_j_3', word: 'jet', difficulty: 'easy', category: 'kelime' },
  { id: 'w_j_4', word: 'jilet', difficulty: 'medium', category: 'kelime' },
  { id: 'w_j_5', word: 'mesaj', difficulty: 'medium', category: 'kelime' },
];

/**
 * Filter words strictly by enabled letters:
 * - 'A' is ALWAYS included by default!
 * - Every letter in the word must belong to the enabled letter set.
 * - Absolutely NO unselected letters are allowed to appear in any word!
 */
export function getFilteredWordPool(
  selectedLetters: string[],
  allLettersEnabled: boolean,
  difficulty?: 'easy' | 'medium' | 'hard'
): WordItem[] {
  const enabledSet = new Set<string>();
  // 'A' is permanently fixed and enabled
  enabledSet.add('A');

  if (allLettersEnabled) {
    ALL_TURKISH_LETTERS.forEach(l => enabledSet.add(l));
  } else {
    selectedLetters.forEach(l => enabledSet.add(toTurkishUpper(l)));
  }

  // STRICT FILTER:
  let pool = WORD_BANK.filter(item => {
    return isWordStrictlyAllowed(item.word, enabledSet);
  });

  // Filter by difficulty if pool allows, otherwise keep all matching words
  if (difficulty === 'easy') {
    const easyPool = pool.filter(w => w.difficulty === 'easy');
    if (easyPool.length >= 6) {
      pool = easyPool;
    }
  } else if (difficulty === 'medium') {
    const medPool = pool.filter(w => w.difficulty !== 'hard');
    if (medPool.length >= 6) {
      pool = medPool;
    }
  }

  // If pool has fewer than 6 items (e.g. only A+N enabled which has 7 items, but in case):
  // Generate valid permutations strictly using ONLY the enabled letters:
  if (pool.length < 6) {
    const letters = Array.from(enabledSet).map(l => l.toLocaleLowerCase('tr-TR'));
    // Generate valid child syllables strictly within the allowed letters:
    const syntheticCandidates: string[] = [];
    letters.forEach(l1 => {
      letters.forEach(l2 => {
        syntheticCandidates.push(`${l1}${l2}`);
        letters.forEach(l3 => {
          syntheticCandidates.push(`${l1}${l2}${l3}`);
        });
      });
    });

    syntheticCandidates.forEach((cand, idx) => {
      if (pool.length < 10 && !pool.some(p => p.word === cand)) {
        pool.push({
          id: `gen_${cand}_${idx}`,
          word: cand,
          difficulty: 'easy',
          category: 'hece',
        });
      }
    });
  }

  return pool;
}
