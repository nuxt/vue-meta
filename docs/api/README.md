---
sidebar: auto
---

# API Reference

## Plugin options

### keyName
- type `string`
- default `metaInfo`

The name of the component option that contains all the information that gets converted to the various meta tags & attributes for the page

### attribute
- type `string`
- default `data-vue-meta`

The name of the attribute vue-meta arguments on elements to know which it should manage and which it should ignore.

### ssrAttribute
- type `string`
- default `data-vue-meta-server-rendered`

The name of the attribute that is aded to the `html` tag to inform `vue-meta` that the server has already generated the meta tags for the initial render

See [How to prevent update on page load](/faq/prevent-initial)

### tagIDKeyName
- type `string`
- default `vmid`

The property that tells vue-meta to overwrite (instead of append) an item in a tag list.
For example, if you have two `meta` tag list items that both have `vmid` of 'description',
then vue-meta will overwrite the shallowest one with the deepest one.

### contentKeyName
- type `string`
- default `content`

The key name for the content-holding property

### metaTemplateKeyName
- type `string`
- default `template`

The key name for possible meta templates

### refreshOnceOnNavigation
- type `boolean`
- default `false`

When `true` then vue-meta will pause updates once page navigation starts and resumes updates when navigation finishes (resuming also triggers an update).
This could both be a performance improvement as a possible fix for 'flickering' when you are e.g. replacing stylesheets

## Plugin methods

The `vue-meta` plugin injects a `$meta()` function in the Vue prototype which provides the following methods

:::tip Note
`$meta()` is a function so we only need to insert it once in the `Vue.prototype`, but still use `this` to reference the component it was called from
:::

### $meta().getOptions
- returns [`pluginOptions`](/api/#plugin-options)

Could be used by third-party libraries who wish to interact with `vue-meta`

### $meta().refresh
- returns [`metaInfo`](/api/#metaInfo-properties)

Updates the current meta info with new meta info.
Useful when updating meta info as the result of an asynchronous action that resolves after the initial render takes place.

### $meta().inject
- returns [`metaInfo`](/api/#metaInfo-properties)

:::tip SSR only
`inject` is available in the server plugin only and is not available on the client
:::

It returns a special `metaInfo` object where all keys have an object as value which contains a `text()` method for returning html code

See [Rendering with renderToString](/guide/ssr.html#simple-rendering-with-rendertostring) for an example

### $meta().pause
- arguments:
  - refresh (type `boolean`, default `false`)
- returns `resume()`

Pauses global metadata updates until either the returned resume method is called or [resume](/api/#meta-resume)

### $meta().resume
- arguments:
  - refresh (type `boolean`, default `false`)
- returns [`metaInfo`](/api/#metaInfo-properties) (optional)

Resumes metadata updates after they have been paused. If `refresh` is `true` it immediately initiates a metadata update by calling [refresh](/api/#meta-refresh)

## metaInfo properties

::: tip Note
The documentation below uses `metaInfo` in the examples, please note that this keyName is [configurable](/api/#keyname) and could be different in your case
:::

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
        'property': 'og:title',
        'content': 'Test title',
        'template': chunk => `${chunk} - My page`, //or as string template: '%s - My page',
        'vmid': 'og:title'
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

#### Add json or other raw data
::: warning
You have to disable sanitizers so the content of `innerHTML` won't be escaped. Please see [__dangerouslyDisableSanitizersByTagID](/api/#dangerouslydisablesanitizersbytagid)  for more info on related risks
:::

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
#### Special attribute: `body: true`

If you e.g. wish to force delayed execution of a script or just want the script to be included in the `<body>` of the page, add `body: true`.
Script tags with `body: true` are rendered just before `</body>`

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

::: danger
If you need to disable sanitation, please always use [__dangerouslyDisableSanitizersByTagID](/api/#dangerouslydisablesanitizers) when possible

By disabling sanitization, you are opening potential vectors for attacks such as SQL injection & Cross-Site Scripting (XSS). Be very careful to not compromise your application.
:::

By default, `vue-meta` sanitizes HTML entities in _every_ property. You can disable this behaviour on a per-property basis using `__dangerouslyDisableSantizers`. Just pass it a list of properties you want sanitization to be disabled on:

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

::: warning
By disabling sanitization, you are opening potential vectors for attacks such as SQL injection & Cross-Site Scripting (XSS). Be very careful to not compromise your application.
:::

Provides same functionality as `__dangerouslyDisableSanitizers` but you can specify which property for which `tagIDKeyName` sanitation should be disabled. It expects an object with the vmid's as key and an array with property keys as value:

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
  The updated [`metaInfo`](/api/#metaInfo-properties) object
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
      console.log('Meta info was updated!')
    }
  }
}
```

### afterNavigation
- type `Function`

A callback function which is called when `vue-meta` has updated the metadata after navigation occured.
This can be used to track page views with the updated document title etc.

Adding a `afterNavigation` callback behaves the same as when [refreshOnceOnNavigation](/api/#refreshonceonnavigation) is `true`

The callback receives the following arguments:
- **newInfo**
  - type `object`<br/>
  The updated [`metaInfo`](/api/#metaInfo-properties) object

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
