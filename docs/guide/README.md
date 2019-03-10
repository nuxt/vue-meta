# Preparing the plugin
:::tip Note
This step is optional if you don't need SSR and `Vue` is available as a global variable. `vue-meta` will install itself in this case.
:::

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

## Options

`vue-meta` allows a few custom options:

```js
Vue.use(Meta, {
  keyName: 'metaInfo',
  attribute: 'data-vue-meta',
  ssrAttribute: 'data-vue-meta-server-rendered',
  tagIDKeyName: 'vmid',
  refreshOnceOnNavigation: true
})
```

See the [API](/api/#plugin-options) for a description of the available plugin options
