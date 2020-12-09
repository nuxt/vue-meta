---
title: Plugin Options
description: 'Manage HTML metadata in Vue.js components with SSR support for Nuxt.js!'
position: 14
category: 'Api references'
---

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

### refreshOnceOnNavigation <badge>runtime</badge>
- type `boolean`
- default `false`

When `true` then `vue-meta` will pause updates once page navigation starts and resumes updates when navigation finishes (resuming also triggers an update).
This could both be a performance improvement as a possible fix for 'flickering' when you are e.g. replacing stylesheets

<alert type="info">
  
  Its not supported to disable `refreshOnceOnNavigation` once enabled

</alert>

### debounceWait <badge>v2.3+</badge> <badge>runtime</badge>
- type `number`
- default `10`

A timeout is used to debounce updates so vue-meta won't be updating the meta info immediately, this option determines how long updates are debounced

### waitOnDestroyed <badge>v2.3+</badge> <badge>runtime</badge>
- type `boolean`
- default `true`

Once a component is destroyed, vue-meta will update the meta information to make sure any info added by the destroyed component is removed.

To support transitions, vue-meta sets an interval to wait until the DOM element has been removed before it requests a meta info update. If you set this option to `false`, the meta info update will be immediately called after `nextTick` instead