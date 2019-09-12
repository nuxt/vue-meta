import { metaInfoOptionKeys, metaInfoAttributeKeys, defaultInfo } from '../shared/constants'
import { titleGenerator, attributeGenerator, tagGenerator } from './generators'

/**
 * Converts a meta info property to one that can be stringified on the server
 *
 * @param  {String} type - the type of data to convert
 * @param  {(String|Object|Array<Object>)} data - the data value
 * @return {Object} - the new injector
 */

export default function generateServerInjector (options, metaInfo) {
  const serverInjector = {
    data: metaInfo,
    extraData: undefined,
    addInfo (appId, metaInfo) {
      this.extraData = this.extraData || {}
      this.extraData[appId] = metaInfo
    },
    callInjectors (opts) {
      const m = this.injectors

      // only call title for the head
      return (opts.body || opts.pbody ? '' : m.title.text(opts)) +
        m.meta.text(opts) +
        m.link.text(opts) +
        m.style.text(opts) +
        m.script.text(opts) +
        m.noscript.text(opts)
    },
    injectors: {
      head: ln => serverInjector.callInjectors({ ln }),
      bodyPrepend: ln => serverInjector.callInjectors({ ln, pbody: true }),
      bodyAppend: ln => serverInjector.callInjectors({ ln, body: true })
    }
  }

  for (const type in defaultInfo) {
    if (metaInfoOptionKeys.includes(type)) {
      continue
    }

    serverInjector.injectors[type] = {
      text (arg) {
        if (type === 'title') {
          return titleGenerator(options, type, serverInjector.data[type], arg)
        }

        if (metaInfoAttributeKeys.includes(type)) {
          let str = attributeGenerator(options, type, serverInjector.data[type], arg)

          if (serverInjector.extraData) {
            for (const appId in serverInjector.extraData) {
              const data = serverInjector.extraData[appId][type]
              const extraStr = attributeGenerator(options, type, data, arg)
              str = `${str}${extraStr}`
            }
          }

          return str
        }

        let str = tagGenerator(options, type, serverInjector.data[type], arg)

        if (serverInjector.extraData) {
          for (const appId in serverInjector.extraData) {
            const data = serverInjector.extraData[appId][type]
            const extraStr = tagGenerator(options, type, data, { appId, ...arg })
            str = `${str}${extraStr}`
          }
        }

        return str
      }
    }
  }

  return serverInjector
}
