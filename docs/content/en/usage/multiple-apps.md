---
title: Multiple Vue apps support
description: 'Manage HTML metadata in Vue.js components with SSR support for Nuxt.js!'
position: 8
category: Usage
---

VueMeta includes basic support for using multiple Vue-apps which each adds their own metaInfo properties to the same html page.

To keep track of which tag has been added by which Vue app, VueMeta stores an unique `appId` in the [data-vue-meta](/api/plugin-options#attribute) attribute.

<alert type="danger">

  Currently VueMeta only supports adding tags for multiple apps.

  Adding [html](/api/metainfo-properties#htmlattrs), [head](/api/metainfo-properties#headattrs) or [body](/api/metainfo-properties#bodyattrs) attributes is **not** supported. These will always be set to the values of the last app which triggered a metaInfo update.

  Therefore it is recommended you should only set those attributes from one of your Vue apps

</alert>

## Client

On the client side the `appId` starts at `1` and is incremented by one for each subsequent Vue app

## SSR

For an SSR app which is served by a Node.js server, the appId would change for each request if we would increment it as on the client. Therefore we use the special [ssrAppId](/api/plugin-options#ssrappid) so the `appId` is constant for every request.

On hydration VueMeta will check if the Vue app was server-rendered and if so set it's appId to [ssrAppId](/api/plugin-options#ssrappid) as well.

## `vmid` support

<alert type="warning">
  
  Support for cross-app vmid's might be insufficient for real world applications.

</alert>

It is possible to use cross app [vmid](/api/plugin-options#tagidkeyname)'s with two important caveats:

- _The value of the last updated app is used_<br/>
Cross app vmid's only work on the client. This is implemented through the use of querySelectors, not by merging metaInfo objects. This means the last app which was refreshed determines the value that is used

- _There is no fallback to use the vmid of a previous app_<br/>
Given app1 and app2 both with a metaInfo property with vmid1, then when app2 removes its value for vmid1 there is no way to retrieve app1's value for vmid1 which means the element is removed
