/** @type {import('prettier').Config} */
export default {
  overrides: [
    {
      files: '*.svg',
      options: {
        parser: 'html',
      },
    },
  ],
  plugins: ['prettier-plugin-tailwindcss'],
  printWidth: 80,
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  tailwindFunctions: ['clsx', 'cn'],
  trailingComma: 'all',
};
