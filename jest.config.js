export const preset = 'ts-jest';
export const testEnvironment = 'node';
export const transform = {
  '^.+.tsx?$': ['ts-jest', {}],
};
export const testMatch = ['**/src/**/*.test.ts'];
