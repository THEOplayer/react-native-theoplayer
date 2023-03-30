import languages from '../../res/languages.json';

export interface ISO639Language {
  name: string;
  local: string;
  '1': string;
  '2': string;
  '2T': string;
  '2B': string;
  '3': string;
}

/**
 * "und" is intended for cases where the language in the data
 * has not been identified, such as when it is mislabeled
 * or never had been labeled.
 *
 * https://en.wikipedia.org/wiki/ISO_639:und
 */
export const ISO639_UNDETERMINED = 'und';

export function getISO639LanguageByCode(code: string): ISO639Language | undefined {
  if (code === ISO639_UNDETERMINED) {
    return undefined;
  }
  const lcCode = code.toLowerCase();
  for (const lang of iso639Data) {
    if (lang['1'] === lcCode || lang['2'] === lcCode || lang['2T'] === lcCode || lang['2B'] === lcCode || lang['3'] === lcCode) {
      return lang;
    }
  }
  return undefined;
}

// Original: nodejs-langs by Andrew Lawson
// License: MIT
// https://github.com/adlawson/nodejs-langs/blob/bdbf8cfbc26c78dfeeb7f8032889dd88e2219441/data.js
export const iso639Data: ISO639Language[] = languages;
