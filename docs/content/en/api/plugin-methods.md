---
title: Plugin Methods
description: 'Manage HTML metadata in Vue.js components with SSR support for Nuxt.js!'
position: 15
category: 'Api references'
---

The `vue-meta` plugin injects a `$meta()` function in the Vue prototype which provides the following methods

<alert type="info">
  
  Note

  `$meta()` is a function so we only need to insert it once in the `Vue.prototype`, but still use `this` to reference the component it was called from

</alert>

### $meta().getOptions
- returns [`pluginOptions`](/api/plugin-options)

Could be used by third-party libraries who wish to interact with `vue-meta`

### $meta().setOptions <badge>v2.3+</badge>
- arguments:
  - options (type `object`)
- returns [`pluginOptions`](/api/plugin-options)

You can toggle some plugin options during runtime by calling this method. Only [plugin options](/api/plugin-options) marked <badge>runtime</badge> can be changed

```js
vm.$meta().setOptions({ debounceWait: 50 })
```

### $meta().addApp <badge>v2.3</badge>
- arguments:
  - appName (type: `string`)
- returns app object `{ set, remove }`

Originally `vue-meta` only supported adding meta info from Vue components. This caused some issues for third party integrations as they have to add their meta info through eg the root component while that already could contain meta info.

To improve this third party integrations can use `addApp` to add their meta information.

Example of adding additional meta info for eg a third party plugin:

```js
const { set, remove } = vm.$meta().addApp('custom')

set({
  meta: [{ charset: 'utf=8' }]
})

setTimeout(() => remove(), 3000)
```

There is no reactivity for custom apps. The integrator need to take care of that and call `set` and `remove` when appropiate. If you call `addApp.set` on the client before the app is mounted, the tags will be processed on the first refresh. If you call set when the app is mounted they tags are immediately processed.

The function is called addApp because the added metaInfo is treated exactly the same as when there are multiple apps on one page. Eg the tags that will be added will also list the `appId` you specifiy:
```html
<meta data-vue-meta="custom" charset="utf-8">
```

### $meta().refresh
- returns [`metaInfo`](/api/metainfo-properties)

Updates the current metadata with new metadata.
Useful when updating metadata as the result of an asynchronous action that resolves after the initial render takes place.

### $meta().inject
- arguments
  - injectOptions (type: `object`) <badge>v2.4</badge>
- returns [`metaInfo`](/api/metainfo-properties)

<alert type="info">

  SSR only
  
  `inject` is available in the server plugin only and is not available on the client

</alert>

You can pass an object to inject with global inject options. See [SSR injection method arguments](/api/ssr-injection-methods#noscripttext) for a list of available options.

It returns a special `metaInfo` object where all keys have an object as value which contains a `text()` method for returning html code

See [Rendering with renderToString](/guide/ssr) for an example

#### Passing arguments to `text()`

In some cases you can pass an argument to the text method. E.g. to [automatically add the ssrAttribute on ssr](/faq/prevent-initial) or [render properties in the body](/api/special-metainfo-attributes#body)

### $meta().pause
- arguments:
  - refresh (type `boolean`, default `false`)
- returns `resume()`

Pauses global metadata updates until either the returned resume method is called or [resume](/api/#meta-resume)

### $meta().resume
- arguments:
  - refresh (type `boolean`, default `false`)
- returns [`metaInfo`](/api/metainfo-properties) (optional)

Resumes metadata updates after they have been paused. If `refresh` is `true` it immediately initiates a metadata update by calling [refresh](/api/plugin-methods#metarefresh)