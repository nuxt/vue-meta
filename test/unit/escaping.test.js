import _getMetaInfo from '../../src/shared/getMetaInfo'
import { loadVueMetaPlugin } from '../utils'
import { defaultOptions } from '../../src/shared/constants'
import { serverSequences } from '../../src/shared/escaping'

const getMetaInfo = (component, escapeSequences) => _getMetaInfo(defaultOptions, component, escapeSequences)

describe('escaping', () => {
  let Vue

  beforeAll(() => (Vue = loadVueMetaPlugin()))

  test('special chars are escaped unless disabled', () => {
    const component = new Vue({
      metaInfo: {
        htmlAttrs: { key: 1 },
        title: 'Hello & Goodbye',
        script: [{ innerHTML: 'Hello & Goodbye' }],
        __dangerouslyDisableSanitizers: ['script']
      }
    })

    expect(getMetaInfo(component, [[/&/g, '&amp;']])).toEqual({
      title: 'Hello &amp; Goodbye',
      titleChunk: 'Hello & Goodbye',
      titleTemplate: '%s',
      htmlAttrs: {
        key: 1
      },
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

  test('null title is left as it is', () => {
    const component = new Vue({
      metaInfo: {
        title: null
      }
    })

    expect(getMetaInfo(component, [[/&/g, '&amp;']])).toEqual({
      title: null,
      titleChunk: '',
      titleTemplate: '%s',
      htmlAttrs: {},
      headAttrs: {},
      bodyAttrs: {},
      meta: [],
      base: [],
      link: [],
      style: [],
      script: [],
      noscript: [],
      __dangerouslyDisableSanitizers: [],
      __dangerouslyDisableSanitizersByTagID: {}
    })
  })

  test('special chars are escaped unless disabled by vmid', () => {
    const component = new Vue({
      metaInfo: {
        title: 'Hello',
        script: [
          { vmid: 'yescape', innerHTML: 'Hello & Goodbye' },
          { vmid: 'noscape', innerHTML: 'Hello & Goodbye' }
        ],
        __dangerouslyDisableSanitizersByTagID: { noscape: ['innerHTML'] }
      }
    })

    expect(getMetaInfo(component, [[/&/g, '&amp;']])).toEqual({
      title: 'Hello',
      titleChunk: 'Hello',
      titleTemplate: '%s',
      htmlAttrs: {},
      headAttrs: {},
      bodyAttrs: {},
      meta: [],
      base: [],
      link: [],
      style: [],
      script: [
        { innerHTML: 'Hello &amp; Goodbye', vmid: 'yescape' },
        { innerHTML: 'Hello & Goodbye', vmid: 'noscape' }
      ],
      noscript: [],
      __dangerouslyDisableSanitizers: [],
      __dangerouslyDisableSanitizersByTagID: { noscape: ['innerHTML'] }
    })
  })

  test('json is still safely escaped', () => {
    const component = new Vue({
      metaInfo: {
        script: [
          {
            json: {
              perfectlySave: '</script><p class="unsafe">This is safe</p><script>',
              '</script>unsafeKey': 'This is also still safe'
            }
          }
        ]
      }
    })

    expect(getMetaInfo(component, serverSequences)).toEqual({
      title: undefined,
      titleChunk: '',
      titleTemplate: '%s',
      htmlAttrs: {},
      headAttrs: {},
      bodyAttrs: {},
      meta: [],
      base: [],
      link: [],
      style: [],
      script: [
        {
          json: {
            perfectlySave: '&lt;/script&gt;&lt;p class=&quot;unsafe&quot;&gt;This is safe&lt;/p&gt;&lt;script&gt;',
            '&lt;/script&gt;unsafeKey': 'This is also still safe'
          }
        }
      ],
      noscript: [],
      __dangerouslyDisableSanitizers: [],
      __dangerouslyDisableSanitizersByTagID: {}
    })
  })
})
