export const ERROR_CODES = {
  INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const;

export const NODE_ENVS = {
  DEVELOPMENT: 'development',
  PRODUCTION: 'production',
  STAGING: 'staging',
  TESTING: 'testing',
} as const;

export const REGEXES = {
  ALPHA_NUMERIC: /^[a-zA-Z0-9]+$/,
  ALPHABET: /^[a-zA-Z]+$/,
  DATE: /^(19|20)\d\d[-/](0[1-9]|1[0-2])[-/](0[1-9]|[12][0-9]|3[01])$/,
  DISPLAY_NAME: /^[a-zA-Z\s]+$/,
  EMAIL: /^[\w-\\.]+@([\w-]+\.)+[\w-]{2,4}$/,
  IP_ADDRESS:
    /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
  PASSWORD: /^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d]{8,}$/,
  PHONE: /^\+?[1-9]\d{1,14}$/,
  TIME: /^([01]\d|2[0-3]):([0-5]\d)$/,
  URL: /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w- ;,./?%&=]*)?$/,
  USERNAME: /^[a-zA-Z0-9_]{3,16}$/,
} as const;

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'codebaseElectronAccessToken',
  LANGUAGE: 'codebaseElectronLanguage',
  THEME: 'codebaseElectronTheme',
} as const;

export const COOKIE_KEYS = {
  CSRF_TOKEN: 'csrftoken',
  REFRESH_TOKEN: 'refresh_token',
} as const;

export const BREAKPOINTS = {
  LG: 1024,
  MD: 768,
  SM: 640,
  XL: 1280,
  XS: 320,
  XXL: 1536,
} as const;

export const PAGINATION = {
  DEFAULT_LIMIT: 20,
  DEFAULT_OFFSET: 0,
  DEFAULT_PAGE_SIZE: 50,
} as const;

export const QUERY_KEYS = {
  AUTH: {
    ME: 'authMe',
  },
} as const;
