import nextJest from 'next/jest.js'

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: './',
})

// Add any custom config to be passed to Jest
/** @type {import('jest').Config} */
const config = {
  // Add more setup options before each test is run
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],

  // Test environment for React components
  testEnvironment: 'jest-environment-jsdom',

  // Automatically clear mock calls, instances, contexts and results before every test
  clearMocks: true,

  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: true,

  // The directory where Jest should output its coverage files
  coverageDirectory: "coverage",

  // Path patterns to ignore for coverage
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "/.next/",
    "/coverage/"
  ],

  // The test files pattern
  testMatch: [
    "**/tests/**/*.test.[jt]s?(x)",
    "**/__tests__/**/*.[jt]s?(x)"
  ],

  // Transform to handle TypeScript and JSX
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
  },
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config) 