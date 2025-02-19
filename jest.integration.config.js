export const preset = 'ts-jest';
export const testEnvironment = 'node';
export const transform = {
  '^.+.tsx?$': ['ts-jest', {}],
};
export const testMatch = ['**/integration/**/**.spec.ts'];
export const setupFilesAfterEnv = ['<rootDir>/integration/global.setup.ts'];
