import { metaInfoOptionKeys, metaInfoAttributeKeys, defaultInfo } from '../shared/constants'
import { titleGenerator, attributeGenerator, tagGenerator } from './generators'

/**
 * Converts a meta info property to one that can be stringified on the server
 *
 * @param  {String} type - the type of data to convert
 * @param  {(String|Object|Array<Object>)} data - the data value
 * @return {Object} - the new injector
 */

export default function generateServerInjector (options, metaInfo, globalInjectOptions) {
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
        m.base.text(opts) +
        m.link.text(opts) +
        m.style.text(opts) +
        m.script.text(opts) +
        m.noscript.text(opts)
    },
    injectors: {
      head: ln => serverInjector.callInjectors({ ...globalInjectOptions, ln }),
      bodyPrepend: ln => serverInjector.callInjectors({ ...globalInjectOptions, ln, pbody: true }),
      bodyAppend: ln => serverInjector.callInjectors({ ...globalInjectOptions, ln, body: true })
    }
  }

  for (const type in defaultInfo) {
    if (metaInfoOptionKeys.includes(type)) {
      continue
    }

    serverInjector.injectors[type] = {
      text (injectOptions) {
        const addSsrAttribute = injectOptions === true

        injectOptions = {
          addSsrAttribute,
          ...globalInjectOptions,
          ...injectOptions
        }

        if (type === 'title') {
          return titleGenerator(options, type, serverInjector.data[type], injectOptions)
        }

        if (metaInfoAttributeKeys.includes(type)) {
          const attributeData = {}

          const data = serverInjector.data[type]
          if (data) {
            const appId = injectOptions.isSSR === false ? '1' : options.ssrAppId
            for (const attr in data) {
              attributeData[attr] = {
                [appId]: data[attr]
              }
            }
          }

          if (serverInjector.extraData) {
            for (const appId in serverInjector.extraData) {
              const data = serverInjector.extraData[appId][type]
              if (data) {
                for (const attr in data) {
                  attributeData[attr] = {
                    ...attributeData[attr],
                    [appId]: data[attr]
                  }
                }
              }
            }
          }

          return attributeGenerator(options, type, attributeData, injectOptions)
        }

        let str = tagGenerator(options, type, serverInjector.data[type], injectOptions)

        if (serverInjector.extraData) {
          for (const appId in serverInjector.extraData) {
            const data = serverInjector.extraData[appId][type]
            const extraStr = tagGenerator(options, type, data, { appId, ...injectOptions })
            str = `${str}${extraStr}`
          }
        }

        return str
      }
    }
  }

  return serverInjector
}
