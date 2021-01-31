import { InjectionKey } from 'vue'
import { MetaActive } from './types'

export const hasSymbol = typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol'

export const PolySymbol = (name: string) =>
  // vm = vue meta
  hasSymbol
    ? Symbol(__DEV__ ? '[vue-meta]: ' + name : name)
    : (__DEV__ ? '[vue-meta]: ' : '_vm_') + name

export const metaActiveKey = /*#__PURE__*/ PolySymbol(
  __DEV__ ? 'active_meta' : 'am'
) as InjectionKey<MetaActive>
