import Vue, { ComponentOptions } from 'vue'
import VueMeta, { VueMetaPlugin, VueMetaOptions, MetaInfo, MetaInfoSSR } from '../index'

Vue.use(VueMeta, {
  keyName: 'head'
} as VueMetaOptions)

const FooMetaInfo: MetaInfo = {
  title: 'title',
  titleTemplate: '%s - Home',
  bodyAttrs: { class: 'a' }
}

const BarMetaInfo: MetaInfo = {
  title: 'title',
  titleTemplate: c => `${c} - Home`,
  bodyAttrs: { class: ['a', 'b'] },
  __dangerouslyDisableSanitizers: ['script'],
  __dangerouslyDisableSanitizersByTagID: {
    ldjson: ['innerHTML']
  },
  script: [{
    src: '', crossorigin: '', async: true
  }],
  meta: [
    { charset: 'utf-8' },
    {
      'property': 'og:title',
      'content': 'Test title',
      'template': chunk => `${chunk} - My page`, //or as string template: '%s - My page',
      'vmid': 'og:title'
    }
  ],
  changed(newdata: MetaInfo, newTags: HTMLElement[], oldTags: HTMLElement[]) {
  },
  afterNavigation(data: MetaInfo) {
  }
}

const Foo: ComponentOptions<Vue> = {
  metaInfo: FooMetaInfo
}

const Bar: ComponentOptions<Vue> = {
  metaInfo() {
    return BarMetaInfo
  }
}

const app: Vue = new Vue(Foo)
const $meta: VueMetaPlugin = app.$meta()

// getOptions
const options: VueMetaOptions = $meta.getOptions()

// client side refresh
const { metaInfo: metaData1 }: { metaInfo: MetaInfo } = $meta.refresh()

// server side injection
const metaDataSSR: MetaInfoSSR = $meta.inject()
if (metaDataSSR.script) {
  metaDataSSR.script.text()
  metaDataSSR.script.text({ body: true })
}

// pausing & resuming
let resume
resume = $meta.pause()
const ret: void = resume()
resume = $meta.pause(true)
const { metaInfo: metaData2 }: { metaInfo: MetaInfo } = resume()
const { metaInfo: metaData3 }: { metaInfo: MetaInfo } = $meta.resume(true)
