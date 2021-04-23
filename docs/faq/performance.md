# Any performance considerations?

Short answer, no

On the client, `vue-meta` batches DOM updates using [`requestAnimationFrame`](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame). It needs to do this because it registers a Vue mixin that subscribes to the [`beforeMount`](https://vuejs.org/api/#beforeMount) lifecycle hook on all components in order to be notified that renders have occurred and data is ready. If `vue-meta` did not batch updates, the DOM metadata would be re-calculated and re-updated for every component on the page in quick-succession.

Thanks to batch updating, the update will only occur once - even if the correct metadata has already been compiled by the server. If you don't want this behaviour, see below.

:::tip Improvements since v2.0
Previous versions of vue-meta injected lifecycle hooks from the global mixin on all components on the page. Also when refreshing metadata it checked all components on the page

Since v2.0 runtime performance should be improved due to:
- the global mixin injects just a `beforeCreate` lifecycle hook, other hooks are only added for components which define `metaInfo`
- we track component branches with `vue-meta` components which means that when refreshing metadata we can skip branches without `metaInfo`

:::
