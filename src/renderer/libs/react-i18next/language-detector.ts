import type { LanguageDetectorModule } from 'i18next';

import store2 from 'store2';

import { STORAGE_KEYS } from '@/shared/definitions/constants/shared.const';
import { ELanguageCode } from '@/shared/definitions/enums/shared.enum';

export const languageDetector: LanguageDetectorModule = {
  cacheUserLanguage: (lng: string) => {
    try {
      const existingLanguage = store2.get(STORAGE_KEYS.LANGUAGE);
      if (!existingLanguage) store2.set(STORAGE_KEYS.LANGUAGE, lng);
    } catch (error) {
      console.error('Failed to save language:', error);
    }
  },

  detect: () => {
    try {
      const savedLanguage = store2.get(STORAGE_KEYS.LANGUAGE);
      return savedLanguage || ELanguageCode.English;
    } catch (error) {
      console.error('Failed to load language:', error);
      return ELanguageCode.English;
    }
  },

  init: () => {},
  type: 'languageDetector',
};
