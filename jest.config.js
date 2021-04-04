module.exports = {
  testEnvironment: 'jest-environment-jsdom-global',
  preset: 'ts-jest',

  expand: true,

  forceExit: false,

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
    '^.+\\.jsx?$': 'babel-jest',
    '^.+\\.tsx?$': 'ts-jest',
    '^.+\\.vue$': 'vue-jest'
  },

  moduleFileExtensions: [
    'ts',
    'js',
    'json'
  ],

  globals: {
    __DEV__: true,
    __BROWSER__: true,
  }
}
