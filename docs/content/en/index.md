---
title: ''
menuTitle: Introduction
position: 1
fullscreen: true
description: HTML Metadata manager for Vue.js
category: ''
footer:
  MIT License | Created by Declan de Wet, currently developed with ❤ by Nuxt.js core-team & contributors
---

<header class="flex flex-col items-center">

![](/icon.png)

# vue-meta

<p class="text-xl">
  HTML Metadata manager for Vue.js
</p>
<a href="/guide" class="rounded bg-primary-100 dark:bg-primary-900 text-primary-500 text-lg font-medium px-3 py-1 inline-block">
  Get Started →
</a>
</p>

</header>

<div class="flex md:flex-row gap-4 flex-col">
<div class="w-full">

## What?
vue-meta is a plugin for Vue.js which helps you to manage your app's metadata using Vue's built-in reactivity

</div>
<div class="w-full">

## How?
Just add the special property `metaInfo` to any or all your components as these will be automatically merged top-down

</div>
<div class="w-full">

## So?
Nested components can overwrite each others values, allowing you to easily add or remove metadata where and when you need it!

</div>
</div>

<br>

<alert type="info">

**We need your help!**

We are working on defining the RFC for Vue Meta v3.0. It will be a ground-breaking release built from the ground up. We would like your help with this! Please visit the [Vue Meta v3.0 rfc](https://github.com/nuxt/rfcs/issues/19) and let us know your thoughts.

</alert>

#### See the [examples](https://github.com/nuxt/vue-meta/tree/master/examples) for more inspiration!


<code-group>
  <code-block label="Component" active>

  ```js
  export default {
    metaInfo: {
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ]
    },
    // ...
  }
  ```

  </code-block>
  <code-block label="Rendered HTML">

  ```html
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  ```

  </code-block>
</code-group>
