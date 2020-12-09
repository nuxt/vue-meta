---
title: Metainfo properties
description: 'Manage HTML metadata in Vue.js components with SSR support for Nuxt.js!'
position: 16
category: 'Api references'
---

<alert type="info">

  Note
  
  The documentation below uses `metaInfo` as `keyName` in the examples, please note that this is [configurable](/api/plugin-options#keyname) and could be different in your case

</alert>

### title
- type `string`

Maps to the inner-text value of the `<title>` element.

```js
{
  metaInfo: {
    title: 'Foo Bar'
  }
}
```

```html
<title>Foo Bar</title>
```

### titleTemplate
- type `string | Function`

The value of `title` will be injected into the `%s` placeholder in `titleTemplate` before being rendered. The original title will be available on `metaInfo.titleChunk`.

```js
{
  metaInfo: {
    title: 'Foo Bar',
    titleTemplate: '%s - Baz'
  }
}
```

```html
<title>Foo Bar - Baz</title>
```

The property can also be a function:

```js
titleTemplate: (titleChunk) => {
  // If undefined or blank then we don't need the hyphen
  return titleChunk ? `${titleChunk} - Site Title` : 'Site Title';
}
```

### htmlAttrs
### headAttrs
### bodyAttrs
- type `object`

Each **key:value** maps to the equivalent **attribute:value** of the `<body>` element.

Since `v2.0` value can also be an `Array<string>`

```js
{
  metaInfo: {
    htmlAttrs: {
      lang: 'en',
      amp: true
    },
    bodyAttrs: {
      class: ['dark-mode', 'mobile']
    }
  }
}
```

```html
<html lang="en" amp>
<body class="dark-mode mobile">Foo Bar</body>
```

### base
- type `object`

Maps to a newly-created `<base>` element, where object properties map to attributes.

```js
{
  metaInfo: {
    base: { target: '_blank', href: '/' }
  }
}
```

```html
<base target="_blank" href="/">
```

### meta
- type `collection`

Each item in the array maps to a newly-created `<meta>` element, where object properties map to attributes.

```js
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
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
```

#### Content templates

Since `v1.5.0`, you can now set up meta templates that work similar to the titleTemplate:

```js
{
  metaInfo: {
    meta: [
      { charset: 'utf-8' },
      {
        property: 'og:title',
        content: 'Test title',
        // following template options are identical
        // template: '%s - My page',
        template: chunk => `${chunk} - My page`,
        vmid: 'og:title'
      }
    ]
  }
}
```

```html
<meta charset="utf-8">
<meta name="og:title" property="og:title" content="Test title - My page">
```

### link
- type `collection`


Each item in the array maps to a newly-created `<link>` element, where object properties map to attributes.

```js
{
  metaInfo: {
    link: [
      { rel: 'stylesheet', href: '/css/index.css' },
      { rel: 'favicon', href: 'favicon.ico' }
    ]
  }
}
```

```html
<link rel="stylesheet" href="/css/index.css">
<link rel="favicon" href="favicon.ico">
```

### style
- type `object`

Each item in the array maps to a newly-created `<style>` element, where object properties map to attributes.

```js
{
  metaInfo: {
    style: [
      { cssText: '.foo { color: red }', type: 'text/css' }
    ]
  }
}
```

```html
<style type="text/css">.foo { color: red }</style>
```

### script
- type `collection`

Each item in the array maps to a newly-created `<script>` element, where object properties map to attributes.

```js
{
  metaInfo: {
    script: [
      { src: 'https://cdn.jsdelivr.net/npm/vue/dist/vue.js', async: true, defer: true }
    ],
  }
}
```

```html
<script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js" async defer></script>
```

#### Add JSON data <badge>v2.1+</badge>

If you wish to use a JSON variable within a script tag (e.g. for JSON-LD), you can directly pass your variable by using the `json` property.

<alert type="info">

  When passing an array or object to the `json` property the keys and values of the variable will still be sanitized to prevent XSS

</alert>

```js
{
  metaInfo: {
    script: [{
      type: 'application/ld+json',
      json: {
        '@context': 'http://schema.org',
        unsafe: '<p>hello</p>'
      }
    }]
  }
}
```

```html
<script type="application/ld+json">
  { "@context": "http://schema.org", "unsafe": "&lt;p&gt;hello&lt;/p&gt;" }
</script>
```


#### Add other raw data

<alert type="warning">
  
  You have to disable sanitizers so the content of `innerHTML` won't be escaped. Please see [__dangerouslyDisableSanitizersByTagID](/api/metainfo-properties#__dangerouslydisablesanitizersbytagid)  for more info on related risks

</alert>

```js
{
  metaInfo: {
    script: [{
      vmid: 'ldjson-schema',
      innerHTML: '{ "@context": "http://schema.org" }',
      type: 'application/ld+json'
    }],
    __dangerouslyDisableSanitizersByTagID: {
      'ldjson-schema': ['innerHTML']
    },
  }
}
```

```html
<script type="application/ld+json">{ "@context": "http://schema.org" }</script>
```

### noscript
- type `collection`

Each item in the array maps to a newly-created `<noscript>` element, where object properties map to attributes.

```js
{
  metaInfo: {
    noscript: [
      { innerHTML: 'This website requires JavaScript.' }
    ]
  }
}
```

```html
<noscript>This website requires JavaScript.</noscript>
```

### __dangerouslyDisableSanitizers
- type `Array<string>`

<alert type="danger">
  
  If you need to disable sanitation, please always use [__dangerouslyDisableSanitizersByTagID](/api/metainfo-properties#__dangerouslydisablesanitizers) when possible

  By disabling sanitization, you are opening potential vectors for attacks such as SQL injection & Cross-Site Scripting (XSS). Be very careful to not compromise your application.

</alert>

By default, `vue-meta` sanitizes HTML entities in _every_ property. You can disable this behaviour on a per-property basis using `__dangerouslyDisableSanitizers`. Just pass it a list of properties you want sanitization to be disabled on:

```js
{
  metaInfo: {
    title: '<I will be sanitized>',
    meta: [{
      vmid: 'description',
      name: 'description',
      content: '& I will not be <sanitized>'
    }],
    __dangerouslyDisableSanitizers: ['meta']
  }
}
```

```html
<title>&lt;I will be sanitized&gt;</title>
<meta vmid="description" name="description" content="& I will not be <sanitized>">
```

### __dangerouslyDisableSanitizersByTagID
- type `object`

<alert type="warning">
  
  By disabling sanitation, you are opening potential vectors for attacks such as SQL injection & Cross-Site Scripting (XSS). Be very careful to not compromise your application.

</alert>

Provides same functionality as `__dangerouslyDisableSanitizers` but you can specify which property for which `tagIDKeyName` sanitation should be disabled. It expects an object with the vmid as key and an array with property keys as value:

```js
{
  metaInfo: {
    title: '<I will be sanitized>',
    meta: [{
      vmid: 'description',
      name: 'still-&-sanitized',
      content: '& I will not be <sanitized>'
    }],
    __dangerouslyDisableSanitizersByTagID: {
      description: ['content']
    }
  }
}
```

```html
<title>&lt;I will be sanitized&gt;</title>
<meta vmid="description" name="still-&amp;-sanitized" content="& I will not be <sanitized>">
```

### changed
- type `Function`

A callback function which is called whenever the `metaInfo` updates / changes.

The callback receives the following arguments:
- **newInfo**
  - type `object`<br/>
  The updated [`metaInfo`](/api/metainfo-properties) object
- **addedTags**
  - type `Array<HTMLElement>`<br/>
  List of elements that were added
- **removedTags**
  - type `Array<HTMLElement>`<br/>
  List of elements that were removed

```js
{
  metaInfo: {
    changed (newInfo, addedTags, removedTags) {
      console.log('Metadata was updated!')
    }
  }
}
```

### afterNavigation
- type `Function`

A callback function which is called when `vue-meta` has updated the metadata after navigation occurred.
This can be used to track page views with the updated document title etc.

Adding a `afterNavigation` callback behaves the same as when [refreshOnceOnNavigation](/api/plugin-options#refreshonceonnavigation-badgeruntimebadge) is `true`

The callback receives the following arguments:
- **newInfo**
  - type `object`<br/>
  The updated [`metaInfo`](/api/metainfo-properties) object

```js
{
  metaInfo: {
    afterNavigation(metaInfo) {
      trackPageView(document.title)
      // is the same as
      trackPageView(metaInfo.title)
    }
  }
}

```