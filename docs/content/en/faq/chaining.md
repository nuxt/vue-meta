---
title: How to chain metaInfo which are depending on each other
description: 'HTML Metadata manager for Vue.js'
position: 35
category: FAQ
---

Since v2.1 you can add a [callback attribute](/api#callback) to your metaInfo properties which you can use to chain loading.

If you e.g. need to load an external script before you can implement functionality based on that external script, you can use the [callback](/api#callback) and [skip](/api#skip) attributes to implement chaining of those scripts. See the API entry of the callback attribute for an [example](/api#callback)

<alert type="info">

The callback / onload event is supported on `link`, `style` and `script` metaInfo properties

</alert>
