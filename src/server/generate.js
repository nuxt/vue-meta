import getMetaInfo from '../shared/getMetaInfo'
import { serverSequences } from '../shared/escaping'
import { setOptions } from '../shared/options'
import generateServerInjector from './generateServerInjector'

export default function generate (rawInfo, options) {
  options = setOptions(options)
  const metaInfo = getMetaInfo(options, rawInfo, serverSequences)

  const serverInjector = generateServerInjector(options, metaInfo)
  return serverInjector.injectors
}
