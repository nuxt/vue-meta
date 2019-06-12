import { defaultOptions as options } from '../src/shared/constants'
import generateServerInjector from '../src/server/generateServerInjector'

export default function v2(metaInfo) {
  // generate server injectors
  for (const key in metaInfo) {
    if (metaInfo.hasOwnProperty(key)) {
      metaInfo[key] = generateServerInjector('ssr', options, key, metaInfo[key])
    }
  }

  let text = ''
  for (const key in metaInfo) {
    text += metaInfo[key].text()
  }

  return `<head>${text}</head>`
}

