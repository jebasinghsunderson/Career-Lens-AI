// Centralized language constants — kept in a non-component file
// so Vite's React Fast Refresh is not confused by non-component exports.

export const LANGUAGES = [
  'English',
  'Hindi',
  'Bengali',
  'Telugu',
  'Marathi',
  'Tamil',
  'Urdu',
  'Gujarati',
  'Kannada',
  'Odia',
  'Malayalam',
  'Punjabi',
  'Assamese',
] as const;

export type Language = (typeof LANGUAGES)[number] | null;

// Map human-readable language names to JSON file prefixes
export const LANG_PREFIX_MAP: Record<Exclude<Language, null>, string> = {
  English: 'en',
  Hindi: 'hi',
  Bengali: 'bn',
  Telugu: 'te',
  Marathi: 'mr',
  Tamil: 'ta',
  Urdu: 'ur',
  Gujarati: 'gu',
  Kannada: 'kn',
  Odia: 'or',
  Malayalam: 'ml',
  Punjabi: 'pa',
  Assamese: 'as',
};

// Native script labels for the language selector UI
export const LANG_NATIVE_LABELS: Record<Exclude<Language, null>, string> = {
  English: 'English',
  Hindi: 'हिन्दी',
  Bengali: 'বাংলা',
  Telugu: 'తెలుగు',
  Marathi: 'मराठी',
  Tamil: 'தமிழ்',
  Urdu: 'اردو',
  Gujarati: 'ગુજરાતી',
  Kannada: 'ಕನ್ನಡ',
  Odia: 'ଓଡ଼ିଆ',
  Malayalam: 'മലയാളം',
  Punjabi: 'ਪੰਜਾਬੀ',
  Assamese: 'অসমীয়া',
};
