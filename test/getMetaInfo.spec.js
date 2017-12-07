import Vue from 'vue'
import _getMetaInfo from '../src/shared/getMetaInfo'
import {
  VUE_META_KEY_NAME,
  VUE_META_ATTRIBUTE,
  VUE_META_SERVER_RENDERED_ATTRIBUTE,
  VUE_META_TAG_LIST_ID_KEY_NAME
} from '../src/shared/constants'

// set some default options
const defaultOptions = {
  keyName: VUE_META_KEY_NAME,
  attribute: VUE_META_ATTRIBUTE,
  ssrAttribute: VUE_META_SERVER_RENDERED_ATTRIBUTE,
  tagIDKeyName: VUE_META_TAG_LIST_ID_KEY_NAME
}

const getMetaInfo = _getMetaInfo(defaultOptions)

describe('getMetaInfo', () => {
  // const container = document.createElement('div')
  let component

  afterEach(() => component.$destroy())

  it('returns appropriate defaults when no meta info is found', () => {
    component = new Vue()
    expect(getMetaInfo(component)).to.eql({
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

  it('returns metaInfo when used in component', () => {
    component = new Vue({
      metaInfo: {
        title: 'Hello',
        meta: [
          { charset: 'utf-8' }
        ]
      }
    })
    expect(getMetaInfo(component)).to.eql({
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

  it('properly uses string titleTemplates', () => {
    component = new Vue({
      metaInfo: {
        title: 'Hello',
        titleTemplate: '%s World',
        meta: [
          { charset: 'utf-8' }
        ]
      }
    })
    expect(getMetaInfo(component)).to.eql({
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

  it('properly uses function titleTemplates', () => {
    const titleTemplate = chunk => `${chunk} Function World`

    component = new Vue({
      metaInfo: {
        title: 'Hello',
        titleTemplate: titleTemplate,
        meta: [
          { charset: 'utf-8' }
        ]
      }
    })
    expect(getMetaInfo(component)).to.eql({
      title: 'Hello Function World',
      titleChunk: 'Hello',
      titleTemplate: titleTemplate,
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

  it('has the proper `this` binding when using function titleTemplates', () => {
    const titleTemplate = function (chunk) {
      return `${chunk} ${this.helloWorldText}`
    }

    component = new Vue({
      metaInfo: {
        title: 'Hello',
        titleTemplate: titleTemplate,
        meta: [
          { charset: 'utf-8' }
        ]
      },
      data () {
        return {
          helloWorldText: 'Function World'
        }
      }
    })
    expect(getMetaInfo(component)).to.eql({
      title: 'Hello Function World',
      titleChunk: 'Hello',
      titleTemplate: titleTemplate,
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
})
