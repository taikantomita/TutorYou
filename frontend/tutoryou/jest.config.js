module.exports = {
    preset: 'ts-jest',
    setupFilesAfterEnv: ['<rootDir>/tests/jest.setup.js'],
    testEnvironment: 'jsdom',
    transform: {
      '^.+\\.(ts|tsx|js|jsx)$': 'babel-jest',
    },
    moduleNameMapper: {
      '^@/(.*)$': '<rootDir>/src/$1',
    },
  };
  