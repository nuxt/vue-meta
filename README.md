<p align="center">
  <img src="http://imgur.com/258WtHI.png" alt="vue-meta">
</p>

<h5 align="center">
  Manage page meta info in Vue 2.0 components. SSR + Streaming supported. Inspired by <a href="https://github.com/nfl/react-helmet">react-helmet</a>.
</h5>

<p align="center">
  <a href="https://github.com/feross/standard">
    <img src="https://cdn.rawgit.com/feross/standard/master/badge.svg" alt="Standard - JavaScript Style">
  </a>
</p>

<p align="center">
<a href="https://github.com/declandewet/vue-meta/releases/latest"><img src="https://img.shields.io/github/release/declandewet/vue-meta.svg" alt="github release"></a> <a href="http://npmjs.org/package/vue-meta"><img src="https://img.shields.io/npm/v/vue-meta.svg" alt="npm version"></a> <a href="https://travis-ci.org/declandewet/vue-meta"><img src="https://travis-ci.org/declandewet/vue-meta.svg?branch=master" alt="Build Status"></a> <a href="https://codecov.io/gh/declandewet/vue-meta"><img src="https://codecov.io/gh/declandewet/vue-meta/branch/master/graph/badge.svg" alt="codecov"></a><br>
<a href="https://david-dm.org/declandewet/vue-meta"><img src="https://david-dm.org/declandewet/vue-meta/status.svg" alt="dependencies Status"></a> <a href="https://david-dm.org/declandewet/vue-meta?type=dev"><img src="https://david-dm.org/declandewet/vue-meta/dev-status.svg" alt="devDependencies Status"></a><br>
<a href="http://npm-stat.com/charts.html?package=vue-meta"><img src="https://img.shields.io/npm/dm/vue-meta.svg" alt="npm downloads"></a> <a href="https://gitter.im/declandewet/vue-meta"><img src="https://badges.gitter.im/declandewet/vue-meta.svg" alt="Gitter"></a>
</p>

```html
<template>
  ...
</template>

<script>
  export default {
    metaInfo: {
      title: 'My Example App', // set a title
      titleTemplate: '%s - Yay!', // title is now "My Example App - Yay!"
      htmlAttrs: {
        lang: 'en',
        amp: undefined // "amp" has no value
      }
    }
  }
</script>
```

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
# Table of Contents

