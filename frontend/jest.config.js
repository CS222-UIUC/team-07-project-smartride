module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    moduleNameMapper: { '\\.(css|png|jpg)$': 'identity-obj-proxy' },
    setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],
  };
  