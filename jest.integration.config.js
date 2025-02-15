/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+.tsx?$": ["ts-jest",{}],
  },
  testMatch: ["**/tests/**/*.spec.ts"],
  setupFilesAfterEnv: ['<rootDir>/tests/global.setup.ts'],
};