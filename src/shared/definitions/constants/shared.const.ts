export const ERROR_CODES = {
  ERR_500: 'ERR_500',
} as const;

export const NODE_ENVS = {
  DEVELOP: 'develop',
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
  ACCESS_TOKEN: 'reactAccessToken',
  LANGUAGE: 'reactLanguage',
  THEME: 'reactTheme',
} as const;

export const COOKIE_KEYS = {
  CSRFTOKEN: 'csrftoken',
  REFRESH_TOKEN: 'refresh_token',
} as const;

export const BREAKPOINTS = {
  MOBILE: 768,
  TABLET: 1024,
} as const;

export const QUERY_KEYS = {
  AUTH: {
    PROFILE: 'authProfile',
  },
} as const;
