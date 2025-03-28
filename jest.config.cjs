module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['@testing-library/jest-dom'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.test.json' // Brug den specifikke test tsconfig
      }
    ],
  },
  testMatch: [
    '**/__tests__/**/*.+(ts|tsx|js)',
    '**/?(*.)+(spec|test).+(ts|tsx|js)',
  ],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
  ],
  moduleNameMapper: {
    // Håndterer import af CSS og andre filer (hvis nødvendigt)
    // '\\.(css|less|scss|sass)$': '<rootDir>/__mocks__/styleMock.js',
    // '\\.(gif|ttf|eot|svg)$': '<rootDir>/__mocks__/fileMock.js',
    // Vigtigt når type:module bruges i package.json
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  // Nødvendigt for ES Modules support
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  globals: {},
};