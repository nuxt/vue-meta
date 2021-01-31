import type { App } from 'vue'
import type { SSRContext } from '@vue/server-renderer'

// rollup doesnt like an import as it cant find the export so use require
const { renderToString } = require('@vue/server-renderer')

export async function renderToStringWithMeta (app: App): Promise<[string, SSRContext]> {
  const ctx: SSRContext = {}

  const html = await renderToString(app, ctx)

  // TODO: better way of determining whether meta was rendered with the component or not
  if (!ctx.teleports || !ctx.teleports.head) {
    const teleports = app.config.globalProperties.$metaManager.render()
    await Promise.all(teleports.map((teleport: any) => renderToString(teleport, ctx)))
  }

  const { teleports } = ctx
  for (const target in teleports) {
    if (target.endsWith('Attrs')) {
      const str = teleports[target]

      // match from first space to first >, these should be all rendered attributes
      teleports[target] = str.slice(str.indexOf(' ') + 1, str.indexOf('>'))
    }
  }

  return [html, ctx]
}
