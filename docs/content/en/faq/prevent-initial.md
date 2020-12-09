---
title: How to prevent update on page load
description: 'Manage HTML metadata in Vue.js components with SSR support for Nuxt.js!'
position: 10
category: Faq
---

In your template call the text method of `htmlAttrs` with `true` as first argument:
```
<html {{ htmlAttrs.text(true) }}>
...
```

Or manually add the [`data-vue-meta-server-rendered`](/api/plugin-options#ssrattribute) attribute to the `<html>` tag on the server-side:

```
<html data-vue-meta-server-rendered <%= meta.htmlAttrs.text() %>>
...
```

`vue-meta` will check for this attribute whenever it attempts to update the DOM - if it exists, `vue-meta` will just remove it and perform no updates. If it does not exist, `vue-meta` will perform updates as usual.

While this may seem verbose, it _is_ intentional. Having `vue-meta` handle this for you automatically would limit interoperability with other server-side programming languages. If you use PHP to power your server, for example, you might also have metadata handled on the server already and want to prevent this extraneous update.