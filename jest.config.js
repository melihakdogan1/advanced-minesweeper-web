module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    moduleFileExtensions: ['ts','tsx','js','jsx'],
    transform: {
      '^.+\\.(ts|tsx)$': 'ts-jest'
    },
    testMatch: ['**/?(*.)+(test).+(ts|tsx|js)']
  };
  