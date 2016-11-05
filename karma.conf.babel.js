import webpackConfig from './examples/webpack.config.babel'

delete webpackConfig.entry

export default (config) => {
  config.set({
    browsers: ['PhantomJS'],
    frameworks: ['mocha', 'chai'],
    reporters: ['mocha', 'coverage'],
    files: ['test/index.js'],
    preprocessors: {
      'test/index.js': ['webpack']
    },
    coverageReporter: {
      type: 'lcov',
      includeAllSources: true,
      dir: 'coverage',
      subdir: '.'
    },
    webpack: webpackConfig,
    webpackMiddleware: {
      noInfo: true
    },
    mochaReporter: {
      showDiff: true
    },
    singleRun: true
  })
}
