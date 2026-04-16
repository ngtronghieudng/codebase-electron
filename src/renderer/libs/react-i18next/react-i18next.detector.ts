import type { LanguageDetectorModule } from 'i18next';

import store2 from 'store2';

import { STORAGE_KEYS } from '@/shared/definitions/constants/shared.const';
import { ELanguageCode } from '@/shared/definitions/enums/shared.enum';
import { logger } from '@/shared/utils/logger.util';

export const languageDetector: LanguageDetectorModule = {
  cacheUserLanguage: (lang: string) => {
    try {
      const existingLanguage = store2.get(STORAGE_KEYS.LANGUAGE);
      if (!existingLanguage) {
        store2.set(STORAGE_KEYS.LANGUAGE, lang);
      }
    } catch (error) {
      logger.error('Failed to save language:', error);
    }
  },

  detect: () => {
    try {
      const savedLanguage = store2.get(STORAGE_KEYS.LANGUAGE);
      return savedLanguage || ELanguageCode.English;
    } catch (error) {
      logger.error('Failed to load language:', error);
      return ELanguageCode.English;
    }
  },

  init: () => {},
  type: 'languageDetector',
};
