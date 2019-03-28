<img src="vue-meta.png" alt="vue-meta"/>

::: tip We need your help
We are working on defining the RFC for Vue Meta v2.0. It will be a ground-breaking release built from the ground up.

We would like your help with this! Please visit the [Vue Meta v2.0 rfc](https://github.com/nuxt/rfcs/issues/19) and let us know your thoughts.
:::

# Introduction
`vue-meta` is a [Vue.js](https://vuejs.org) plugin that allows you to manage your app's metadata, much like [`react-helmet`](https://github.com/nfl/react-helmet) does for React. However, instead of setting your data as props passed to a proprietary component, you simply export it as part of your component's data using the `metaInfo` property.

These properties, when set on a deeply nested component, will cleverly overwrite their parent components' `metaInfo`, thereby enabling custom info for each top-level view as well as coupling metadata directly to deeply nested sub components for more maintainable code.

[Get started](/guide) or play with the [examples](https://github.com/nuxt/vue-meta/tree/master/examples)
