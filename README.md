> :warning: This is the readme for the next branch of vue-meta with Vue3 support

> :information_source: Vue3 support for vue-meta is considered in mostly-stable-alpha stage

<p align="center">
  <img src="./docs/.vuepress/public/vue-meta.png" alt="vue-meta" />
</p>

<h5 align="center">
  Manage HTML metadata in Vue.js components with SSR support
</h5>

<p align="center">
  <a href="http://npm-stat.com/charts.html?package=vue-meta"><img src="https://img.shields.io/npm/dm/vue-meta.svg" alt="npm downloads"></a>
  <a href="http://npmjs.org/package/vue-meta"><img src="https://img.shields.io/npm/v/vue-meta/next.svg" alt="npm version"></a>
  <a href="https://codecov.io/gh/nuxt/vue-meta"><img src="https://badgen.net/codecov/c/github/nuxt/vue-meta/next" alt="Coverage Status"></a>
  <a href="https://circleci.com/gh/nuxt/vue-meta/"><img src="https://badgen.net/circleci/github/nuxt/vue-meta/next" alt="Build Status"></a>
  <a href="https://david-dm.org/nuxt/vue-meta"><img src="https://david-dm.org/nuxt/vue-meta/next/status.svg" alt="dependencies Status"></a>
  <a href="https://discord.nuxtjs.org/"><img src="https://badgen.net/badge/Discord/join-us/7289DA" alt="Discord"></a>
</p>

```html
<template>
  <div class="layout"
    ...
    <metainfo>
      <template v-slot:title="{ content }">{{ content }} - Yay!</template>
    </metainfo>
  </div>
</template>

<script>
import { useMeta } from 'vue-meta'

export default {
  setup () {
    useMeta({
      title: 'My Example App',
      htmlAttrs: {
        lang: 'en',
        amp: true
      }
    })
  }
}
</script>
```
```html
<html lang="en" amp>
<head>
  <title>My Example App - Yay!</title>
  ...
</head>
```
# Introduction
Vue Meta is a [Vue.js](https://vuejs.org) plugin that allows you to manage your app's metadata. It is inspired by and works similar as [`react-helmet`](https://github.com/nfl/react-helmet) for react. However, instead of setting your data as props passed to a proprietary component, you simply export it as part of your component's data using the `metaInfo` property.

These properties, when set on a deeply nested component, will cleverly overwrite their parent components' `metaInfo`, thereby enabling custom info for each top-level view as well as coupling metadata directly to deeply nested subcomponents for more maintainable code.

## Documentation

Please find the documention on https://vue-meta.nuxtjs.org


## Examples

Looking for more examples what vue-meta can do for you? Have a look at the [examples](https://github.com/nuxt/vue-meta/tree/next/examples)

## Installation

##### Yarn
```sh
$ yarn add vue-meta@next
```

##### npm
```sh
$ npm install vue-meta@next --save
```

## Quick Usage

### useApi

```js
import { watch } from 'vue'
import { useMeta, useActiveMeta } from 'vue-meta'

export default {
  setup () {
    const counter = ref(0)

    // Add meta info
    // The object passed into useMeta is user configurable
    const { meta } = useMeta({
      title: 'My Title',
    })

    watchEffect(() => {
      const counterValue = counter.value
      meta.description = `Counted ${counterValue} times`
    })

    // Or use a computed prop
    const computedMeta = computed(() => ({
      title: 'My Title',
      description : `Counted ${counter.value} times`
    }))

    const { meta, onRemoved } = useMeta(computedMeta)

    onRemoved(() => {
      // Do something as soon as this metadata is removed,
      // eg because the component instance was destroyed
    })

    // Get the currently used metainfo
    const metadata = useActiveMeta()

    watch(metadata, (newValue) => {
      // metadata was updated, do something
    })
  }
}
```

The useApi can also be used outside of a setup function, but then
you need to get a reference to the metaManager somehow

```js
const { unmount } = useMeta(
  {
    og: {
      something: 'test'
    }
  },
  metaManager
)

unmount() // Remove metadata when needed
```

### SSR 

```js
import { createSSRApp } from 'vue'
import { renderToStringWithMeta } from 'vue-meta'
import { App, metaManager } from './App'

export function renderPage() {
  const app = createSSRApp(App)
  app.use(metaManager)

  const [appHtml, ctx] = await renderToStringWithMeta(app)

  return `
  <html ${ctx.teleports.htmlAttrs || ''}>
    <head ${ctx.teleports.headAttrs || ''}>
     ${ctx.teleports.head || ''}
    </head>
    <body ${ctx.teleports.bodyAttrs || ''}>
      <div id="app">${appHtml}</div>
     ${ctx.teleports.body || ''}
    </body>
  </html>`
}
```

## Old versions

Click [here](https://github.com/nuxt/vue-meta/tree/master) if you are looking for the old v2 readme

Click [here](https://github.com/nuxt/vue-meta/tree/1.x) if you are looking for the old v1 readme

## License

[MIT](./LICENSE.md)
