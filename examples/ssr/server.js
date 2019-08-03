import path from 'path'
import fs from 'fs-extra'
import template from 'lodash/template'
import { createRenderer } from 'vue-server-renderer'
import createApp from './App'

const renderer = createRenderer({ runInNewContext: false })

const templateFile = path.resolve(__dirname, 'app.template.html')
const templateContent = fs.readFileSync(templateFile, { encoding: 'utf8' })

// see: https://lodash.com/docs#template
const compiled = template(templateContent, { interpolate: /{{([\s\S]+?)}}/g })

process.server = true

export async function renderPage ({ url }) {
  const { app, router } = await createApp()

  router.push(url.substr(4))

  return new Promise((resolve, reject) => {
    router.onReady(async () => {
      const matchedComponents = router.getMatchedComponents()
      // no matched routes, reject with 404
      if (!matchedComponents.length) {
        return reject({ code: 404 })
      }

      const appHtml = await renderer.renderToString(app)

      const pageHtml = compiled({
        app: appHtml,
        ...app.$meta().inject()
      })

      resolve(pageHtml)
    })
  })
}
