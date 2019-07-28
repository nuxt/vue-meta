import getMetaInfo from '../shared/getMetaInfo'
import { defaultOptions } from '../shared/constants'
import { serverSequences } from '../shared/escaping'
import { setOptions } from '../shared/options'
import generateServerInjector from './generateServerInjector'

export default function generate (options, rawInfo) {
  if (arguments.length === 1) {
    rawInfo = options
    options = defaultOptions
  }

  const metaInfo = getMetaInfo(setOptions(options), rawInfo, serverSequences)
  return generateServerInjector(options, metaInfo)
}
