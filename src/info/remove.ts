import { setByObject } from './set'
import { MetaContext } from '../types'

export function remove(context: MetaContext) {
  setByObject(context, {})
}
