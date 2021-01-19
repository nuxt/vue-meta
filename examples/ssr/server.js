import path from 'path'
import fs from 'fs-extra'
import { createSSRApp } from 'vue'
import template from 'lodash/template'
import { renderToString } from '@vue/server-renderer'
import { App, createRouter, metaManager } from '../vue-router/main'

const templateFile = path.resolve(__dirname, 'app.template.html')
const templateContent = fs.readFileSync(templateFile, { encoding: 'utf8' })

// see: https://lodash.com/docs#template
const compiled = template(templateContent, { interpolate: /{{([\s\S]+?)}}/g })

process.server = true

export async function renderPage ({ url }) {
  console.log('renderPage', url)
  const app = createSSRApp(App)
  const router = createRouter('/ssr', true)

  app.use(router)
  // app.use(metaManager)

  console.log('renderPage', 'push')
  await router.push(url.substr(4))

  await router.isReady()
  console.log('renderPage', 'eady')
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
      text: () => {}
    },
    headAttrs: {
      text: () => {}
    },
    bodyAttrs: {
      text: () => {}
    },
    head: () => {},
    bodyPrepend: () => {},
    bodyAppend: () => {}
    // ...app.$meta().inject()
  })

  return pageHtml
}
