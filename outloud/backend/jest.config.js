require('dotenv').config({ path: '.env.test' });
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/types/**',
  ],
  coverageDirectory: 'coverage',
  verbose: true,
  clearMocks: true,
  

  transformIgnorePatterns: [
    'node_modules/(?!(uuid)/)',
  ],
  
  
  moduleNameMapper: {
    '^uuid$': require.resolve('uuid'),
  },
  

  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  

  globals: {
    'ts-jest': {
      isolatedModules: true,
    },
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
};