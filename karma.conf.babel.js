import webpackConfig from './examples/webpack.config.babel'

delete webpackConfig.entry

export default (config) => {
  config.set({
    browsers: ['PhantomJS'],
    frameworks: ['mocha', 'chai'],
    reporters: ['mocha', 'coverage'],
    files: ['test/index.js'],
    preprocessors: {
      'test/index.js': ['webpack', 'sourcemap']
    },
    coverageReporter: {
      reporters: [
        { type: 'lcov' },
        { type: 'text' }
      ],
      includeAllSources: true,
      dir: 'coverage',
      subdir: '.'
    },
    webpack: webpackConfig,
    webpackMiddleware: {
      noInfo: true
    },
    mochaReporter: {
      showDiff: true,
      output: 'full'
    },
    singleRun: true
  })
}
