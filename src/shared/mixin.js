import { triggerUpdate } from '../client/update'
import { isUndefined, isFunction } from '../utils/is-type'
import { ensuredPush } from '../utils/ensure'
import { hasMetaInfo } from './meta-helpers'
import { addNavGuards } from './nav-guards'
import { warn } from './log'

let appId = 1

export default function createMixin (Vue, options) {
  // for which Vue lifecycle hooks should the metaInfo be refreshed
  const updateOnLifecycleHook = ['activated', 'deactivated', 'beforeMount']

  // watch for client side component updates
  return {
    beforeCreate () {
      Object.defineProperty(this, '_hasMetaInfo', {
        configurable: true,
        get () {
          // Show deprecation warning once when devtools enabled
          if (Vue.config.devtools && !this.$root._vueMeta.hasMetaInfoDeprecationWarningShown) {
            warn('VueMeta DeprecationWarning: _hasMetaInfo has been deprecated and will be removed in a future version. Please use hasMetaInfo(vm) instead')
            this.$root._vueMeta.hasMetaInfoDeprecationWarningShown = true
          }
          return hasMetaInfo(this)
        }
      })

      // Add a marker to know if it uses metaInfo
      // _vnode is used to know that it's attached to a real component
      // useful if we use some mixin to add some meta tags (like nuxt-i18n)
      if (isUndefined(this.$options[options.keyName]) || this.$options[options.keyName] === null) {
        return
      }

      if (!this.$root._vueMeta) {
        this.$root._vueMeta = { appId }
        appId++
      }

      // to speed up updates we keep track of branches which have a component with vue-meta info defined
      // if _vueMeta = true it has info, if _vueMeta = false a child has info
      if (!this._vueMeta) {
        this._vueMeta = true

        let p = this.$parent
        while (p && p !== this.$root) {
          if (isUndefined(p._vueMeta)) {
            p._vueMeta = false
          }
          p = p.$parent
        }
      }

      // coerce function-style metaInfo to a computed prop so we can observe
      // it on creation
      if (isFunction(this.$options[options.keyName])) {
        if (!this.$options.computed) {
          this.$options.computed = {}
        }
        this.$options.computed.$metaInfo = this.$options[options.keyName]

        if (!this.$isServer) {
          // if computed $metaInfo exists, watch it for updates & trigger a refresh
          // when it changes (i.e. automatically handle async actions that affect metaInfo)
          // credit for this suggestion goes to [Sébastien Chopin](https://github.com/Atinux)
          ensuredPush(this.$options, 'created', () => {
            this.$watch('$metaInfo', () => {
              triggerUpdate(this, 'watcher')
            })
          })
        }
      }

      // force an initial refresh on page load and prevent other lifecycleHooks
      // to triggerUpdate until this initial refresh is finished
      // this is to make sure that when a page is opened in an inactive tab which
      // has throttled rAF/timers we still immediately set the page title
      if (isUndefined(this.$root._vueMeta.initialized)) {
        this.$root._vueMeta.initialized = this.$isServer

        if (!this.$root._vueMeta.initialized) {
          ensuredPush(this.$options, 'beforeMount', () => {
            // if this Vue-app was server rendered, set the appId to 'ssr'
            // only one SSR app per page is supported
            if (this.$root.$el && this.$root.$el.hasAttribute && this.$root.$el.hasAttribute('data-server-rendered')) {
              this.$root._vueMeta.appId = options.ssrAppId
            }
          })

          // we use the mounted hook here as on page load
          ensuredPush(this.$options, 'mounted', () => {
            if (!this.$root._vueMeta.initialized) {
              // used in triggerUpdate to check if a change was triggered
              // during initialization
              this.$root._vueMeta.initializing = true

              // refresh meta in nextTick so all child components have loaded
              this.$nextTick(function () {
                const { tags, metaInfo } = this.$root.$meta().refresh()

                // After ssr hydration (identifier by tags === false) check
                // if initialized was set to null in triggerUpdate. That'd mean
                // that during initilazation changes where triggered which need
                // to be applied OR a metaInfo watcher was triggered before the
                // current hook was called
                // (during initialization all changes are blocked)
                if (tags === false && this.$root._vueMeta.initialized === null) {
                  this.$nextTick(() => triggerUpdate(this, 'initializing'))
                }

                this.$root._vueMeta.initialized = true
                delete this.$root._vueMeta.initializing

                // add the navigation guards if they havent been added yet
                // they are needed for the afterNavigation callback
                if (!options.refreshOnceOnNavigation && metaInfo.afterNavigation) {
                  addNavGuards(this)
                }
              })
            }
          })

          // add the navigation guards if requested
          if (options.refreshOnceOnNavigation) {
            addNavGuards(this)
          }
        }
      }

      // do not trigger refresh on the server side
      if (this.$isServer) {
        return
      }

      // no need to add this hooks on server side
      updateOnLifecycleHook.forEach((lifecycleHook) => {
        ensuredPush(this.$options, lifecycleHook, () => triggerUpdate(this, lifecycleHook))
      })
    },
    // TODO: move back into beforeCreate when Vue issue is resolved
    destroyed () {
      // do not trigger refresh:
      // - when the component doesnt have a parent
      // - doesnt have metaInfo defined
      if (!this.$parent || !hasMetaInfo(this)) {
        return
      }

      // Wait that element is hidden before refreshing meta tags (to support animations)
      const interval = setInterval(() => {
        if (this.$el && this.$el.offsetParent !== null) {
          return
        }

        clearInterval(interval)

        triggerUpdate(this, 'destroyed')
      }, 50)
    }
  }
}
