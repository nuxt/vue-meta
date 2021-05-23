import path from 'path'
import fs from 'fs-extra'
import { renderToString } from '@vue/server-renderer'

import { renderMetaToString } from 'vue-meta/ssr'

import template from 'lodash/template'
import { createApp } from '../vue-router/main'

const templateFile = path.resolve(__dirname, 'app.template.html')
const templateContent = fs.readFileSync(templateFile, { encoding: 'utf8' })

// see: https://lodash.com/docs#template
const compiled = template(templateContent, { interpolate: /{{([\s\S]+?)}}/g })

process.server = true

export async function renderPage ({ url }) {
  console.log('renderPage', url)

  const { app, router } = createApp('/ssr', true)
  router.push(url.slice(4))
  await router.isReady()

  const ctx = {}
  const appHtml = await renderToString(app, ctx)
  await renderMetaToString(app, ctx)

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