- [Description](#description)
- [Disclaimer](#disclaimer)
- [Installation](#installation)
    - [Yarn](#yarn)
    - [NPM](#npm)
    - [CDN](#cdn)
- [Usage](#usage)
  - [Step 1: Preparing the plugin](#step-1-preparing-the-plugin)
      - [Options](#options)
  - [Step 2: Server Rendering (Optional)](#step-2-server-rendering-optional)
    - [Step 2.1: Exposing `$meta` to `bundleRenderer`](#step-21-exposing-meta-to-bundlerenderer)
    - [Step 2.2: Populating the document meta info with `inject()`](#step-22-populating-the-document-meta-info-with-inject)
      - [Simple Rendering with `renderToString()`](#simple-rendering-with-rendertostring)
      - [Streaming Rendering with `renderToStream()`](#streaming-rendering-with-rendertostream)
  - [Step 3: Start defining `metaInfo`](#step-3-start-defining-metainfo)
    - [Recognized `metaInfo` Properties](#recognized-metainfo-properties)
      - [`title` (String)](#title-string)
      - [`titleTemplate` (String)](#titletemplate-string)
      - [`htmlAttrs` (Object)](#htmlattrs-object)
      - [`bodyAttrs` (Object)](#bodyattrs-object)
      - [`base` (Object)](#base-object)
      - [`meta` ([Object])](#meta-object)
      - [`link` ([Object])](#link-object)
      - [`style` ([Object])](#style-object)
      - [`script` ([Object])](#script-object)
      - [`noscript` ([Object])](#noscript-object)
      - [`__dangerouslyDisableSanitizers` ([String])](#__dangerouslydisablesanitizers-string)
      - [`changed` (Function)](#changed-function)
    - [How `metaInfo` is Resolved](#how-metainfo-is-resolved)
      - [Lists of Tags](#lists-of-tags)
- [Performance](#performance)
    - [How to prevent the update on the initial page render](#how-to-prevent-the-update-on-the-initial-page-render)
- [FAQ](#faq)
  - [How do I use component props and/or component data in `metaInfo`?](#how-do-i-use-component-props-andor-component-data-in-metainfo)
  - [How do I populate `metaInfo` from the result of an asynchronous action?](#how-do-i-populate-metainfo-from-the-result-of-an-asynchronous-action)
  - [Why doesn't `vue-meta` support `jsnext:main`?](#why-doesnt-vue-meta-support-jsnextmain)
- [Examples](#examples)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->


# Description
`vue-meta` is a [Vue 2.0](https://vuejs.org) plugin that allows you to manage your app's meta information, much like [`react-helmet`](https://github.com/nfl/react-helmet) does for React. However, instead of setting your data as props passed to a proprietary component, you simply export it as part of your component's data using the `metaInfo` property.

These properties, when set on a deeply nested component, will cleverly overwrite their parent components' `metaInfo`, thereby enabling custom info for each top-level view as well as coupling meta info directly to deeply nested subcomponents for more maintainable code.

# Disclaimer

**Please note** that this project is still in very early alpha development and is *not* considered to be production ready.
**You have been warned.** There might still be a few bugs and many tests have yet to be written.

# Installation

### Yarn
```sh
$ yarn add vue-meta
```

### NPM
```sh
$ npm install vue-meta --save
```

### CDN

Use the links below - if you want a previous version, check the instructions at https://unpkg.com.

<!-- start CDN generator - do **NOT** remove this comment -->
**Uncompressed:**
```html
<script src="https://unpkg.com/vue-meta@1.1.0/lib/vue-meta.js"></script>
```

**Minified:**
```html
<script src="https://unpkg.com/vue-meta@1.1.0/lib/vue-meta.min.js"></script>
```
<!-- end CDN generator - do **NOT** remove this comment -->

# Usage

## Step 1: Preparing the plugin
> This step is optional if you don't need SSR and `Vue` is available as a global variable. `vue-meta` will install itself in this case.

In order to use this plugin, you first need to pass it to `Vue.use` - if you're not rendering on the server-side, your JS entry file will suffice. If you are rendering on the server, then place it in a file that runs both on the server and on the client before your root instance is mounted. If you're using [`vue-router`](https://github.com/vuejs/vue-router), then your main `router.js` file is a good place:

**router.js:**
```js
import Vue from 'vue'
import Router from 'vue-router'
import Meta from 'vue-meta'

Vue.use(Router)
Vue.use(Meta)

export default new Router({
  ...
})
```

#### Options

`vue-meta` allows a few custom options:

```js
Vue.use(Meta, {
  keyName: 'metaInfo', // the component option name that vue-meta looks for meta info on.
  attribute: 'data-vue-meta', // the attribute name vue-meta adds to the tags it observes
  ssrAttribute: 'data-vue-meta-server-rendered', // the attribute name that lets vue-meta know that meta info has already been server-rendered
  tagIDKeyName: 'vmid' // the property name that vue-meta uses to determine whether to overwrite or append a tag
})
```

If you don't care about server-side rendering, you can skip straight to [step 3](#step-3-start-defining-metainfo). Otherwise, continue. :smile:

## Step 2: Server Rendering (Optional)

If you have an isomorphic/universal webapp, you'll likely want to render your metadata on the server side as well. Here's how.

### Step 2.1: Exposing `$meta` to `bundleRenderer`

You'll need to expose the results of the `$meta` method that `vue-meta` adds to the Vue instance to the bundle render context before you can begin injecting your meta information. You'll need to do this in your server entry file:

**server-entry.js:**
```js
import app from './app'

const router = app.$router
const meta = app.$meta() // here

export default (context) => {
  router.push(context.url)
  context.meta = meta // and here
  return app
}
```

### Step 2.2: Populating the document meta info with `inject()`

All that's left for you to do now before you can begin using `metaInfo` options in your components is to make sure they work on the server by `inject`-ing them so you can call `text()` on each item to render out the necessary info. You have two methods at your disposal:

#### Simple Rendering with `renderToString()`

Considerably the easiest method to wrap your head around is if your Vue server markup is rendered out as a string:

**server.js:**

```js
app.get('*', (req, res) => {
  const context = { url: req.url }
  renderer.renderToString(context, (error, html) => {
    if (error) return res.send(error.stack)
    const {
      title, htmlAttrs, bodyAttrs, link, style, script, noscript, meta
    } = context.meta.inject()
    return res.send(`
      <!doctype html>
      <html data-vue-meta-server-rendered ${htmlAttrs.text()}>
        <head>
          ${meta.text()}
          ${title.text()}
          ${link.text()}
          ${style.text()}
          ${script.text()}
          ${noscript.text()}
        </head>
        <body ${bodyAttrs.text()}>
          ${html}
          <script src="/assets/vendor.bundle.js"></script>
          <script src="/assets/client.bundle.js"></script>
        </body>
      </html>
    `)
  })
})
```

#### Streaming Rendering with `renderToStream()`

A little more complex, but well worth it, is to instead stream your response. `vue-meta` supports streaming with no effort (on it's part :stuck_out_tongue_winking_eye:) thanks to Vue's clever `bundleRenderer` context injection:

**server.js**
```js
app.get('*', (req, res) => {
  const context = { url: req.url }
  const renderStream = renderer.renderToStream(context)
  renderStream.once('data', () => {
    const {
      title, htmlAttrs, bodyAttrs, link, style, script, noscript, meta
    } = context.meta.inject()
    res.write(`
      <!doctype html>
      <html data-vue-meta-server-rendered ${htmlAttrs.text()}>
        <head>
          ${meta.text()}
          ${title.text()}
          ${link.text()}
          ${style.text()}
          ${script.text()}
          ${noscript.text()}
        </head>
        <body ${bodyAttrs.text()}>
    `)
  })
  renderStream.on('data', (chunk) => {
    res.write(chunk)
  })
  renderStream.on('end', () => {
    res.end(`
          <script src="/assets/vendor.bundle.js"></script>
          <script src="/assets/client.bundle.js"></script>
        </body>
      </html>
    `)
  })
  renderStream.on('error', (error) => res.status(500).end(`<pre>${error.stack}</pre>`))
})
```

## Step 3: Start defining `metaInfo`

In any of your components, define a `metaInfo` property:

**App.vue:**
```html
<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'App',
    metaInfo: {
      // if no subcomponents specify a metaInfo.title, this title will be used
      title: 'Default Title',
      // all titles will be injected into this template
      titleTemplate: '%s | My Awesome Webapp'
    }
  }
</script>
```

**Home.vue**
```html
<template>
  <div id="page">
    <h1>Home Page</h1>
  </div>
</template>

<script>
  export default {
    name: 'Home',
    metaInfo: {
      title: 'My Awesome Webapp',
      // override the parent template and just use the above title only
      titleTemplate: null
    }
  }
</script>
```

**About.vue**
```html
<template>
  <div id="page">
    <h1>About Page</h1>
  </div>
</template>

<script>
  export default {
    name: 'About',
    metaInfo: {
      // title will be injected into parent titleTemplate
      title: 'About Us'
    }
  }
</script>
```

### Recognized `metaInfo` Properties

#### `title` (String)

Maps to the inner-text value of the `<title>` element.

```js
{
  metaInfo: {
    title: 'Foo Bar'
  }
}
```

```html
<title>Foo Bar</title>
```

#### `titleTemplate` (String)

The value of `title` will be injected into the `%s` placeholder in `titleTemplate` before being rendered. The original title will be available on `metaInfo.titleChunk`.

```js
{
  metaInfo: {
    title: 'Foo Bar',
    titleTemplate: '%s - Baz'
  }
}
```

```html
<title>Foo Bar - Baz</title>
```

#### `htmlAttrs` (Object)

Each **key:value** maps to the equivalent **attribute:value** of the `<html>` element.

```js
{
  metaInfo: {
    htmlAttrs: {
      foo: 'bar',
      amp: undefined
    }
  }
}
```

```html
<html foo="bar" amp></html>
```

#### `bodyAttrs` (Object)

Each **key:value** maps to the equivalent **attribute:value** of the `<body>` element.

```js
{
  metaInfo: {
    bodyAttrs: {
      bar: 'baz'
    }
  }
}
```

```html
<body bar="baz">Foo Bar</body>
```

#### `base` (Object)

Maps to a newly-created `<base>` element, where object properties map to attributes.

```js
{
  metaInfo: {
    base: { target: '_blank', href: '/' }
  }
}
```

```html
<base target="_blank" href="/">
```

#### `meta` ([Object])

Each item in the array maps to a newly-created `<meta>` element, where object properties map to attributes.

```js
{
  metaInfo: {
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' }
    ]
  }
}
```

```html
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
```

#### `link` ([Object])

Each item in the array maps to a newly-created `<link>` element, where object properties map to attributes.

```js
{
  metaInfo: {
    link: [
      { rel: 'stylesheet', href: '/css/index.css' },
      { rel: 'favicon', href: 'favicon.ico' }
    ]
  }
}
```

```html
<link rel="stylesheet" href="/css/index.css">
<link rel="favicon" href="favicon.ico">
```

#### `style` ([Object])

Each item in the array maps to a newly-created `<style>` element, where object properties map to attributes.

```js
{
  metaInfo: {
    style: [
      { cssText: '.foo { color: red }', type: 'text/css' }
    ]
  }
}
```

```html
<style type="text/css">.foo { color: red }</style>
```

#### `script` ([Object])

Each item in the array maps to a newly-created `<script>` element, where object properties map to attributes.

```js
{
  metaInfo: {
    script: [
      { innerHTML: '{ "@context": "http://schema.org" }', type: 'application/ld+json' }
    ]
  }
}
```

```html
<script type="application/ld+json">{ "@context": "http://schema.org" }</script>
```

#### `noscript` ([Object])

Each item in the array maps to a newly-created `<noscript>` element, where object properties map to attributes.

```js
{
  metaInfo: {
    noscript: [
      { innerHTML: 'This website requires JavaScript.' }
    ]
  }
}
```

```html
<noscript>This website requires JavaScript.</noscript>
```

#### `__dangerouslyDisableSanitizers` ([String])

By default, `vue-meta` sanitizes HTML entities in _every_ property. You can disable this behaviour on a per-property basis using `__dangerouslyDisableSantizers`. Just pass it a list of properties you want sanitization to be disabled on:

```js
{
  metaInfo: {
    title: '<I will be sanitized>',
    meta: [{ vmid: 'description', name: 'description', content: '& I will not be <sanitized>'}],
    __dangerouslyDisableSanitizers: ['meta']
  }
}
```

```html
<title>&lt;I will be sanitized&gt;</title>
<meta vmid="description" name="description" content="& I will not be <sanitized>">
```

:warning: **Using this option is not recommended unless you know exactly what you are doing.** By disabling sanitization, you are opening potential vectors for attacks such as SQL injection & Cross-Site Scripting (XSS). Be very careful to not compromise your application.

#### `changed` (Function)

Will be called when the client `metaInfo` updates/changes. Receives the following parameters:
- `newInfo` (Object) - The new state of the `metaInfo` object.
- `addedTags` ([HTMLElement]) - a list of elements that were added.
- `removedTags` ([HTMLElement]) - a list of elements that were removed.

`this` context is the component instance `changed` is defined on.

```js
{
  metaInfo: {
    changed (newInfo, addedTags, removedTags) {
      console.log('Meta info was updated!')
    }
  }
}
```

### How `metaInfo` is Resolved

You can define a `metaInfo` property on any component in the tree. Child components that have `metaInfo` will recursively merge their `metaInfo` into the parent context, overwriting any duplicate properties. To better illustrate, consider this component heirarchy:

```html
<parent>
  <child></child>
</parent>
```

If both `<parent>` _and_ `<child>` define a `title` property inside `metaInfo`, then the `title` that gets rendered will resolve to the `title` defined inside `<child>`.

#### Lists of Tags

When specifying an array in `metaInfo`, like in the below examples, the default behaviour is to simply concatenate the lists.

**Input:**
```js
// parent component
{
  metaInfo: {
    meta: [
      { charset: 'utf-8' },
      { name: 'description', content: 'foo' }
    ]
  }
}
// child component
{
  metaInfo: {
    meta: [
      { name: 'description', content: 'bar' }
    ]
  }
}
```

**Output:**
```html
<meta charset="utf-8">
<meta name="description" content="foo">
<meta name="description" content="bar">
```

This is not what we want, since the meta `description` needs to be unique for every page. If you want to change this behaviour such that `description` is instead replaced, then give it a `vmid`:

**Input:**
```js
// parent component
{
  metaInfo: {
    meta: [
      { charset: 'utf-8' },
      { vmid: 'description', name: 'description', content: 'foo' }
    ]
  }
}
// child component
{
  metaInfo: {
    meta: [
      { vmid: 'description', name: 'description', content: 'bar' }
    ]
  }
}
```

**Output:**
```html
<meta charset="utf-8">
<meta vmid="description" name="description" content="bar">
```

While solutions like `react-helmet` manage the occurrence order and merge behaviour for you automatically, it involves a lot more code and is therefore prone to failure in some edge-cases, whereas this method is _almost_ bulletproof because of its versatility; _at the expense of one tradeoff:_ these `vmid` properties will be rendered out in the final markup (`vue-meta` uses these client-side to prevent duplicating or overriding markup). If you are serving your content GZIP'ped, then the slight increase in HTTP payload size is negligible.

# Performance

On the client, `vue-meta` batches DOM updates using [`requestAnimationFrame`](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame). It needs to do this because it registers a Vue mixin that subscribes to the [`beforeMount`](https://vuejs.org/api/#beforeMount) lifecycle hook on all components in order to be notified that renders have occurred and data is ready. If `vue-meta` did not batch updates, the DOM meta info would be re-calculated and re-updated for every component on the page in quick-succession.

Thanks to batch updating, the update will only occurr once - even if the correct meta info has already been compiled by the server. If you don't want this behaviour, see below.

### How to prevent the update on the initial page render

Add the `data-vue-meta-server-rendered` attribute to the `<html>` tag on the server-side:

```html
<html data-vue-meta-server-rendered>
...
```

`vue-meta` will check for this attribute whenever it attempts to update the DOM - if it exists, `vue-meta` will just remove it and perform no updates. If it does not exist, `vue-meta` will perform updates as usual.

> **Note:** While this may seem verbose, it _is_ intentional. Having `vue-meta` handle this for you automatically would limit interoperability with other server-side programming languages. If you use PHP to power your server, for example, you might also have meta info handled on the server already and want to prevent this extraneous update.

# FAQ

Here are some answers to some frequently asked questions.

## How do I use component props and/or component data in `metaInfo`?

Easy. Instead of defining `metaInfo` as an object, define it as a function and access `this` as usual:

**Post.vue:**
```html
<template>
  <div>
    <h1>{{ title }}</h1>
  </div>
</template>

<script>
  export default {
    name: 'post',
    props: ['title'],
    data () {
      return {
        description: 'A blog post about some stuff'
      }
    },
    metaInfo () {
      return {
        title: this.title,
        meta: [
          { vmid: 'description', name: 'description', content: this.description }
        ]
      }
    }
  }
</script>
```

**PostContainer.vue:**
```html
<template>
  <div>
    <post :title="title"></post>
  </div>
</template>

<script>
  import Post from './Post.vue'

  export default {
    name: 'post-container',
    components: { Post },
    data () {
      return {
        title: 'Example blog post'
      }
    }
  }
</script>
```

## How do I populate `metaInfo` from the result of an asynchronous action?

`vue-meta` will do this for you automatically when your component state changes.

Just make sure that you're using the function form of `metaInfo`:

```js
{
  data () {
    return {
      title: 'Foo Bar Baz'
    }
  },
  metaInfo () {
    return {
      title: this.title
    }
  }
}
```

Check out the [vuex-async](https://github.com/declandewet/vue-meta/tree/master/examples/vuex-async) example for a far more detailed demonstration if you have doubts.

Credit & Thanks for this feature goes to [Sébastien Chopin](https://github.com/Atinux).

## Why doesn't `vue-meta` support `jsnext:main`?

Originally, it did - however, it caused [problems](https://github.com/declandewet/vue-meta/issues/25). Essentially, Vue [does not support](https://github.com/vuejs/vue/issues/2880) `jsnext:main`, and does not introspect for the `default` property that is transpiled from the ES2015 source, thus breaking module resolution.

Given that `jsnext:main` is a non-standard property that won't stick around for long, and `vue-meta` is bundled into one file with no dynamic module internals as well as the fact that if you're using `vue-meta`, you're 99.9% likely to not be using it conditionally - the decision has been made to drop support for it entirely.

If this were not the case, you would have to instruct Babel to convert `default` imports to the proper commonjs module syntax via a plugin, which is not ideal since many users in the Vue landscape write their code in TypeScript, not Babel.

# Examples

To run the examples; clone this repository & run `npm install` in the root directory, and then run `npm run dev`. Head to http://localhost:8080.
