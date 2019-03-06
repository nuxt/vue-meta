import _getMetaInfo from '../src/shared/getMetaInfo'
import { defaultOptions, loadVueMetaPlugin } from './utils'

const getMetaInfo = (component, escapeSequences) => _getMetaInfo(defaultOptions, component, escapeSequences)

describe('escaping', () => {
  let Vue

  beforeAll(() => (Vue = loadVueMetaPlugin()))

  test('special chars are escaped unless disabled', () => {
    const component = new Vue({
      metaInfo: {
        title: 'Hello & Goodbye',
        script: [{ innerHTML: 'Hello & Goodbye' }],
        __dangerouslyDisableSanitizers: ['script']
      }
    })

    expect(getMetaInfo(component, [[/&/g, '&amp;']])).toEqual({
      title: 'Hello &amp; Goodbye',
      titleChunk: 'Hello &amp; Goodbye',
      titleTemplate: '%s',
      htmlAttrs: {},
      headAttrs: {},
      bodyAttrs: {},
      meta: [],
      base: [],
      link: [],
      style: [],
      script: [{ innerHTML: 'Hello & Goodbye' }],
      noscript: [],
      __dangerouslyDisableSanitizers: ['script'],
      __dangerouslyDisableSanitizersByTagID: {}
    })
  })
})
