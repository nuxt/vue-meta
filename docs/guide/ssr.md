# Server Side Rendering

If you have an isomorphic/universal webapp, you'll likely want to render your metadata on the server side as well. Here's how.

## Add `vue-meta` to the context

You'll need to expose the results of the `$meta` method that `vue-meta` adds to the Vue instance to the bundle render context before you can begin injecting your meta information. You'll need to do this in your server entry file:

**server-entry.js:**
```js
import app from './app'

const router = app.$router
const meta = app.$meta() // here

export default (context) => {
  router.push(context.url)
  context.meta = meta // and here
  return app
}
```

## Inject metadata into page string

Probably the easiest method to wrap your head around is if your Vue server markup is rendered out as a string using `renderToString`:

**server.js:**

```js
app.get('*', (req, res) => {
  const context = { url: req.url }
  renderer.renderToString(context, (error, html) => {
    if (error) return res.send(error.stack)
    const {
      title, htmlAttrs, headAttrs, bodyAttrs, link,
      style, script, noscript, meta
    } = context.meta.inject()
    return res.send(`
      <!doctype html>
      <html data-vue-meta-server-rendered ${htmlAttrs.text()}>
        <head ${headAttrs.text()}>
          ${meta.text()}
          ${title.text()}
          ${link.text()}
          ${style.text()}
          ${script.text()}
          ${noscript.text()}
        </head>
        <body ${bodyAttrs.text()}>
          ${html}
          <script src="/assets/vendor.bundle.js"></script>
          <script src="/assets/client.bundle.js"></script>
          ${script.text({ body: true })}
        </body>
      </html>
    `)
  })
})
```

If you are using a separate template file, edit your head tag with

```html
<head>
  {{{ meta.inject().title.text() }}}
  {{{ meta.inject().meta.text() }}}
</head>
```

Notice the use of `{{{` to avoid double escaping. Be extremely cautious when you use `{{{` with [`__dangerouslyDisableSanitizersByTagID`](/api/#dangerouslydisablesanitizersbytagid).

## Inject metadata into page stream


A little more complex, but well worth it, is to instead stream your response. `vue-meta` supports streaming with no effort (on it's part :stuck_out_tongue_winking_eye:) thanks to Vue's clever `bundleRenderer` context injection:

**server.js**
```js
app.get('*', (req, res) => {
  const context = { url: req.url }
  const renderStream = renderer.renderToStream(context)
  renderStream.once('data', () => {
    const {
      title, htmlAttrs, headAttrs, bodyAttrs, link,
      style, script, noscript, meta
    } = context.meta.inject()
    res.write(`
      <!doctype html>
      <html data-vue-meta-server-rendered ${htmlAttrs.text()}>
        <head ${headAttrs.text()}>
          ${meta.text()}
          ${title.text()}
          ${link.text()}
          ${style.text()}
          ${script.text()}
          ${noscript.text()}
        </head>
        <body ${bodyAttrs.text()}>
    `)
  })
  renderStream.on('data', (chunk) => {
    res.write(chunk)
  })
  renderStream.on('end', () => {
    res.end(`
          <script src="/assets/vendor.bundle.js"></script>
          <script src="/assets/client.bundle.js"></script>
          ${script.text({ body: true })}
        </body>
      </html>
    `)
  })
  renderStream.on('error', (error) => {
    res.status(500).end(`<pre>${error.stack}</pre>`)
  })
})
```
