# How to chain metaInfo which are depending on each other

Since v2.1 you can add a [callback attribute](/api/#callback-since-v2-1) to your metaInfo proerties which you can use to chain loading.

If you e.g. need to load an external script before you can implement functionality based on that external script, you can use the [callback](/api/#callback-since-v2-1) and [skip](/api/#skip-since-v2-1) attributes to implement chaining of those scripts. See the API entry of the callback attribute for an [example](/api/#callback-since-v2-1)


::: tip
The callback / onload event is supported on `link`, `style` and `script` metaInfo properties
:::
