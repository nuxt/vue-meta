---
title: How to use async data in metaInfo?
description: 'HTML Metadata manager for Vue.js'
position: 34
category: FAQ
---

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

Check out the [vuex-async](https://github.com/nuxt/vue-meta/tree/master/examples/vuex-async) example for a more detailed demonstration
