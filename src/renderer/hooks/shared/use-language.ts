import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocalStorage } from 'usehooks-ts';

import { STORAGE_KEYS } from '@/shared/definitions/constants/shared.const';
import { ELanguageCode } from '@/shared/definitions/enums/shared.enum';

export const useLanguage = () => {
  const { i18n } = useTranslation();
  const [language, setLanguage] = useLocalStorage<ELanguageCode>(
    STORAGE_KEYS.LANGUAGE,
    ELanguageCode.English,
  );

  useEffect(() => {
    if (language && Object.values(ELanguageCode).includes(language))
      i18n.changeLanguage(language);
  }, [language, i18n]);

  return {
    language,
    setLanguage,
  };
};
