# How is `metaInfo` resolved?

You can define a `metaInfo` property on any component in the tree. Child components that have `metaInfo` will recursively merge their `metaInfo` into the parent context, overwriting any duplicate properties. To better illustrate, consider this component hierarchy:

```html
<parent>
  <child></child>
</parent>
```

If both `<parent>` _and_ `<child>` define a `title` property inside `metaInfo`, then the `title` that gets rendered will resolve to the `title` defined inside `<child>`.

## Concatenate metadata

When specifying an array in `metaInfo`, like in the below examples, the default behaviour is to simply concatenate the lists.

**Input:**
```js
// parent component
{
  metaInfo: {
    meta: [
      { charset: 'utf-8' },
      { name: 'description', content: 'foo' }
    ]
  }
}
// child component
{
  metaInfo: {
    meta: [
      { name: 'description', content: 'bar' }
    ]
  }
}
```

**Output:**
```html
<meta charset="utf-8">
<meta name="description" content="foo">
<meta name="description" content="bar">
```

## Unique metadata

This is not what we want, since the meta `description` needs to be unique for every page. If you want to change this behaviour such that `description` is instead replaced, then give it a `vmid`:

**Input:**
```js
// parent component
{
  metaInfo: {
    meta: [
      { charset: 'utf-8' },
      { vmid: 'description', name: 'description', content: 'foo' }
    ]
  }
}
// child component
{
  metaInfo: {
    meta: [
      { vmid: 'description', name: 'description', content: 'bar' }
    ]
  }
}
```

**Output:**
```html
<meta charset="utf-8">
<meta vmid="description" name="description" content="bar">
```

:::tip Note
Nuxt.js uses `hid` instead of the default `vmid`. See [Nuxt's HTML Head](https://nuxtjs.org/guide/views#html-head) docs for more information.
:::

While solutions like `react-helmet` manage the occurrence order and merge behaviour for you automatically, it involves a lot more code and is therefore prone to failure in some edge-cases, whereas this method is _almost_ bulletproof because of its versatility; _at the expense of one tradeoff:_ these `vmid` properties will be rendered out in the final markup (`vue-meta` uses these client-side to prevent duplicating or overriding markup). If you are serving your content gzipped, then the slight increase in HTTP payload size is negligible.
