module.exports = {
  testEnvironment: 'jest-environment-jsdom-global',

  expand: true,

  forceExit: false,

  // https://github.com/facebook/jest/pull/6747 fix warning here
  // But its performance overhead is pretty bad (30+%).
  // detectOpenHandles: true

  setupFilesAfterEnv: ['./test/utils/setup'],

  coverageDirectory: './coverage',

  collectCoverageFrom: [
    'src/**/*.[tj]s'
  ],

  coveragePathIgnorePatterns: [
    'node_modules'
  ],

  testPathIgnorePatterns: [
    'node_modules'
  ],

  transformIgnorePatterns: [
    'node_modules'
  ],

  transform: {
    '^.+\\.[tj]s$': 'babel-jest',
    '.*\\.(vue)$': 'vue-jest'
  },

  moduleFileExtensions: [
    'ts',
    'js',
    'json'
  ],
  
  globals: {
    __DEV__: true
  }
}
