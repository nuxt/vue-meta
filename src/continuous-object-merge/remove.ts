import { MetaContext, PathSegments } from '../types'
import { setByObject } from './set'
import { update } from './update'

export function remove (context: MetaContext, pathSegments?: PathSegments, key?: string) {
  if (!key && (!pathSegments || !pathSegments.length)) {
    setByObject(context, {})
    return
  }

  update(context, pathSegments || [], key || '', undefined)
}
