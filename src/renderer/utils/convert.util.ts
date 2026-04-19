import { TObjectUnknown } from '@/renderer/definitions/types/shared.type';

export const convertToCamelCase = <T>(
  data: TObjectUnknown | TObjectUnknown[],
): T => {
  if (data === null || typeof data !== 'object') {
    return data as T;
  }
  if (Array.isArray(data)) {
    return data.map((item) => convertToCamelCase(item)) as T;
  }

  const result: TObjectUnknown = {};
  Object.keys(data).forEach((key) => {
    const newKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
    const value = data[key];

    if (typeof value === 'object' && value !== null) {
      if (
        (value as TObjectUnknown).constructor === Object ||
        Array.isArray(value)
      ) {
        result[newKey] = convertToCamelCase(value as TObjectUnknown);
        return;
      }
    }
    result[newKey] = value;
  });

  return result as T;
};

export const convertToSnakeCase = <T>(
  data: TObjectUnknown | TObjectUnknown[],
): T => {
  if (!data || typeof data !== 'object') {
    return data as T;
  }
  if (Array.isArray(data)) {
    return data.map((item) => convertToSnakeCase(item)) as T;
  }

  const result: TObjectUnknown = {};
  Object.keys(data).forEach((key) => {
    const newKey = key.replace(/[A-Z]/g, (match) => `_${match.toLowerCase()}`);
    const value = data[key];

    if (typeof value === 'object' && value !== null) {
      result[newKey] = convertToSnakeCase(value as TObjectUnknown);
      return;
    }
    result[newKey] = value;
  });

  return result as T;
};
