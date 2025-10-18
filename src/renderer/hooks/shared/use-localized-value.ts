import { ELanguageCode } from '@/shared/definitions/enums/shared.enum';

import { useLanguage } from './use-language';

type TValues<V> = Partial<Record<ELanguageCode, V>>;

export const useLocalizedValue = () => {
  const { language } = useLanguage();

  const getLocalizedValue = <V>(values: TValues<V>, defaultValue?: V): V => {
    return (
      values?.[language] ??
      values?.[ELanguageCode.English] ??
      Object.values(values ?? {})[0] ??
      (defaultValue as V) ??
      ('' as V)
    );
  };

  return { getLocalizedValue };
};
