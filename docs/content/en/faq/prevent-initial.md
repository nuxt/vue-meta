---
title: How to prevent update on page load
description: 'HTML Metadata manager for Vue.js'
position: 32
category: FAQ
---

In your template call the text method of `htmlAttrs` with `true` as first argument:
```html
<html {{ htmlAttrs.text(true) }}>
...
```

Or manually add the [`data-vue-meta-server-rendered`](/api#ssrattribute) attribute to the `<html>` tag on the server-side:

```html
<html data-vue-meta-server-rendered <%= meta.htmlAttrs.text() %>>
...
```

`vue-meta` will check for this attribute whenever it attempts to update the DOM - if it exists, `vue-meta` will just remove it and perform no updates. If it does not exist, `vue-meta` will perform updates as usual.

While this may seem verbose, it _is_ intentional. Having `vue-meta` handle this for you automatically would limit interoperability with other server-side programming languages. If you use PHP to power your server, for example, you might also have metadata handled on the server already and want to prevent this extraneous update.
