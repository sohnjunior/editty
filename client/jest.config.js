/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@atoms/(.*)$': '<rootDir>/src/components/atoms/$1',
    '^@molecules/(.*)$': '<rootDir>/src/components/molecules/$1',
    '^@organisms/(.*)$': '<rootDir>/src/components/organisms/$1',
    '^@templates/(.*)$': '<rootDir>/src/components/templates/$1',
  },
}
