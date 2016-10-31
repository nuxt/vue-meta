import webpackConfig from './examples/webpack.config.babel'

delete webpackConfig.entry

export default (config) => {
  config.set({
    browsers: ['PhantomJS'],
    frameworks: ['mocha', 'chai'],
    reporters: ['mocha'],
    files: ['test/index.js'],
    preprocessors: {
      'test/index.js': ['webpack']
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
