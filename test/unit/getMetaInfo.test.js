import _getMetaInfo from '../../src/shared/getMetaInfo'
import { loadVueMetaPlugin } from '../utils'
import { defaultOptions } from '../../src/shared/constants'

const getMetaInfo = component => _getMetaInfo(defaultOptions, component)

describe('getMetaInfo', () => {
  let Vue

  beforeAll(() => (Vue = loadVueMetaPlugin()))

  test('returns appropriate defaults when no meta info is found', () => {
    const component = new Vue()

    expect(getMetaInfo(component)).toEqual({
      title: '',
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

  test('returns metaInfo when used in component', () => {
    const component = new Vue({
      metaInfo: {
        title: 'Hello',
        meta: [
          { charset: 'utf-8' }
        ]
      }
    })

    expect(getMetaInfo(component)).toEqual({
      title: 'Hello',
      titleChunk: 'Hello',
      titleTemplate: '%s',
      htmlAttrs: {},
      headAttrs: {},
      bodyAttrs: {},
      meta: [
        { charset: 'utf-8' }
      ],
      base: [],
      link: [],
      style: [],
      script: [],
      noscript: [],
      __dangerouslyDisableSanitizers: [],
      __dangerouslyDisableSanitizersByTagID: {}
    })
  })

  test('converts base tag to array', () => {
    const component = new Vue({
      metaInfo: {
        title: 'Hello',
        base: { href: 'href' }
      }
    })

    expect(getMetaInfo(component)).toEqual({
      title: 'Hello',
      titleChunk: 'Hello',
      titleTemplate: '%s',
      htmlAttrs: {},
      headAttrs: {},
      bodyAttrs: {},
      meta: [],
      base: [
        { href: 'href' }
      ],
      link: [],
      style: [],
      script: [],
      noscript: [],
      __dangerouslyDisableSanitizers: [],
      __dangerouslyDisableSanitizersByTagID: {}
    })
  })

  test('removes duplicate metaInfo in same component', () => {
    const component = new Vue({
      metaInfo: {
        title: 'Hello',
        meta: [
          {
            vmid: 'a',
            property: 'a',
            content: 'a'
          },
          {
            vmid: 'a',
            property: 'a',
            content: 'b'
          }
        ]
      }
    })

    expect(getMetaInfo(component)).toEqual({
      title: 'Hello',
      titleChunk: 'Hello',
      titleTemplate: '%s',
      htmlAttrs: {},
      headAttrs: {},
      bodyAttrs: {},
      meta: [
        {
          vmid: 'a',
          property: 'a',
          content: 'a'
        }
      ],
      base: [],
      link: [],
      style: [],
      script: [],
      noscript: [],
      __dangerouslyDisableSanitizers: [],
      __dangerouslyDisableSanitizersByTagID: {}
    })
  })

  test('properly uses string titleTemplates', () => {
    const component = new Vue({
      metaInfo: {
        title: 'Hello',
        titleTemplate: '%s World',
        meta: [
          { charset: 'utf-8' }
        ]
      }
    })

    expect(getMetaInfo(component)).toEqual({
      title: 'Hello World',
      titleChunk: 'Hello',
      titleTemplate: '%s World',
      htmlAttrs: {},
      headAttrs: {},
      bodyAttrs: {},
      meta: [
        { charset: 'utf-8' }
      ],
      base: [],
      link: [],
      style: [],
      script: [],
      noscript: [],
      __dangerouslyDisableSanitizers: [],
      __dangerouslyDisableSanitizersByTagID: {}
    })
  })

  test('properly uses function titleTemplates', () => {
    const titleTemplate = chunk => `${chunk} Function World`

    const component = new Vue({
      metaInfo: {
        title: 'Hello',
        titleTemplate,
        meta: [
          { charset: 'utf-8' }
        ]
      }
    })

    expect(getMetaInfo(component)).toEqual({
      title: 'Hello Function World',
      titleChunk: 'Hello',
      titleTemplate,
      htmlAttrs: {},
      headAttrs: {},
      bodyAttrs: {},
      meta: [
        { charset: 'utf-8' }
      ],
      base: [],
      link: [],
      style: [],
      script: [],
      noscript: [],
      __dangerouslyDisableSanitizers: [],
      __dangerouslyDisableSanitizersByTagID: {}
    })
  })

  test('has the proper `this` binding when using function titleTemplates', () => {
    const titleTemplate = function (chunk) {
      return `${chunk} ${this.helloWorldText}`
    }

    const component = new Vue({
      metaInfo: {
        title: 'Hello',
        titleTemplate,
        meta: [
          { charset: 'utf-8' }
        ]
      },
      data() {
        return {
          helloWorldText: 'Function World'
        }
      }
    })

    expect(getMetaInfo(component)).toEqual({
      title: 'Hello Function World',
      titleChunk: 'Hello',
      titleTemplate,
      htmlAttrs: {},
      headAttrs: {},
      bodyAttrs: {},
      meta: [
        { charset: 'utf-8' }
      ],
      base: [],
      link: [],
      style: [],
      script: [],
      noscript: [],
      __dangerouslyDisableSanitizers: [],
      __dangerouslyDisableSanitizersByTagID: {}
    })
  })

  test('properly uses string meta templates', () => {
    const component = new Vue({
      metaInfo: {
        title: 'Hello',
        meta: [
          {
            vmid: 'og:title',
            property: 'og:title',
            content: 'Test title',
            template: '%s - My page'
          }
        ]
      }
    })

    expect(getMetaInfo(component)).toEqual({
      title: 'Hello',
      titleChunk: 'Hello',
      titleTemplate: '%s',
      htmlAttrs: {},
      headAttrs: {},
      bodyAttrs: {},
      meta: [
        {
          vmid: 'og:title',
          property: 'og:title',
          content: 'Test title - My page'
        }
      ],
      base: [],
      link: [],
      style: [],
      script: [],
      noscript: [],
      __dangerouslyDisableSanitizers: [],
      __dangerouslyDisableSanitizersByTagID: {}
    })
  })

  test('properly uses function meta templates', () => {
    const component = new Vue({
      metaInfo: {
        title: 'Hello',
        meta: [
          {
            vmid: 'og:title',
            property: 'og:title',
            content: 'Test title',
            template: chunk => `${chunk} - My page`
          }
        ]
      }
    })

    expect(getMetaInfo(component)).toEqual({
      title: 'Hello',
      titleChunk: 'Hello',
      titleTemplate: '%s',
      htmlAttrs: {},
      headAttrs: {},
      bodyAttrs: {},
      meta: [
        {
          vmid: 'og:title',
          property: 'og:title',
          content: 'Test title - My page'
        }
      ],
      base: [],
      link: [],
      style: [],
      script: [],
      noscript: [],
      __dangerouslyDisableSanitizers: [],
      __dangerouslyDisableSanitizersByTagID: {}
    })
  })

  test('properly uses content only if template is not defined', () => {
    const component = new Vue({
      metaInfo: {
        title: 'Hello',
        meta: [
          {
            vmid: 'og:title',
            property: 'og:title',
            content: 'Test title'
          }
        ]
      }
    })

    expect(getMetaInfo(component)).toEqual({
      title: 'Hello',
      titleChunk: 'Hello',
      titleTemplate: '%s',
      htmlAttrs: {},
      headAttrs: {},
      bodyAttrs: {},
      meta: [
        {
          vmid: 'og:title',
          property: 'og:title',
          content: 'Test title'
        }
      ],
      base: [],
      link: [],
      style: [],
      script: [],
      noscript: [],
      __dangerouslyDisableSanitizers: [],
      __dangerouslyDisableSanitizersByTagID: {}
    })
  })

  test('properly uses content only if template is null', () => {
    const component = new Vue({
      metaInfo: {
        title: 'Hello',
        meta: [
          {
            vmid: 'og:title',
            property: 'og:title',
            content: 'Test title',
            template: null
          }
        ]
      }
    })

    expect(getMetaInfo(component)).toEqual({
      title: 'Hello',
      titleChunk: 'Hello',
      titleTemplate: '%s',
      htmlAttrs: {},
      headAttrs: {},
      bodyAttrs: {},
      meta: [
        {
          vmid: 'og:title',
          property: 'og:title',
          content: 'Test title'
        }
      ],
      base: [],
      link: [],
      style: [],
      script: [],
      noscript: [],
      __dangerouslyDisableSanitizers: [],
      __dangerouslyDisableSanitizersByTagID: {}
    })
  })

  test('properly uses content only if template is false', () => {
    const component = new Vue({
      metaInfo: {
        title: 'Hello',
        meta: [
          {
            vmid: 'og:title',
            property: 'og:title',
            content: 'Test title',
            template: false
          }
        ]
      }
    })

    expect(getMetaInfo(component)).toEqual({
      title: 'Hello',
      titleChunk: 'Hello',
      titleTemplate: '%s',
      htmlAttrs: {},
      headAttrs: {},
      bodyAttrs: {},
      meta: [
        {
          vmid: 'og:title',
          property: 'og:title',
          content: 'Test title'
        }
      ],
      base: [],
      link: [],
      style: [],
      script: [],
      noscript: [],
      __dangerouslyDisableSanitizers: [],
      __dangerouslyDisableSanitizersByTagID: {}
    })
  })

  test('properly uses meta templates with one-level-deep nested children content', () => {
    Vue.component('merge-child', {
      render: h => h('div'),
      metaInfo: {
        title: 'Hello',
        meta: [
          {
            vmid: 'og:title',
            property: 'og:title',
            content: 'An important title!'
          }
        ]
      }
    })

    const component = new Vue({
      metaInfo: {
        meta: [
          {
            vmid: 'og:title',
            property: 'og:title',
            content: 'Test title',
            template: chunk => `${chunk} - My page`
          }
        ]
      },
      el: document.createElement('div'),
      render: h => h('div', null, [h('merge-child')])
    })

    expect(getMetaInfo(component)).toEqual({
      title: 'Hello',
      titleChunk: 'Hello',
      titleTemplate: '%s',
      htmlAttrs: {},
      headAttrs: {},
      bodyAttrs: {},
      meta: [
        {
          vmid: 'og:title',
          property: 'og:title',
          content: 'An important title! - My page'
        }
      ],
      base: [],
      link: [],
      style: [],
      script: [],
      noscript: [],
      __dangerouslyDisableSanitizers: [],
      __dangerouslyDisableSanitizersByTagID: {}
    })
  })

  test('properly uses meta templates with one-level-deep nested children template', () => {
    Vue.component('merge-child', {
      render: h => h('div'),
      metaInfo: {
        title: 'Hello',
        meta: [
          {
            vmid: 'og:title',
            property: 'og:title',
            template: chunk => `${chunk} - My page`
          }
        ]
      }
    })

    const component = new Vue({
      metaInfo: {
        meta: [
          {
            vmid: 'og:title',
            property: 'og:title',
            content: 'Test title',
            template: chunk => `${chunk} - SHOULD NEVER HAPPEN`
          }
        ]
      },
      el: document.createElement('div'),
      render: h => h('div', null, [h('merge-child')])
    })

    expect(getMetaInfo(component)).toEqual({
      title: 'Hello',
      titleChunk: 'Hello',
      titleTemplate: '%s',
      htmlAttrs: {},
      headAttrs: {},
      bodyAttrs: {},
      meta: [
        {
          vmid: 'og:title',
          property: 'og:title',
          content: 'Test title - My page'
        }
      ],
      base: [],
      link: [],
      style: [],
      script: [],
      noscript: [],
      __dangerouslyDisableSanitizers: [],
      __dangerouslyDisableSanitizersByTagID: {}
    })
  })

  test('properly uses meta templates with one-level-deep nested children template and content', () => {
    Vue.component('merge-child', {
      render: h => h('div'),
      metaInfo: {
        title: 'Hello',
        meta: [
          {
            vmid: 'og:title',
            property: 'og:title',
            content: 'An important title!',
            template: chunk => `${chunk} - My page`
          }
        ]
      }
    })

    const component = new Vue({
      metaInfo: {
        meta: [
          {
            vmid: 'og:title',
            property: 'og:title',
            content: 'Test title',
            template: chunk => `${chunk} - SHOULD NEVER HAPPEN`
          }
        ]
      },
      el: document.createElement('div'),
      render: h => h('div', null, [h('merge-child')])
    })

    expect(getMetaInfo(component)).toEqual({
      title: 'Hello',
      titleChunk: 'Hello',
      titleTemplate: '%s',
      htmlAttrs: {},
      headAttrs: {},
      bodyAttrs: {},
      meta: [
        {
          vmid: 'og:title',
          property: 'og:title',
          content: 'An important title! - My page'
        }
      ],
      base: [],
      link: [],
      style: [],
      script: [],
      noscript: [],
      __dangerouslyDisableSanitizers: [],
      __dangerouslyDisableSanitizersByTagID: {}
    })
  })

  test('properly uses meta templates with one-level-deep nested children when parent has no template', () => {
    Vue.component('merge-child', {
      render: h => h('div'),
      metaInfo: {
        title: 'Hello',
        meta: [
          {
            vmid: 'og:title',
            property: 'og:title',
            content: 'An important title!',
            template: chunk => `${chunk} - My page`
          }
        ]
      }
    })

    const component = new Vue({
      metaInfo: {
        meta: [
          {
            vmid: 'og:title',
            property: 'og:title',
            content: 'Test title'
          }
        ]
      },
      el: document.createElement('div'),
      render: h => h('div', null, [h('merge-child')])
    })

    expect(getMetaInfo(component)).toEqual({
      title: 'Hello',
      titleChunk: 'Hello',
      titleTemplate: '%s',
      htmlAttrs: {},
      headAttrs: {},
      bodyAttrs: {},
      meta: [
        {
          vmid: 'og:title',
          property: 'og:title',
          content: 'An important title! - My page'
        }
      ],
      base: [],
      link: [],
      style: [],
      script: [],
      noscript: [],
      __dangerouslyDisableSanitizers: [],
      __dangerouslyDisableSanitizersByTagID: {}
    })
  })

  test('no errors when metaInfo returns nothing', () => {
    const component = new Vue({
      metaInfo() {},
      el: document.createElement('div'),
      render: h => h('div', null, [])
    })

    expect(getMetaInfo(component)).toEqual({
      title: '',
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

  test('child can indicate its content should be ignored', () => {
    Vue.component('merge-child', {
      render: h => h('div'),
      metaInfo: {
        title: undefined,
        bodyAttrs: {
          class: undefined
        },
        meta: [
          {
            vmid: 'og:title',
            content: undefined
          }
        ]
      }
    })

    const component = new Vue({
      metaInfo: {
        title: 'Hello',
        bodyAttrs: {
          class: 'class'
        },
        meta: [
          {
            vmid: 'og:title',
            property: 'og:title',
            content: 'Test title',
            template: chunk => `${chunk} - My page`
          }
        ]
      },
      el: document.createElement('div'),
      render: h => h('div', null, [h('merge-child')])
    })

    expect(getMetaInfo(component)).toEqual({
      title: 'Hello',
      titleChunk: 'Hello',
      titleTemplate: '%s',
      bodyAttrs: {
        class: 'class'
      },
      headAttrs: {},
      htmlAttrs: {},
      meta: [
        {
          vmid: 'og:title',
          property: 'og:title',
          content: 'Test title - My page'
        }
      ],
      base: [],
      link: [],
      style: [],
      script: [],
      noscript: [],
      __dangerouslyDisableSanitizers: [],
      __dangerouslyDisableSanitizersByTagID: {}
    })
  })

  test('child can indicate to remove parent vmids', () => {
    Vue.component('merge-child', {
      render: h => h('div'),
      metaInfo: {
        title: 'Hi',
        meta: [
          {
            vmid: 'og:title',
            content: null
          }
        ]
      }
    })

    const component = new Vue({
      metaInfo: {
        title: 'Hello',
        meta: [
          {
            vmid: 'og:title',
            property: 'og:title',
            content: 'Test title',
            template: chunk => `${chunk} - My page`
          }
        ]
      },
      el: document.createElement('div'),
      render: h => h('div', null, [h('merge-child')])
    })

    expect(getMetaInfo(component)).toEqual({
      title: 'Hi',
      titleChunk: 'Hi',
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

  test('attribute values can be an array', () => {
    Vue.component('merge-child', {
      render: h => h('div'),
      metaInfo: {
        bodyAttrs: {
          class: ['foo']
        }
      }
    })

    const component = new Vue({
      metaInfo: {
        bodyAttrs: {
          class: ['bar']
        }
      },
      el: document.createElement('div'),
      render: h => h('div', null, [h('merge-child')])
    })

    expect(getMetaInfo(component)).toEqual({
      title: '',
      titleChunk: '',
      titleTemplate: '%s',
      htmlAttrs: {},
      headAttrs: {},
      bodyAttrs: {
        class: ['bar', 'foo']
      },
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
})
