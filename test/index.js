const testsContext = require.context('.', true, /\.spec$/)
const srcContext = require.context('../src', true, /\.js$/)
testsContext.keys().forEach(testsContext)
srcContext.keys().forEach(srcContext)
