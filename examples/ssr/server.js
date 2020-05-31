import path from 'path'
import fs from 'fs-extra'
import template from 'lodash/template'
import createApp from './App'
const { renderToString } = require('@vue/server-renderer')

const templateFile = path.resolve(__dirname, 'app.template.html')
const templateContent = fs.readFileSync(templateFile, { encoding: 'utf8' })

// see: https://lodash.com/docs#template
const compiled = template(templateContent, { interpolate: /{{([\s\S]+?)}}/g })

process.server = true

export async function renderPage({ url }) {
  const { app, router } = await createApp()

  await router.push(url.substr(4))

  await router.isReady()
  /* console.log(router)
  const matchedComponents = router.getMatchedComponents()
  // no matched routes, reject with 404
  if (!matchedComponents.length) {
    return reject({ code: 404 })
  } */

  const appHtml = await renderToString(app)

  const pageHtml = compiled({
    app: appHtml,
    htmlAttrs: {
      text: () => {},
    },
    headAttrs: {
      text: () => {},
    },
    bodyAttrs: {
      text: () => {},
    },
    head: () => {},
    bodyPrepend: () => {},
    bodyAppend: () => {},
    // ...app.$meta().inject()
  })

  return pageHtml
}
