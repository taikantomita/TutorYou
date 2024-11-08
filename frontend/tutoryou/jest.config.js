module.exports = {
  preset: 'ts-jest', // If you're using ts-jest for type-checking, you can keep this.
  setupFilesAfterEnv: ['<rootDir>/tests/jest.setup.js'],
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': ['@swc/jest'],
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|sass|scss)$': 'identity-obj-proxy', // Handles CSS imports
  },
}
