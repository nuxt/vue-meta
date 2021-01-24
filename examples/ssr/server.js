import path from 'path'
import fs from 'fs-extra'
import { createSSRApp } from 'vue'
import { renderToStringWithMeta } from 'vue-meta'

import template from 'lodash/template'
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
  app.use(metaManager)

  await router.push(url.substr(4))

  await router.isReady()

  const [appHtml, ctx] = await renderToStringWithMeta(app)

  if (!ctx.teleports) {
    ctx.teleports = {}
  }

  const pageHtml = compiled({
    app: appHtml,
    htmlAttrs: ctx.teleports.htmlAttrs || '',
    headAttrs: ctx.teleports.headAttrs || '',
    bodyAttrs: ctx.teleports.bodyAttrs || '',
    head: ctx.teleports.head || '',
    bodyPrepend: ctx.teleports['body-prepend'] || '',
    bodyAppend: ctx.teleports.body || ''
  })

  return pageHtml
}
