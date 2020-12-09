---
title: Plugin Properties
description: 'Manage HTML metadata in Vue.js components with SSR support for Nuxt.js!'
position: 13
category: 'Api references'

---

<alert type="info">

  VueMeta exports a Vue plugin as default export. This section describes the properties of that default export

</alert>

### version
- type `string`

The version of the plugin, it is the same as the package version

### install

The method used by Vue to install the plugin

### hasMetaInfo
- argument:
  - vm (a Vue component)
- returns `boolean`

A helper function which returns true when the Vue component passed as argument has metaInfo defined

### generate <badge>v2.2+</badge>

<alert type="warning">

  This method is not available in the browser builds

</alert>

- arguments:
  - metaInfo
  - options (optional)
- returns `metaInfo`

This method is similar to [`$meta.inject()`](/api/plugin-methods#metainject) but works without the need for a Vue instance

```js
import VueMeta from 'vue-meta'

const { generate } = VueMeta

const rawMetaInfo = {
  meta: [{ charset: 'utf-8' }]
}

const metaInfo = generate(rawMetaInfo /*, yourOptions*/)

const HEAD = metaInfo.script.text() + metaInfo.meta.text()
```
will result In

```html
<meta charset="utf-8">
```