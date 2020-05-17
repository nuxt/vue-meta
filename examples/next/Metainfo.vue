<script>
import { h, ref, computed, inject, Teleport } from 'vue'
import { renderMeta } from './render'

export default {
  props: {
    metainfo: {
      type: Object,
      required: true
    }
  },
  setup() {
    const mapping = inject('__vueMetaConfig')

    return {
      mapping
    }
  },
  render() {
    const targets = {}

    for (const key in this.metainfo) {
      const config = this.mapping[key] || {}

      const vnodes = renderMeta(this, key, this.metainfo[key], config)
      let target = (key !== 'base' && this.metainfo[key].target) || config.target || 'head'

      if (Array.isArray(vnodes)) {
        for (const vnode of vnodes) {
          if (vnode.__vm_target) {
            target = vnode.__vm_target
            delete vnode.__vm_target
          }

          if (!targets[target]) {
            targets[target] = []
          }

          targets[target].push(vnode)
        }
        continue
      }

      if (!targets[target]) {
        targets[target] = []
      }

      targets[target].push(vnodes)
      continue
    }
// console.log('TARGETS', targets)
    return Object.keys(targets).map(target => {
      return h(Teleport, { to: target }, targets[target])
    })
  }
}
</script>
