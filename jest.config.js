module.exports = {
  testEnvironment: 'node',

  expand: true,

  forceExit: false,

  // https://github.com/facebook/jest/pull/6747 fix warning here
  // But its performance overhead is pretty bad (30+%).
  // detectOpenHandles: true

  setupFilesAfterEnv: ['./test/utils/setup'],

  coverageDirectory: './coverage',

  collectCoverageFrom: [
    '**/src/**/*.js'
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
    '^.+\\.js$': 'babel-jest',
    '.*\\.(vue)$': 'vue-jest'
  },

  moduleFileExtensions: [
    'ts',
    'js',
    'json'
  ]
}
