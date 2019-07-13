---
home: true
heroImage: /vue-meta.png
heroText: vue-meta
tagline: HTML Metadata manager for Vue.js
actionText: Get Started →
actionLink: /guide/
features:
- title: What?
  details: vue-meta is a plugin for Vue.js which helps you to manage your app's metadata using Vue's built-in reactivity
- title: How?
  details: Just add the special property `metaInfo` to any or all your components as these will be automatically merged top-down
- title: So?
  details: Nested components can overwrite each others values, allowing you to easily add or remove metadata where and when you need it!
footer:
  MIT License | Created by Declan de Wet, currently developed with ❤ by Nuxt.js core-team & contributors
---
::: tip We need your help!
We are working on defining the RFC for Vue Meta v3.0. It will be a ground-breaking release built from the ground up.

We would like your help with this! Please visit the [Vue Meta v3.0 rfc](https://github.com/nuxt/rfcs/issues/19) and let us know your thoughts.
:::

#### See the [examples](https://github.com/nuxt/vue-meta/tree/master/examples) for more inspiration!

```js
// Component.vue
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
<!-- Rendered HTML tags in your page -->
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
```
