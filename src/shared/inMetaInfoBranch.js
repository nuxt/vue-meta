import { isUndefined } from './is-type'

// a component is in a metaInfo branch when itself has meta info or one of its (grand-)children has
export default function inMetaInfoBranch(vm = this) {
  return vm && !isUndefined(vm._vueMeta)
}
