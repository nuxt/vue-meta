import { isObject } from './typeof'

// Vue $root instance has a _vueMeta object property, otherwise its a boolean true
export default function hasMetaInfo(vm = this) {
  return vm && (vm._vueMeta === true || isObject(vm._vueMeta))
}
