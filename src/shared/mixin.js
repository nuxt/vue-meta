import { triggerUpdate } from '../client/update'
import { isUndefined, isFunction } from '../utils/is-type'
import { find } from '../utils/array'
import { getTag } from '../utils/elements'
import { rootConfigKey } from './constants'
import { hasMetaInfo } from './meta-helpers'
import { addNavGuards } from './nav-guards'
import { warn } from './log'

let appId = 1

export default function createMixin (Vue, options) {
  // for which Vue lifecycle hooks should the metaInfo be refreshed
  const updateOnLifecycleHook = ['activated', 'deactivated', 'beforeMount']
  let wasServerRendered = false

  // watch for client side component updates
  return {
    beforeCreate () {
      const rootKey = '$root'
      const $root = this[rootKey]
      const $options = this.$options
      const devtoolsEnabled = Vue.config.devtools
      
      $root[rootConfigKey] = {}

      Object.defineProperty(this, '_hasMetaInfo', {
        configurable: true,
        get () {
          // Show deprecation warning once when devtools enabled
          if (devtoolsEnabled && !$root[rootConfigKey].deprecationWarningShown) {
            warn('VueMeta DeprecationWarning: _hasMetaInfo has been deprecated and will be removed in a future version. Please use hasMetaInfo(vm) instead')
            $root[rootConfigKey].deprecationWarningShown = true
          }
          return hasMetaInfo(this)
        }
      })

      if (this === $root) {
        $root.$once('hook:beforeMount', function () {
          wasServerRendered = this.$el && this.$el.nodeType === 1 && this.$el.hasAttribute('data-server-rendered')

          // In most cases when you have a SSR app it will be the first app thats gonna be
          // initiated, if we cant detect the data-server-rendered attribute from Vue but we
          // do see our own ssrAttribute then _assume_ the Vue app with appId 1 is the ssr app
          // attempted fix for #404 & #562, but we rly need to refactor how we pass appIds from
          // ssr to the client
          if (!wasServerRendered && $root[rootConfigKey] && $root[rootConfigKey].appId === 1) {
            const htmlTag = getTag({}, 'html')
            wasServerRendered = htmlTag && htmlTag.hasAttribute(options.ssrAttribute)
          }
        })
      }

      // Add a marker to know if it uses metaInfo
      // _vnode is used to know that it's attached to a real component
      // useful if we use some mixin to add some meta tags (like nuxt-i18n)
      if (isUndefined($options[options.keyName]) || $options[options.keyName] === null) {
        return
      }

      if (!$root[rootConfigKey]) {
        $root[rootConfigKey] = { appId }
        appId++

        if (devtoolsEnabled && $root.$options[options.keyName]) {
          // use nextTick so the children should be added to $root
          this.$nextTick(() => {
            // find the first child that lists fnOptions
            const child = find($root.$children, c => c.$vnode && c.$vnode.fnOptions)
            if (child && child.$vnode.fnOptions[options.keyName]) {
              warn(`VueMeta has detected a possible global mixin which adds a ${options.keyName} property to all Vue components on the page. This could cause severe performance issues. If possible, use $meta().addApp to add meta information instead`)
            }
          })
        }
      }

      // to speed up updates we keep track of branches which have a component with vue-meta info defined
      // if _vueMeta = true it has info, if _vueMeta = false a child has info
      if (!this[rootConfigKey]) {
        this[rootConfigKey] = true

        let parent = this.$parent
        while (parent && parent !== $root) {
          if (isUndefined(parent[rootConfigKey])) {
            parent[rootConfigKey] = false
          }
          parent = parent.$parent
        }
      }

      // coerce function-style metaInfo to a computed prop so we can observe
      // it on creation
      if (isFunction($options[options.keyName])) {
        $options.computed = $options.computed || {}
        $options.computed.$metaInfo = $options[options.keyName]

        if (!this.$isServer) {
          // if computed $metaInfo exists, watch it for updates & trigger a refresh
          // when it changes (i.e. automatically handle async actions that affect metaInfo)
          // credit for this suggestion goes to [Sébastien Chopin](https://github.com/Atinux)
          this.$on('hook:created', function () {
            this.$watch('$metaInfo', function () {
              triggerUpdate(options, this[rootKey], 'watcher')
            })
          })
        }
      }

      // force an initial refresh on page load and prevent other lifecycleHooks
      // to triggerUpdate until this initial refresh is finished
      // this is to make sure that when a page is opened in an inactive tab which
      // has throttled rAF/timers we still immediately set the page title
      if (isUndefined($root[rootConfigKey].initialized)) {
        $root[rootConfigKey].initialized = this.$isServer

        if (!$root[rootConfigKey].initialized) {
          if (!$root[rootConfigKey].initializedSsr) {
            $root[rootConfigKey].initializedSsr = true

            this.$on('hook:beforeMount', function () {
              const $root = this[rootKey]

              // if this Vue-app was server rendered, set the appId to 'ssr'
              // only one SSR app per page is supported
              if (wasServerRendered) {
                $root[rootConfigKey].appId = options.ssrAppId
              }
            })
          }

          // we use the mounted hook here as on page load
          this.$on('hook:mounted', function () {
            const $root = this[rootKey]

            if ($root[rootConfigKey].initialized) {
              return
            }

            // used in triggerUpdate to check if a change was triggered
            // during initialization
            $root[rootConfigKey].initializing = true

            // refresh meta in nextTick so all child components have loaded
            this.$nextTick(function () {
              const { tags, metaInfo } = $root.$meta().refresh()

              // After ssr hydration (identifier by tags === false) check
              // if initialized was set to null in triggerUpdate. That'd mean
              // that during initilazation changes where triggered which need
              // to be applied OR a metaInfo watcher was triggered before the
              // current hook was called
              // (during initialization all changes are blocked)
              if (tags === false && $root[rootConfigKey].initialized === null) {
                this.$nextTick(() => triggerUpdate(options, $root, 'init'))
              }

              $root[rootConfigKey].initialized = true
              delete $root[rootConfigKey].initializing

              // add the navigation guards if they havent been added yet
              // they are needed for the afterNavigation callback
              if (!options.refreshOnceOnNavigation && metaInfo.afterNavigation) {
                addNavGuards($root)
              }
            })
          })
          // add the navigation guards if requested
          if (options.refreshOnceOnNavigation) {
            addNavGuards($root)
          }
        }
      }

      this.$on('hook:destroyed', function () {
        // do not trigger refresh:
        // - when user configured to not wait for transitions on destroyed
        // - when the component doesnt have a parent
        // - doesnt have metaInfo defined
        if (!this.$parent || !hasMetaInfo(this)) {
          return
        }
        delete this._hasMetaInfo

        this.$nextTick(() => {
          if (!options.waitOnDestroyed || !this.$el || !this.$el.offsetParent) {
            triggerUpdate(options, this.$root, 'destroyed')
            return
          }

          // Wait that element is hidden before refreshing meta tags (to support animations)
          const interval = setInterval(() => {
            if (this.$el && this.$el.offsetParent !== null) {
              /* istanbul ignore next line */
              return
            }

            clearInterval(interval)

            triggerUpdate(options, this.$root, 'destroyed')
          }, 50)
        })
      })

      // do not trigger refresh on the server side
      if (this.$isServer) {
        /* istanbul ignore next */
        return
      }

      // no need to add this hooks on server side
      updateOnLifecycleHook.forEach((lifecycleHook) => {
        this.$on(`hook:${lifecycleHook}`, function () {
          triggerUpdate(options, this[rootKey], lifecycleHook)
        })
      })
    }
  }
}
