<p align="center">
  <img src="./docs/.vuepress/public/vue-meta.png" alt="vue-meta" />
</p>

<h5 align="center">
  Manage HTML metadata in Vue.js components with SSR support
</h5>

<p align="center">
  <a href="http://npm-stat.com/charts.html?package=vue-meta"><img src="https://img.shields.io/npm/dm/vue-meta.svg" alt="npm downloads"></a>
  <a href="http://npmjs.org/package/vue-meta"><img src="https://img.shields.io/npm/v/vue-meta.svg" alt="npm version"></a>
  <a href="https://codecov.io/gh/nuxt/vue-meta"><img src="https://badgen.net/codecov/c/github/nuxt/vue-meta/master" alt="Coverage Status"></a>
  <a href="https://circleci.com/gh/nuxt/vue-meta/"><img src="https://badgen.net/circleci/github/nuxt/vue-meta" alt="Build Status"></a>
  <a href="https://david-dm.org/nuxt/vue-meta"><img src="https://david-dm.org/nuxt/vue-meta/status.svg" alt="dependencies Status"></a>
  <a href="https://discord.nuxtjs.org/"><img src="https://badgen.net/badge/Discord/join-us/7289DA" alt="Discord"></a>
</p>

```html
<template>
  ...
</template>

<script>
  export default {
    metaInfo: {
      title: 'My Example App',
      titleTemplate: '%s - Yay!',
      htmlAttrs: {
        lang: 'en',
        amp: true
      }
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

> :globe_with_meridians: Please help us translate the documentation into your language, see [here](#how-to-translate-documentation) for more information

## Examples

Looking for more examples what vue-meta can do for you? Have a look at the [examples](https://github.com/nuxt/vue-meta/tree/master/examples)

## Installation

##### Yarn
```sh
$ yarn add vue-meta
```

##### npm
```sh
$ npm install vue-meta --save
```

##### Download / CDN

Use the download links below - if you want a previous version, check the instructions at https://unpkg.com.

Latest version: https://unpkg.com/vue-meta/dist/vue-meta.min.js

Latest v1.x version: https://unpkg.com/vue-meta@1/dist/vue-meta.min.js

**Uncompressed:**
```html
<script src="https://unpkg.com/vue-meta/dist/vue-meta.js"></script>
```

**Minified:**
```html
<script src="https://unpkg.com/vue-meta/dist/vue-meta.min.js"></script>
```

## Quick Usage

See the [documentation](https://vue-meta.nuxtjs.org) for more information
```js
import Vue from 'vue'
import VueMeta from 'vue-meta'

Vue.use(VueMeta, {
  // optional pluginOptions
  refreshOnceOnNavigation: true
})
```

## Frameworks using vue-meta

If you wish to create your app even more quickly, take a look at the following frameworks which use vue-meta

- [Nuxt.js](https://github.com/nuxt/nuxt.js) - The Vue.js Progressive Framework
- [Gridsome](https://github.com/gridsome/gridsome) - The Vue.js JAMstack Framework
- [Ream](https://github.com/ream/ream) - Framework for building universal web app and static website in Vue.js
- [Vue-Storefront](https://github.com/DivanteLtd/vue-storefront) - PWA for eCommerce
- [Factor JS](https://github.com/fiction-com/factor) - Extension-first VueJS platform for front-end developers.

## How to translate documentation

Thanks for your interest in translating the documentation. As our docs are based on VuePress, we recommend to have a look at their docs about [internationalization](https://vuepress.vuejs.org/guide/i18n.html#site-level-i18n-config) as well

Here are the steps you will need to take:
- Clone this repository
- Create a new branch
- Browse to `/docs/`
- Create a folder with the language code you will add a translation for (eg `/zh/`)
- Copy all `*.md` files and the folders `api`, `faq`, and `guide` to that folder
- Translate the copied files in your language folder
- Edit `.vuepress/config.yml` and add a config section for your locale in both `locales` as `themeConfig.locales`
- Test your translation by running the docs dev server with `yarn docs`
- Create a pull request with your changes
- Receive eternal gratefulness from your fellow language speakers :heart:

## Old versions

Click [here](https://github.com/nuxt/vue-meta/tree/1.x) if you are looking for the old v1 readme

## License

[MIT](./LICENSE.md)
