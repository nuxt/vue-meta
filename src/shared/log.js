import { hasGlobalWindow } from '../utils/window'

const _global = hasGlobalWindow ? window : global

const console = (_global.console = _global.console || {})

export function warn (...args) {
  if (!console || !console.warn) {
    return
  }

  console.warn(...args)
}

export const showWarningNotSupported = () => warn('This vue app/component has no vue-meta configuration')
