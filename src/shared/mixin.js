import triggerUpdate from '../client/triggerUpdate'
import { isUndefined, isFunction } from '../shared/typeof'
import { ensuredPush } from '../shared/ensure'

export default function createMixin(options) {
  // for which Vue lifecycle hooks should the metaInfo be refreshed
  const updateOnLifecycleHook = ['activated', 'deactivated', 'beforeMount']

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
            ensuredPush(this.$options, 'created', () => {
              this.$watch('$metaInfo', function () {
                triggerUpdate(this, 'watcher')
              })
            })
          }
        }

        updateOnLifecycleHook.forEach((lifecycleHook) => {
          ensuredPush(this.$options, lifecycleHook, () => triggerUpdate(this, lifecycleHook))
        })

        // force an initial refresh on page load and prevent other lifecycleHooks
        // to triggerUpdate until this initial refresh is finished
        // this is to make sure that when a page is opened in an inactive tab which
        // has throttled rAF/timers we still immeditately set the page title
        if (isUndefined(this.$root._vueMetaPaused)) {
          this.$root._vueMetaInitialized = this.$isServer

          if (!this.$root._vueMetaInitialized) {
            ensuredPush(this.$options, 'mounted', () => {
              if (!this.$root._vueMetaInitialized) {
                this.$nextTick(function () {
                  this.$root.$meta().refresh()
                  this.$root._vueMetaInitialized = true
                })
              }
            })
          }
        }

        // do not trigger refresh on the server side
        if (!this.$isServer) {
          // re-render meta data when returning from a child component to parent
          ensuredPush(this.$options, 'destroyed', () => {
            // Wait that element is hidden before refreshing meta tags (to support animations)
            const interval = setInterval(() => {
              if (this.$el && this.$el.offsetParent !== null) {
                return
              }

              clearInterval(interval)

              if (!this.$parent) {
                return
              }

              triggerUpdate(this, 'destroyed')
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
