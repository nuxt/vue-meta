import { isUndefined, isObject } from './is-type'

// Vue $root instance has a _vueMeta object property, otherwise its a boolean true
export function hasMetaInfo(vm = this) {
  return vm && (vm._vueMeta === true || isObject(vm._vueMeta))
}

// a component is in a metaInfo branch when itself has meta info or one of its (grand-)children has
export function inMetaInfoBranch(vm = this) {
  return vm && !isUndefined(vm._vueMeta)
}
