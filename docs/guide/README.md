# Installation

:::tip Using a framework?

Are you using a framework like Nuxt.js, Gridsome or another one which uses vue-meta? Then `vue-meta` should already be installed and you can skip to [Usage](/guide/metainfo.html) or consult the [documentation](/guide/frameworks.html) of your framework for more details.
:::

## Download / CDN

[https://unpkg.com/vue-meta/lib/vue-meta.js](https://unpkg.com/vue-meta/lib/vue-meta.js)

For the latest version in the v1.x branch you can use:<br/>
[https://unpkg.com/vue-meta@1/lib/vue-meta.js](https://unpkg.com/vue-meta@1/lib/vue-meta.js)

Or you can replace `1` with the full version number you wish to use.

If you include vue-meta after Vue it will install automatically

**Uncompressed:**
```html
<script src="https://unpkg.com/vue-meta/lib/vue-meta.js"></script>
```

**Minified:**
```html
<script src="https://unpkg.com/vue-meta/lib/vue-meta.min.js"></script>
```

## Package manager
**Yarn**
```sh
$ yarn add vue-meta
```

**npm**
```sh
$ npm install vue-meta --save
```

### Install
You need to explicitly install vue-meta when using a package manager

```js
import Vue from 'vue'
import VueMeta from 'vue-meta'

Vue.use(VueMeta)
```
