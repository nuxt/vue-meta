import { InjectionKey } from 'vue'
import { MetainfoActive } from './types'

export const hasSymbol =
  typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol'

export const PolySymbol = (name: string) =>
  // vm = vue meta
  hasSymbol
    ? Symbol(__DEV__ ? '[vue-meta]: ' + name : name)
    : (__DEV__ ? '[vue-meta]: ' : '_vm_') + name

export const metaInfoKey = PolySymbol(
  __DEV__ ? 'metainfo' : 'mi'
) as InjectionKey<MetainfoActive>
