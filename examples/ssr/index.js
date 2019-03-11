import path from 'path'
import fs from 'fs-extra'
import template from 'lodash/template'
import { createRenderer } from 'vue-server-renderer'
import consola from 'consola'
import createApp from './server-entry'

const renderer = createRenderer()

async function createPage() {
  const templateFile = path.resolve(__dirname, 'app.template.html')
  const templateContent = await fs.readFile(templateFile, { encoding: 'utf8' })

  // see: https://lodash.com/docs#template
  const compiled = template(templateContent, { interpolate: /{{([\s\S]+?)}}/g })

  const webpackAssets = '<link rel="stylesheet" href="../global.css">'
  const serverApp = await createApp()
  const appHtml = await renderer.renderToString(serverApp)

  const pageHtml = compiled({
    app: appHtml,
    webpackAssets,
    ...serverApp.$meta().inject()
  })

  return pageHtml
}

consola.info(`Creating ssr page`)
createPage()
  .then((pageHtml) => {
    consola.info(`Done, page:`)
    consola.log(pageHtml)
  })
  .catch(e => consola.error(e))
