import batchUpdate from '../client/batchUpdate'
import { isUndefined, isFunction } from '../shared/typeof'

export default function createMixin(options) {
  // store an id to keep track of DOM updates
  let batchID = null

  // for which Vue lifecycle hooks should the metaInfo be refreshed
  const updateOnLifecycleHook = ['activated', 'deactivated', 'beforeMount']

  const triggerUpdate = (vm) => {
    // batch potential DOM updates to prevent extraneous re-rendering
    batchID = batchUpdate(batchID, () => vm.$meta().refresh())
  }

  // watch for client side component updates
  return {
    beforeCreate() {
      // Add a marker to know if it uses metaInfo
      // _vnode is used to know that it's attached to a real component
      // useful if we use some mixin to add some meta tags (like nuxt-i18n)
      if (!isUndefined(this.$options[options.keyName]) && this.$options[options.keyName] !== null) {
        this._hasMetaInfo = true

        // coerce function-style metaInfo to a computed prop so we can observe
        // it on creation
        if (isFunction(this.$options[options.keyName])) {
          if (isUndefined(this.$options.computed)) {
            this.$options.computed = {}
          }
          this.$options.computed.$metaInfo = this.$options[options.keyName]

          if (!this.$isServer) {
            // if computed $metaInfo exists, watch it for updates & trigger a refresh
            // when it changes (i.e. automatically handle async actions that affect metaInfo)
            // credit for this suggestion goes to [Sébastien Chopin](https://github.com/Atinux)
            this.$options.created = this.$options.created || []
            this.$options.created.push(() => {
              this.$watch('$metaInfo', () => triggerUpdate(this))
            })
          }
        }

        updateOnLifecycleHook.forEach((lifecycleHook) => {
          this.$options[lifecycleHook] = this.$options[lifecycleHook] || []
          this.$options[lifecycleHook].push(() => triggerUpdate(this))
        })

        // do not trigger refresh on the server side
        if (!this.$isServer) {
          // re-render meta data when returning from a child component to parent
          this.$options.destroyed = this.$options.destroyed || []
          this.$options.destroyed.push(() => {
            // Wait that element is hidden before refreshing meta tags (to support animations)
            const interval = setInterval(() => {
              if (this.$el && this.$el.offsetParent !== null) {
                return
              }

              clearInterval(interval)

              if (!this.$parent) {
                return
              }

              triggerUpdate(this)
            }, 50)
          })
        }
      }
    }
    /* Not yet removed
    created() {
      // if computed $metaInfo exists, watch it for updates & trigger a refresh
      // when it changes (i.e. automatically handle async actions that affect metaInfo)
      // credit for this suggestion goes to [Sébastien Chopin](https://github.com/Atinux)
      if (!this.$isServer && this.$metaInfo) {
        this.$watch('$metaInfo', () => triggerUpdate(this))
      }

    },
    activated() {
      if (this._hasMetaInfo) {
        triggerUpdate(this)
      }
    },
    deactivated() {
      if (this._hasMetaInfo) {
        triggerUpdate(this)
      }
    },
    beforeMount() {
      if (this._hasMetaInfo) {
        triggerUpdate(this)
      }
    },
    destroyed() {
      // do not trigger refresh on the server side
      if (this.$isServer) {
        return
      }

      // re-render meta data when returning from a child component to parent
      if (this._hasMetaInfo) {
        // Wait that element is hidden before refreshing meta tags (to support animations)
        const interval = setInterval(() => {
          if (this.$el && this.$el.offsetParent !== null) {
            return
          }

          clearInterval(interval)

          if (!this.$parent) {
            return
          }

          triggerUpdate(this)
        }, 50)
      }
    }/**/
  }
}
