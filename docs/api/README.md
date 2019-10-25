---
sidebar: auto
---

# API Reference

## Plugin properties

:::tip
VueMeta exports a Vue plugin as default export. This section describes the properties of that default export
:::

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

### generate <Badge text="v2.2+"/>

::: warning
This method is not available in the browser builds
:::
- arguments:
  - metaInfo
  - options (optional)
- returns `metaInfo`

This method is similar to [`$meta.inject()`](/api/#meta-inject) but works without the need for a Vue instance

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

The name of the attribute that is added to the `html` tag to inform `vue-meta` that the server has already generated the meta tags for the initial render

See [How to prevent update on page load](/faq/prevent-initial)

### ssrAppId
- type `string`
- default `ssr`

The app id for a server side rendered app. You shouldnt have to change this normally

### tagIDKeyName
- type `string`
- default `vmid`

The property that tells `vue-meta` to overwrite (instead of append) an item in a tag list.
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

### refreshOnceOnNavigation <Badge text="runtime" type="yellow" />
- type `boolean`
- default `false`

When `true` then `vue-meta` will pause updates once page navigation starts and resumes updates when navigation finishes (resuming also triggers an update).
This could both be a performance improvement as a possible fix for 'flickering' when you are e.g. replacing stylesheets

:::tip
Its not supported to disable `refreshOnceOnNavigation` once enabled
:::

### debounceWait <Badge text="v2.3+"/><Badge text="runtime" type="yellow" />
- type `number`
- default `10`

A timeout is used to debounce updates so vue-meta won't be updating the meta info immediately, this option determines how long updates are debounced

### waitOnDestroyed <Badge text="v2.3+"/><Badge text="runtime" type="yellow" />
- type `boolean`
- default `true`

Once a component is destroyed, vue-meta will update the meta information to make sure any info added by the destroyed component is removed.

To support transitions, vue-meta sets an interval to wait until the DOM element has been removed before it requests a meta info update. If you set this option to `false`, the meta info update will be immediately called after `nextTick` instead

## Plugin methods

The `vue-meta` plugin injects a `$meta()` function in the Vue prototype which provides the following methods

:::tip Note
`$meta()` is a function so we only need to insert it once in the `Vue.prototype`, but still use `this` to reference the component it was called from
:::

### $meta().getOptions
- returns [`pluginOptions`](/api/#plugin-options)

Could be used by third-party libraries who wish to interact with `vue-meta`

### $meta().setOptions <Badge text="v2.3+"/>
- arguments:
  - options (type `object`)
- returns [`pluginOptions`](/api/#plugin-options)

You can toggle some plugin options during runtime by calling this method. Only [plugin options](/api/#plugin-options) marked <Badge text="runtime" type="yellow" /> can be changed

```js
vm.$meta().setOptions({ debounceWait: 50 })
```

### $meta().addApp <Badge text="v2.3+"/>
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
- returns [`metaInfo`](/api/#metaInfo-properties)

Updates the current metadata with new metadata.
Useful when updating metadata as the result of an asynchronous action that resolves after the initial render takes place.

### $meta().inject
- returns [`metaInfo`](/api/#metaInfo-properties)

:::tip SSR only
`inject` is available in the server plugin only and is not available on the client
:::

It returns a special `metaInfo` object where all keys have an object as value which contains a `text()` method for returning html code

See [Rendering with renderToString](/guide/ssr.html#simple-rendering-with-rendertostring) for an example

#### Passing arguments to `text()`

In some cases you can pass an argument to the text method. E.g. to [automatically add the ssrAttribute on ssr](/faq/prevent-initial.html) or [render properties in the body](/api/#ssr-support)

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
The documentation below uses `metaInfo` as `keyName` in the examples, please note that this is [configurable](/api/#keyname) and could be different in your case
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

#### Add JSON data <Badge text="v2.1+"/>

If you wish to use a JSON variable within a script tag (e.g. for JSON-LD), you can directly pass your variable by using the `json` property.

::: tip
When passing an array or object to the `json` property the keys and values of the variable will still be sanitized to prevent XSS
:::

```js
{
  metaInfo: {
    script: [{
      type: 'application/ld+json'
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
By disabling sanitation, you are opening potential vectors for attacks such as SQL injection & Cross-Site Scripting (XSS). Be very careful to not compromise your application.
:::

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
      console.log('Metadata was updated!')
    }
  }
}
```

### afterNavigation
- type `Function`

A callback function which is called when `vue-meta` has updated the metadata after navigation occurred.
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

## Special metaInfo attributes

These attributes define specific features when used in a metaInfo property

### once

When adding a metaInfo property that should be added once without reactivity (thus will never be updated) you can add `once: true` to the property.

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

### skip  <Badge text="v2.1+"/>

When a metaInfo property has a `skip` attribute with truthy value it will not be rendered. This attribute helps with e.g. chaining scripts (see [callback attribute](#callback))

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

### body
### pbody  <Badge text="v2.1+"/>

::: warning
VueMeta supports the body and pbody attributes on all metaInfo properties, but its up to you or your framework to support these attributes during SSR

Using these body attributes without SSR support could result in hydration errors / re-rendering or missing tags.
:::

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

### callback <Badge text="v2.1+"/>

:::tip vmid required on SSR
When using SSR it is required to define a [`vmid`](/api/#tagidkeyname) property for the metaInfo property

The vmid is needed to resolve the corresponding callback for that element on hydration
:::

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

## SSR injection methods

Calling [`inject`](#meta-inject) will return an object on which you can call the below methods to return the corresponding template string

### head <Badge text="v2.3+"/>
- arguments
  - ln (type `boolean`, default: `false`)

This is a convenience method which will retrieve the template string which should be added to the `head`.

Elements will be printed in the same order as the menu below.

By passing `ln = true` a line break will be added after each element. This could be helpful e.g. during development to get a better overview of the tags added by vue-meta

### bodyPrepend <Badge text="v2.3+"/>
- arguments
  - ln (type `boolean`, default: `false`)

This is a convenience method which will retrieve the template string which should be prepended to the body, i.e. listed just after `<body>`.

Elements will be printed in the same order as the menu below.

### bodyAppend <Badge text="v2.3+"/>
- arguments
  - ln (type `boolean`, default: `false`)

This is a convenience method which will retrieve the template string which should be appended to the body, i.e. listed just before `</body>`.

Elements will be printed in the same order as the menu below.

### htmlAttrs.text
- arguments
  - addSsrAttribute (type: `boolean`, default: `false`)

When `addSsrAttribute: true` then the [`ssrAttribute`](#ssrattribute) will be automatically added so you dont have to do that manually

### headAttrs.text
### bodyAttrs.text

See the [SSR guide](/guide/ssr.html#inject-metadata-into-page-string) for more info on how to use this


### base.text
### meta.text
### link.text
### style.text
### script.text
### noscript.text
- arguments
  - options (type: `object`, default: `{ ln: false , body: false, pbody: false }`)

The `body` and `pbody` props can be used to support positioning of elements in your template, see [SSR Support](#ssr-support)

By passing `ln: true` a line break will be added after each element. This could be helpful e.g. during development to get a better overview of the tags added by vue-meta
