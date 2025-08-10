module.exports = {
  testEnvironment: 'jsdom',

  transform: {
    //"^.+\\.(ts|tsx)$": "babel-jest"
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest"
  },

  transformIgnorePatterns: [
    // Transpila axios y otras que usen ESM (puedes agregar más separadas por "|")
    '/node_modules/(?!(axios|react-router-dom|other-esm-lib)/)',
  ],

  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': '<rootDir>/__mocks__/styleMock.js',
  },

  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],

  moduleFileExtensions: ['js', 'jsx', 'json', 'node'],

  moduleDirectories: ['node_modules', 'src'],
};
