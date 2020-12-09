---
title: Caveats
description: 'Manage HTML metadata in Vue.js components with SSR support for Nuxt.js!'
position: 8
category: Usage
---

## Reactive variables in template functions

_Corresponding issue_ : [#322](https://github.com/nuxt/vue-meta/issues/322)

Both [title](/api/metainfo-properties#title) as [meta](/api/metainfo-properties#meta) support using template function.
Due to how Vue determines reactivity it is not possible to use reactive variables directly in template functions

```js
{
  // this wont work
  metaInfo() {
    return {
      titleTemplate: chunk => (
        this.locale === 'nl-NL'
        ? `${chunk} - Welkom`
        : `${chunk} - Welcome`
      )
    }
  }
}
```

You need to assign the reactive variable to a local variable first for this to work:

```js
{
  // this will work
  metaInfo() {
    const locale = this.locale
    return {
      titleTemplate: chunk => (
        locale === 'nl-NL'
        ? `${chunk} - Welkom`
        : `${chunk} - Welcome`
      )
    }
  }
}
```

## Duplicated tags after hydration with SSR

_Corresponding issue_ : [#404](https://github.com/nuxt/vue-meta/issues/404)

<alert type="info">
  
  Please read [Multiple Vue apps support](/usage/multiple-apps#ssr) as a prerequisite

</alert>

To optimize performance, VueMeta will only initialize for a Vue app when it finds a `metaInfo` property on any of the loaded components. That means if you render all your components by passing the component instance directly to the render function, Vue will only know of these components once the app gets mounted (see snippet below). And this means VueMeta is unable to find any `metaInfo` when it looks if its need to initialize in the `beforeCreate` hook and the appId will not be changed to the [ssrAppId](/api/plugin-options#ssrappid)

```js
/* this is an example of when metaInfo will only become available once the
 * app is mounted and VueMeta will not correctly initialize the SSR app
 */
const myComponent = {
  metaInfo: {
    title: 'title'
  }
}

export default App {
  name: 'myApp',
  render(h) {
    return h(myComponent)
  }
};
```

This will result in all the `metaInfo` properties of your ssr app to be rendered twice, once with [ssrAppId](/api/plugin-options#ssrappid) and once with appId `1`.

To prevent this, either make sure there is any `metaInfo` configured (on any component) when the `beforeCreate` hook runs. Alternative (but not recommended) you could set [ssrAppId](/api/plugin-options#ssrappid) to `1` as well.

