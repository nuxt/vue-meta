---
title: Setup
description: 'Manage HTML metadata in Vue.js components with SSR support for Nuxt.js!'
position: 2
category: Guide
---

# Installation

<alert type="info">

  Using a framework ?

  Are you using a framework like Nuxt.js, Gridsome or another one which uses vue-meta? Then `vue-meta` should already be installed and you can skip to [Usage](/usage/metainfo) or consult the [documentation](/guide/framework) of your framework for more information.

</alert>

## Download / CDN

[https://unpkg.com/vue-meta/dist/vue-meta.js](https://unpkg.com/vue-meta/dist/vue-meta.js)

For the latest version in the v1.x branch you can use:<br/>
[https://unpkg.com/vue-meta@1/dist/vue-meta.js](https://unpkg.com/vue-meta@1/dist/vue-meta.js)

Or you can replace `1` with the full version number you wish to use.

If you include `vue-meta` after Vue it will install automatically

**Unminified (suggested only for dev):**
```html
<script src="https://unpkg.com/vue-meta/dist/vue-meta.js"></script>
```

**Minified:**
```html
<script src="https://unpkg.com/vue-meta/dist/vue-meta.min.js"></script>
```

## Package manager
<code-group>
  <code-block label="yarn" active>

  ```bash
  yarn add vue-meta
  ```

  </code-block>
  <code-block label="npm">

  ```bash
  npm i vue-meta
  ```

  </code-block>
</code-group>

### Install

<alert type="warning">

  Using a framework ?

  If you use a framework like Nuxt.js or Gridsome, `vue-meta` comes pre-installed and this step is most likely **not** required. Consult the [documentation](/guide/frameworks) of your framework for more information

</alert>

If you add `vue-meta` with a package manager, you will need to install the `vue-meta` plugin manually:

```js
import Vue from 'vue'
import VueMeta from 'vue-meta'

Vue.use(VueMeta)
```
