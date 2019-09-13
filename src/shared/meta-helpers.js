import { isUndefined, isObject } from '../utils/is-type'
import { rootConfigKey } from './constants'

// Vue $root instance has a _vueMeta object property, otherwise its a boolean true
export function hasMetaInfo (vm = this) {
  return vm && (vm[rootConfigKey] === true || isObject(vm[rootConfigKey]))
}

// a component is in a metaInfo branch when itself has meta info or one of its (grand-)children has
export function inMetaInfoBranch (vm = this) {
  return vm && !isUndefined(vm[rootConfigKey])
}
