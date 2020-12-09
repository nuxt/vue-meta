---
title: How to chain metaInfo which are depending on each other
description: 'Manage HTML metadata in Vue.js components with SSR support for Nuxt.js!'
position: 12
category: Faq
---

Since v2.1 you can add a [callback attribute](/api/special-metainfo-attributes#callback-badgev21badge) to your metaInfo properties which you can use to chain loading.

If you e.g. need to load an external script before you can implement functionality based on that external script, you can use the [callback](/api/special-metainfo-attributes#callback-badgev21badge) and [skip](/api/special-metainfo-attributes#skip--badgev21badge) attributes to implement chaining of those scripts. See the API entry of the callback attribute for an [example](/api/special-metainfo-attributes#callback-badgev21badge)


<alert type="info">

  The callback / onload event is supported on `link`, `style` and `script` metaInfo properties

</alert>