---
title: Special metainfo attributes
description: 'Manage HTML metadata in Vue.js components with SSR support for Nuxt.js!'
position: 17
category: 'Api references'
---

These attributes define specific features when used in a metaInfo property

### once

When adding a metaInfo property that should be added once without reactivity (thus will never be updated) you can add `once: true` to the property.

> `once` only works reliably during SSR. When using `once` in components, you need to also use `skip` and store a skip status outside of the component scope.

```js
{
  metaInfo: {
    link: [{
      once: true,
      rel: 'stylesheet'
      href: 'style.css'
    }]
  }
}
```
or in combination with `skip`
```js
let theJsHasBeenAddedSoSkipIt = false // <-- outside the component scope

export default {
  ...
  head() {
    const skip = theJsHasBeenAddedSoSkipIt
    theJsHasBeenAddedSoSkipIt = true

    return {
      script: [
        { once: true, skip, src: '/file.js' }
      ]
    }
  }
}
```

### skip  <badge>v2.1+</badge>

When a metaInfo property has a `skip` attribute with truthy value it will not be rendered. This attribute helps with e.g. chaining scripts (see [callback attribute](/api/special-metainfo-attributes#callback-badgev21badge))

```js
{
  metaInfo: {
    script: [{
      skip: true,
      innerHTML: 'console.log("you wont see me")'
    }]
  }
}
```

### json  <badge>v2.1+</badge>

The `json` attribute in a metaInfo property allows you to render JSON content within a script tag, while still sanitizing the keys and values. For example this can be used to render JSON-LD.

```js
{
  metaInfo: {
    script: [{
      type: 'application/ld+json',
      json: {
        '@context': 'http://schema.org',
        '@type': 'Organization',
        name: 'NuxtJS'
      }
    }]
  }
}
```

### body
### pbody  <badge>v2.1+</badge>

<alert type="warning">
  
  VueMeta supports the body and pbody attributes on all metaInfo properties, but its up to you or your framework to support these attributes during SSR

  Using these body attributes without SSR support could result in hydration errors / re-rendering or missing tags.

</alert>

You can filter tags to be included in the `<body>` instead of the `<head>` to e.g. force delayed execution of a script.

Use `pbody: true` if you wish to prepend the tag to the body (so its rendered just after `<body>`) or use `body: true` to append the tag to the body (the tag is rendered just before `</body>`).

```js
{
  metaInfo: {
    script: [{
      innerHTML: 'console.log("I am in body");',
      type: 'text/javascript',
      body: true
    }]
  }
}
```

#### SSR Support

When rendering your template on SSR make sure to pass an object as first argument to the text method of the metaInfo property with either a value `body: true` or `pbody: true`
```html
<head>
  <!-- render script tags in HEAD, no argument -->
  ${script.text()}
</head>
<body>
  ${script.text({ pbody: true })}

  <div id="app"></div>

  ${script.text({ body: true })}
</body>
```

### callback <badge>v2.1+</badge>

<alert type="info">

  vmid required on SSR

  When using SSR it is required to define a [`vmid`](/api/plugin-options#tagidkeyname) property for the metaInfo property

  The vmid is needed to resolve the corresponding callback for that element on hydration

</alert>

The callback attribute should specify a function which is called once the corresponding tag has been loaded (i.e. the onload event is triggered). Use this to chain javascript if one depends on the other.

```js
{
  metaInfo() {
    return {
      script: [
        {
          vmid: 'extscript',
          src: '/my-external-script.js',
          callback: () => (this.externalLoaded = true)
        },
        {
          skip: !this.externalLoaded,
          innerHTML: `
            /* this is only added once external script has been loaded */
            /* and e.g. window.$externalVar exists */
          `
        }
      ]
    }
  },
  data() {
    return {
      externalLoaded: false
    }
  }
}
```