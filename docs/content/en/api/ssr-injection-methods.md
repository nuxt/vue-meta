---
title: SSR Support
description: 'Manage HTML metadata in Vue.js components with SSR support for Nuxt.js!'
position: 18
category: 'Api references'
---

## SSR injection methods

Calling [`inject`](/api/plugin-methods#metainject) will return an object on which you can call the below methods to return the corresponding template string

### head <badge>v2.3+</badge>
- arguments
  - ln (type `boolean`, default: `false`)

This is a convenience method which will retrieve the template string which should be added to the `head`.

Elements will be printed in the same order as the menu below.

By passing `ln = true` a line break will be added after each element. This could be helpful e.g. during development to get a better overview of the tags added by vue-meta

### bodyPrepend <badge>v2.3+</badge>
- arguments
  - ln (type `boolean`, default: `false`)

This is a convenience method which will retrieve the template string which should be prepended to the body, i.e. listed just after `<body>`.

Elements will be printed in the same order as the menu below.

### bodyAppend <badge>v2.3+</badge>
- arguments
  - ln (type `boolean`, default: `false`)

This is a convenience method which will retrieve the template string which should be appended to the body, i.e. listed just before `</body>`.

Elements will be printed in the same order as the menu below.

### htmlAttrs.text
- arguments
  - addSsrAttribute (type: `boolean`, default: `false`)

When `addSsrAttribute: true` then the [`ssrAttribute`](/api/plugin-options#ssrattribute) will be automatically added so you dont have to do that manually

### headAttrs.text
### bodyAttrs.text

See the [SSR guide](/guide/ssr#inject-metadata-into-page-string) for more info on how to use this


### base.text
### meta.text
### link.text
### style.text
### script.text
### noscript.text
- arguments
  - options (type: `object`, default: `{ isSSR: true, ln: false , body: false, pbody: false }`)

Set `isSSR: false` if you generate a SPA on server side and want to use the default appId `1` instead of [ssrAppId](/api/plugin-options#ssrappid)

The `body` and `pbody` props can be used to support positioning of elements in your template, see [SSR Support](/api/special-metainfo-attributes#pbody--badgev21badge)

By passing `ln: true` a line break will be added after each element. This could be helpful e.g. during development to get a better overview of the tags added by vue-meta