module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: [
    'plugin:react/recommended',
    'standard-with-typescript',
    'plugin:prettier/recommended',
  ],
  parser: '@typescript-eslint/parser',
  overrides: [],
  ignorePatterns: [
    '**/*.js',
    '**/*.d.ts',
    '**/*.spec.ts',
    '**/*.spec.tsx',
    '**/*.test.ts',
    '**/*.test.tsx',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  plugins: ['react', '@typescript-eslint', 'prettier'],
  rules: {
    'prettier/prettier': ['error', {}, { usePrettierrc: true }],
    '@typescript-eslint/explicit-function-return-type': 'off',
    'react/no-unescaped-entities': 'off',
    '@typescript-eslint/no-unused-vars': [1, { argsIgnorePattern: '^_' }],
    '@typescript-eslint/restrict-template-expressions': 'off',
  },
};
