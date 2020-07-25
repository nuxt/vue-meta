import { MetaContext } from '../types'
import { setByObject } from './set'

export function remove (context: MetaContext) {
  setByObject(context, {})
}
