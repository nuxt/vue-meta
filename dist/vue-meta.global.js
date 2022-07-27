/**
 * vue-meta v3.0.0-alpha.10
 * (c) 2022
 * - Pim (@pimlie)
 * - All the amazing contributors
 * @license MIT
 */

var VueMeta = (function (exports, _asyncToGenerator, _classCallCheck, _createClass, _defineProperty, _toConsumableArray, _regeneratorRuntime, vue, _typeof, _slicedToArray) {
  'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e["default"] : e; }

  var _asyncToGenerator__default = /*#__PURE__*/_interopDefaultLegacy(_asyncToGenerator);
  var _classCallCheck__default = /*#__PURE__*/_interopDefaultLegacy(_classCallCheck);
  var _createClass__default = /*#__PURE__*/_interopDefaultLegacy(_createClass);
  var _defineProperty__default = /*#__PURE__*/_interopDefaultLegacy(_defineProperty);
  var _toConsumableArray__default = /*#__PURE__*/_interopDefaultLegacy(_toConsumableArray);
  var _regeneratorRuntime__default = /*#__PURE__*/_interopDefaultLegacy(_regeneratorRuntime);
  var _typeof__default = /*#__PURE__*/_interopDefaultLegacy(_typeof);
  var _slicedToArray__default = /*#__PURE__*/_interopDefaultLegacy(_slicedToArray);

  var resolveOption = function resolveOption(predicament, initialValue) {
    return function (options, contexts) {
      var resolvedIndex = -1;
      contexts.reduce(function (acc, context, index) {
        var retval = predicament(acc, context);

        if (retval !== acc) {
          resolvedIndex = index;
          return retval;
        }

        return acc;
      }, initialValue);

      if (resolvedIndex > -1) {
        return options[resolvedIndex];
      }
    };
  };

  var setup = function setup(context) {
    var depth = 0;

    if (context.vm) {
      var vm = context.vm;

      do {
        if (vm.parent) {
          depth++;
          vm = vm.parent;
        }
      } while (vm && vm.parent && vm !== vm.root);
    }

    context.depth = depth;
  };
  var resolve = resolveOption(function (currentValue, context) {
    var depth = context.depth;

    if (!currentValue || depth > currentValue) {
      return depth;
    }

    return currentValue;
  });

  var defaultResolver = /*#__PURE__*/Object.freeze({
    __proto__: null,
    setup: setup,
    resolve: resolve
  });

  var defaultConfig = {
    body: {
      tag: 'script',
      to: 'body'
    },
    base: {
      valueAttribute: 'href'
    },
    charset: {
      tag: 'meta',
      nameless: true,
      valueAttribute: 'charset'
    },
    description: {
      tag: 'meta'
    },
    og: {
      group: true,
      namespacedAttribute: true,
      tag: 'meta',
      keyAttribute: 'property'
    },
    twitter: {
      group: true,
      namespacedAttribute: true,
      tag: 'meta'
    },
    htmlAttrs: {
      attributesFor: 'html'
    },
    headAttrs: {
      attributesFor: 'head'
    },
    bodyAttrs: {
      attributesFor: 'body'
    }
  };

  /*
   * This is a fixed config for real HTML tags
   */
  var tags = {
    title: {
      attributes: false
    },
    base: {
      contentAsAttribute: true,
      attributes: ['href', 'target']
    },
    meta: {
      contentAsAttribute: true,
      keyAttribute: 'name',
      attributes: ['content', 'name', 'http-equiv', 'charset']
    },
    link: {
      contentAsAttribute: true,
      attributes: ['href', 'crossorigin', 'rel', 'media', 'integrity', 'hreflang', 'type', 'referrerpolicy', 'sizes', 'imagesrcset', 'imagesizes', 'as', 'color']
    },
    style: {
      attributes: ['media']
    },
    script: {
      attributes: ['src', 'type', 'nomodule', 'async', 'defer', 'crossorigin', 'integrity', 'referrerpolicy']
    },
    noscript: {
      attributes: false
    }
  };

  function _createForOfIteratorHelper$5(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray$5(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

  function _unsupportedIterableToArray$5(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray$5(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$5(o, minLen); }

  function _arrayLikeToArray$5(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
  function getTagConfigItem(tagOrName, key) {
    var _iterator = _createForOfIteratorHelper$5(tagOrName),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var name = _step.value;
        var tag = tags[name];

        if (name && tag) {
          return tag[key];
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  }

  /**
   * Make a map and return a function for checking if a key
   * is in that map.
   * IMPORTANT: all calls of this function must be prefixed with
   * \/\*#\_\_PURE\_\_\*\/
   * So that rollup can tree-shake them if necessary.
   */

  Object.freeze({})
      ;
  Object.freeze([]) ;
  const isArray = Array.isArray;
  const isFunction = (val) => typeof val === 'function';
  const isString = (val) => typeof val === 'string';
  const isObject = (val) => val !== null && typeof val === 'object';
  const objectToString = Object.prototype.toString;
  const toTypeString = (value) => objectToString.call(value);
  const isPlainObject = (val) => toTypeString(val) === '[object Object]';

  // https://github.com/microsoft/TypeScript/issues/1863
  var IS_PROXY = Symbol('kIsProxy');
  var PROXY_SOURCES = Symbol('kProxySources');
  var PROXY_TARGET = Symbol('kProxyTarget');
  var RESOLVE_CONTEXT = Symbol('kResolveContext');

  function clone(v) {
    if (isArray(v)) {
      return v.map(clone);
    }

    if (isObject(v)) {
      var res = {};

      for (var key in v) {
        // never clone the context
        if (key === 'context') {
          res[key] = v[key];
        } else {
          res[key] = clone(v[key]);
        }
      }

      return res;
    }

    return v;
  }

  function _createForOfIteratorHelper$4(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray$4(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

  function _unsupportedIterableToArray$4(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray$4(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$4(o, minLen); }

  function _arrayLikeToArray$4(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

  var pluck = function pluck(collection, key, callback) {
    var plucked = [];

    var _iterator = _createForOfIteratorHelper$4(collection),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var row = _step.value;

        if (row && key in row) {
          plucked.push(row[key]);

          if (callback) {
            callback(row);
          }
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }

    return plucked;
  };

  var debugFn = function debugFn(logFn) {
    var setChildFns = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    var fn = function fn() {
      try {
        throw new Error('DEBUG');
      } catch (err) {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        logFn.apply(void 0, args.concat(['\n', err]));
      }
    };

    if (setChildFns) {
      fn.warn = debugFn(console.warn); // eslint-disable-line no-console

      fn.error = debugFn(console.error); // eslint-disable-line no-console
    }

    return fn;
  };
  debugFn(console.log, true); // eslint-disable-line no-console

  function _createForOfIteratorHelper$3(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray$3(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

  function _unsupportedIterableToArray$3(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray$3(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$3(o, minLen); }

  function _arrayLikeToArray$3(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
  var allKeys = function allKeys(source) {
    var keys = source ? Object.keys(source) : [];

    for (var _len = arguments.length, sources = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      sources[_key - 1] = arguments[_key];
    }

    if (sources) {
      var _iterator = _createForOfIteratorHelper$3(sources),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var _source = _step.value;

          if (!_source || !isObject(_source)) {
            continue;
          }

          for (var key in _source) {
            if (!keys.includes(key)) {
              keys.push(key);
            }
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    } // TODO: add check for consistent types for each key (dev only)


    return keys;
  };
  var recompute = function recompute(context) {
    var path = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    var target = arguments.length > 2 ? arguments[2] : undefined;
    var sources = arguments.length > 3 ? arguments[3] : undefined;
    var setTargetAndSources = !target && !sources;

    if (setTargetAndSources) {
      target = context.active;
      sources = context.sources;

      if (path.length) {
        var _loop = function _loop(i) {
          var seg = path[i];

          if (!target || !target[seg]) {
            {
              // eslint-disable-next-line no-console
              console.error("recompute: segment ".concat(seg, " not found on target"), path, target);
            }

            return {
              v: void 0
            };
          }

          target = target[seg];
          sources = sources.map(function (source) {
            return source[seg];
          }).filter(Boolean);
        };

        for (var i = 0; i < path.length; i++) {
          var _ret = _loop(i);

          if (_typeof__default(_ret) === "object") return _ret.v;
        }
      }
    }

    if (!target || !sources) {
      return;
    }

    var keys = allKeys.apply(void 0, _toConsumableArray__default(sources)); // Clean up properties that dont exists anymore

    var targetKeys = Object.keys(target);

    for (var _i = 0, _targetKeys = targetKeys; _i < _targetKeys.length; _i++) {
      var key = _targetKeys[_i];

      if (!keys.includes(key)) {
        delete target[key];
      }
    }

    var _iterator2 = _createForOfIteratorHelper$3(keys),
        _step2;

    try {
      var _loop2 = function _loop2() {
        var key = _step2.value;
        // This assumes consistent types usages for keys across sources
        // @ts-ignore
        var isObject = false;

        for (var _i2 = 0; _i2 < sources.length; _i2++) {
          var source = sources[_i2];

          if (source && key in source && source[key] !== undefined) {
            isObject = isPlainObject(source[key]);
            break;
          }
        }

        if (isObject) {
          if (!target[key]) {
            target[key] = {};
          }

          var _keySources = [];

          var _iterator3 = _createForOfIteratorHelper$3(sources),
              _step3;

          try {
            for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
              var _source2 = _step3.value;

              if (key in _source2) {
                // @ts-ignore
                _keySources.push(_source2[key]);
              }
            }
          } catch (err) {
            _iterator3.e(err);
          } finally {
            _iterator3.f();
          }

          recompute(context, [].concat(_toConsumableArray__default(path), [key]), target[key], _keySources);
          return "continue";
        } // Ensure the target is an array if source is an array and target is empty
        // @ts-ignore


        if (!target[key] && isArray(sources[0][key])) {
          target[key] = [];
        }

        var keyContexts = [];
        var keySources = pluck(sources, key, function (source) {
          return keyContexts.push(source[RESOLVE_CONTEXT]);
        });
        var resolved = context.resolve(keySources, keyContexts, target[key], key, path);

        if (isPlainObject(resolved)) {
          resolved = clone(resolved);
        }

        target[key] = resolved;
      };

      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var _ret2 = _loop2();

        if (_ret2 === "continue") continue;
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }
  };

  function _createForOfIteratorHelper$2(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray$2(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

  function _unsupportedIterableToArray$2(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray$2(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$2(o, minLen); }

  function _arrayLikeToArray$2(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
  var createProxy = function createProxy(context, target, resolveContext) {
    var pathSegments = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];
    var handler = createHandler(context, resolveContext, pathSegments);
    var proxy = vue.markRaw(new Proxy(target, handler));

    if (!pathSegments.length && context.sources) {
      context.sources.push(proxy);
    }

    return proxy;
  };
  var createHandler = function createHandler(context, resolveContext) {
    var pathSegments = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
    return {
      get: function get(target, key, receiver) {
        if (key === IS_PROXY) {
          return true;
        }

        if (key === PROXY_SOURCES) {
          return context.sources;
        }

        if (key === PROXY_TARGET) {
          return target;
        }

        if (key === RESOLVE_CONTEXT) {
          return resolveContext;
        }

        var value = Reflect.get(target, key, receiver);

        if (!isObject(value)) {
          return value;
        } // Also return a merge proxy for nested objects


        if (!value[IS_PROXY]) {
          var keyPath = [].concat(_toConsumableArray__default(pathSegments), [key]);
          value = createProxy(context, value, resolveContext, keyPath);
          Reflect.set(target, key, value);
        }

        return value;
      },
      set: function set(target, key, value) {
        var success = Reflect.set(target, key, value); // console.warn(success, 'PROXY SET\nkey:', key, '\nvalue:', value, '\npath:', pathSegments, '\ntarget:', isArray(target), target, '\ncontext:\n', context)

        if (success) {
          var isArrayItem = isArray(target);
          var hasArrayParent = false;
          var proxies = context.sources,
              active = context.active;
          var activeSegmentKey;
          var index = 0;

          var _iterator = _createForOfIteratorHelper$2(pathSegments),
              _step;

          try {
            for (_iterator.s(); !(_step = _iterator.n()).done;) {
              var segment = _step.value;
              proxies = pluck(proxies, segment);

              if (isArrayItem && index === pathSegments.length - 1) {
                activeSegmentKey = segment;
                break;
              }

              if (isArray(active)) {
                hasArrayParent = true;
              }

              active = active[segment];
              index++;
            }
          } catch (err) {
            _iterator.e(err);
          } finally {
            _iterator.f();
          }

          if (hasArrayParent) {
            // TODO: fix that we dont have to recompute the full merged object
            // we should only have to recompute the branch that has changed
            // but there is an issue here with supporting both arrays of strings
            // as collections (parent vs parent of parent we need to trigger the
            // update from)
            recompute(context);
            return success;
          } else if (isPlainObject(value)) {
            // if an object was assigned to this key make sure to recompute all
            // of its individual properies
            recompute(context, pathSegments);
            return success;
          }

          var keyContexts = [];
          var keySources;

          if (isArrayItem) {
            keySources = proxies;
            keyContexts = proxies.map(function (proxy) {
              return proxy[RESOLVE_CONTEXT];
            });
          } else {
            keySources = pluck(proxies, key, function (proxy) {
              return keyContexts.push(proxy[RESOLVE_CONTEXT]);
            });
          }

          var resolved = context.resolve(keySources, keyContexts, active, key, pathSegments); // Ensure to clone if value is an object, cause sources is an array of
          // the sourceProxies and not the sources so we could trigger an endless loop when
          // updating a prop on an obj as the prop on the active object refers to
          // a prop on a proxy

          if (isPlainObject(resolved)) {
            resolved = clone(resolved);
          } // console.log('SET VALUE', isArrayItem, key, '\nresolved:\n', resolved, '\nsources:\n', context.sources, '\nactive:\n', active, Object.keys(active))


          if (isArrayItem && activeSegmentKey) {
            active[activeSegmentKey] = resolved;
          } else {
            active[key] = resolved;
          }
        } //    console.log('CONTEXT.ACTIVE', context.active, '\nparent:\n', target)


        return success;
      },
      deleteProperty: function deleteProperty(target, key) {
        var success = Reflect.deleteProperty(target, key); // console.warn('PROXY DELETE\nkey:', key, '\npath:', pathSegments, '\nparent:', isArray(target), target)

        if (success) {
          var isArrayItem = isArray(target);
          var activeSegmentKey;
          var proxies = context.sources;
          var active = context.active;
          var index = 0;

          var _iterator2 = _createForOfIteratorHelper$2(pathSegments),
              _step2;

          try {
            var _loop = function _loop() {
              var segment = _step2.value;
              // @ts-ignore
              proxies = proxies.map(function (proxy) {
                return proxy && proxy[segment];
              });

              if (isArrayItem && index === pathSegments.length - 1) {
                activeSegmentKey = segment;
                return "break";
              }

              active = active[segment];
              index++;
            };

            for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
              var _ret = _loop();

              if (_ret === "break") break;
            } // Check if the key still exists in one of the sourceProxies,
            // if so resolve the new value, if not remove the key

          } catch (err) {
            _iterator2.e(err);
          } finally {
            _iterator2.f();
          }

          if (proxies.some(function (proxy) {
            return proxy && key in proxy;
          })) {
            var keyContexts = [];
            var keySources;

            if (isArrayItem) {
              keySources = proxies;
              keyContexts = proxies.map(function (proxy) {
                return proxy[RESOLVE_CONTEXT];
              });
            } else {
              keySources = pluck(proxies, key, function (proxy) {
                return keyContexts.push(proxy[RESOLVE_CONTEXT]);
              });
            }

            var resolved = context.resolve(keySources, keyContexts, active, key, pathSegments);

            if (isPlainObject(resolved)) {
              resolved = clone(resolved);
            } // console.log('SET VALUE', resolved)


            if (isArrayItem && activeSegmentKey) {
              active[activeSegmentKey] = resolved;
            } else {
              active[key] = resolved;
            }
          } else {
            delete active[key];
          }
        }

        return success;
      }
    };
  };

  var createMergedObject = function createMergedObject(resolve, active) {
    var sources = [];
    var context = {
      active: active,
      resolve: resolve,
      sources: sources
    };

    var compute = function compute() {
      return recompute(context);
    };

    return {
      context: context,
      compute: compute,
      addSource: function addSource(source, resolveContext) {
        var recompute = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
        var proxy = createProxy(context, source, resolveContext || {});

        if (recompute) {
          compute();
        }

        return proxy;
      },
      delSource: function delSource(sourceOrProxy) {
        var recompute = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
        var index = sources.findIndex(function (source) {
          return source === sourceOrProxy || source[PROXY_TARGET] === sourceOrProxy;
        });

        if (index > -1) {
          sources.splice(index, 1);

          if (recompute) {
            compute();
          }

          return true;
        }

        return false;
      }
    };
  };

  function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty__default(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

  function _createForOfIteratorHelper$1(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray$1(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

  function _unsupportedIterableToArray$1(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray$1(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$1(o, minLen); }

  function _arrayLikeToArray$1(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
  var cachedElements = {};
  function renderMeta(context, key, data, config) {
    // console.info('renderMeta', key, data, config)
    if ('attributesFor' in config) {
      return renderAttributes(context, key, data, config);
    }

    if ('group' in config) {
      return renderGroup(context, key, data, config);
    }

    return renderTag(context, key, data, config);
  }
  function renderGroup(context, key, data, config) {
    // console.info('renderGroup', key, data, config)
    if (isArray(data)) {
      {
        // eslint-disable-next-line no-console
        console.warn('Specifying an array for group properties isnt supported');
      } // config.attributes = getConfigKey([key, config.tag], 'attributes', config)


      return [];
    }

    return Object.keys(data).map(function (childKey) {
      var groupConfig = {
        group: key,
        data: data
      };

      if (config.namespaced) {
        groupConfig.tagNamespace = config.namespaced === true ? key : config.namespaced;
      } else if (config.namespacedAttribute) {
        var namespace = config.namespacedAttribute === true ? key : config.namespacedAttribute;
        groupConfig.fullName = "".concat(namespace, ":").concat(childKey);
        groupConfig.slotName = "".concat(namespace, "(").concat(childKey, ")");
      }

      return renderTag(context, key, data[childKey], config, groupConfig);
    }).filter(Boolean).flat();
  }
  function renderTag(context, key, data) {
    var config = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
    var groupConfig = arguments.length > 4 ? arguments[4] : undefined;
    // console.info('renderTag', key, data, config, groupConfig)
    var contentAttributes = ['content', 'json', 'rawContent'];

    var getTagConfig = function getTagConfig(key) {
      return getTagConfigItem([tag, config.tag], key);
    };

    if (isArray(data)) {
      return data.map(function (child) {
        return renderTag(context, key, child, config, groupConfig);
      }).filter(Boolean).flat();
    }

    var _data$tag = data.tag,
        tag = _data$tag === void 0 ? config.tag || key : _data$tag;
    var content = '';
    var hasChilds = false;
    var isRaw = false;

    if (isString(data)) {
      content = data;
    } else if (data.children && isArray(data.children)) {
      hasChilds = true;
      content = data.children.map(function (child) {
        var data = renderTag(context, key, child, config, groupConfig);

        if (isArray(data)) {
          return data.map(function (_ref) {
            var vnode = _ref.vnode;
            return vnode;
          });
        }

        return data && data.vnode;
      });
    } else {
      var i = 0;

      var _iterator = _createForOfIteratorHelper$1(contentAttributes),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var contentAttribute = _step.value;

          if (!content && data[contentAttribute]) {
            if (i === 1) {
              content = JSON.stringify(data[contentAttribute]);
            } else {
              content = data[contentAttribute];
            }

            isRaw = i > 1;
            break;
          }

          i++;
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }

    var fullName = groupConfig && groupConfig.fullName || key;
    var slotName = groupConfig && groupConfig.slotName || key;
    var attributes = data.attrs;

    if (!attributes && _typeof__default(data) === 'object') {
      attributes = _objectSpread({}, data);
      delete attributes.tag;
      delete attributes.children;
      delete attributes.to; // cleanup all content attributes

      var _iterator2 = _createForOfIteratorHelper$1(contentAttributes),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var attr = _step2.value;
          delete attributes[attr];
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
    } else if (!attributes) {
      attributes = {};
    }

    if (hasChilds) {
      content = getSlotContent(context, slotName, content, data);
    } else {
      var contentAsAttribute = !!getTagConfig('contentAsAttribute');
      var valueAttribute = config.valueAttribute;

      if (!valueAttribute && contentAsAttribute) {
        var _getTagConfig = getTagConfig('attributes'),
            _getTagConfig2 = _slicedToArray__default(_getTagConfig, 1),
            tagAttribute = _getTagConfig2[0];

        valueAttribute = isString(contentAsAttribute) ? contentAsAttribute : tagAttribute;
      }

      if (!valueAttribute) {
        content = getSlotContent(context, slotName, content, data);
      } else {
        var nameless = config.nameless;

        if (!nameless) {
          var keyAttribute = config.keyAttribute || getTagConfig('keyAttribute');

          if (keyAttribute) {
            attributes[keyAttribute] = fullName;
          }
        }

        attributes[valueAttribute] = getSlotContent(context, slotName, attributes[valueAttribute] || content, groupConfig);
        content = '';
      }
    }

    var finalTag = groupConfig && groupConfig.tagNamespace ? "".concat(groupConfig.tagNamespace, ":").concat(tag) : tag;

    if (finalTag === 'title' && !context.isSSR) {
      document.title = content;
      return;
    } // console.info('FINAL TAG', finalTag)
    // console.log('      ATTRIBUTES', attributes)
    // console.log('      CONTENT', content)
    // console.log(data, attributes, config)


    if (isRaw && content) {
      attributes.innerHTML = content;
    } // Ignore empty string content


    var vnode = vue.h(finalTag, attributes, content || undefined);
    return {
      to: data.to,
      vnode: vnode
    };
  }
  function renderAttributes(context, key, data, config) {
    // console.info('renderAttributes', key, data, config)
    var attributesFor = config.attributesFor;

    if (!attributesFor || !data) {
      return;
    }

    if (context.isSSR) {
      // render attributes in a placeholder vnode so Vue
      // will render the string for us
      return {
        to: '',
        vnode: vue.h("ssr-".concat(attributesFor), data)
      };
    }

    if (!cachedElements[attributesFor]) {
      var _Array$from = Array.from(document.querySelectorAll(attributesFor)),
          _Array$from2 = _slicedToArray__default(_Array$from, 2),
          _el = _Array$from2[0],
          el2 = _Array$from2[1];

      if (!_el) {
        // eslint-disable-next-line no-console
        console.error('Could not find element for selector', attributesFor, ', won\'t render attributes');
        return;
      }

      if (el2) {
        // eslint-disable-next-line no-console
        console.warn('Found multiple elements for selector', attributesFor);
      }

      cachedElements[attributesFor] = {
        el: _el,
        attrs: []
      };
    }

    var _cachedElements$attri = cachedElements[attributesFor],
        el = _cachedElements$attri.el,
        attrs = _cachedElements$attri.attrs;

    for (var attr in data) {
      var content = getSlotContent(context, "".concat(key, "(").concat(attr, ")"), data[attr], data);

      if (isArray(content)) {
        content = content.join(',');
      }

      el.setAttribute(attr, content || '');

      if (!attrs.includes(attr)) {
        attrs.push(attr);
      }
    }

    var attrsToRemove = attrs.filter(function (attr) {
      return !data[attr];
    });

    var _iterator3 = _createForOfIteratorHelper$1(attrsToRemove),
        _step3;

    try {
      for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
        var _attr = _step3.value;
        el.removeAttribute(_attr);
      }
    } catch (err) {
      _iterator3.e(err);
    } finally {
      _iterator3.f();
    }
  }
  function getSlotContent(_ref2, slotName, content, groupConfig) {
    var metainfo = _ref2.metainfo,
        slots = _ref2.slots;
    var slot = slots && slots[slotName];

    if (!slot || !isFunction(slot)) {
      return content;
    }

    var slotScopeProps = {
      content: content,
      metainfo: metainfo
    };

    if (groupConfig && groupConfig.group) {
      var group = groupConfig.group,
          data = groupConfig.data;
      slotScopeProps[group] = data;
    }

    var slotContent = slot(slotScopeProps);

    if (slotContent && slotContent.length) {
      var children = slotContent[0].children;
      return children ? children.toString() : '';
    }

    return content;
  }

  var hasSymbol = typeof Symbol === 'function' && _typeof__default(Symbol.toStringTag) === 'symbol';
  var PolySymbol = function PolySymbol(name) {
    return (// vm = vue meta
      hasSymbol ? Symbol('[vue-meta]: ' + name ) : ('[vue-meta]: ' ) + name
    );
  };
  var metaActiveKey = /*#__PURE__*/PolySymbol('meta_active' );

  /**
   * Apply the differences between newSource & oldSource to target
   */

  function applyDifference(target, newSource, oldSource) {
    for (var key in newSource) {
      if (!(key in oldSource)) {
        target[key] = newSource[key];
        continue;
      }

      if (isObject(target[key])) {
        applyDifference(target[key], newSource[key], oldSource[key]);
        continue;
      }

      if (newSource[key] !== oldSource[key]) {
        target[key] = newSource[key];
      }
    }

    for (var _key in oldSource) {
      if (!newSource || !(_key in newSource)) {
        delete target[_key];
      }
    }
  }

  function getCurrentManager(vm) {
    if (!vm) {
      vm = vue.getCurrentInstance() || undefined;
    }

    if (!vm) {
      return undefined;
    }

    return vm.appContext.config.globalProperties.$metaManager;
  }
  function useMeta(source, manager) {
    var vm = vue.getCurrentInstance() || undefined;

    if (!manager && vm) {
      manager = getCurrentManager(vm);
    }

    if (!manager) {
      throw new Error('No manager or current instance');
    }

    if (vue.isProxy(source)) {
      vue.watch(source, function (newSource, oldSource) {
        applyDifference(metaProxy.meta, newSource, oldSource);
      });
      source = source.value;
    }

    var metaProxy = manager.addMeta(source, vm);
    return metaProxy;
  }
  function useActiveMeta() {
    return vue.inject(metaActiveKey);
  }

  var MetainfoImpl = vue.defineComponent({
    name: 'Metainfo',
    inheritAttrs: false,
    setup: function setup(_, _ref) {
      var slots = _ref.slots;
      return function () {
        var manager = getCurrentManager();

        if (!manager) {
          return;
        }

        return manager.render({
          slots: slots
        });
      };
    }
  });
  var Metainfo = MetainfoImpl;

  function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

  function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

  function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
  var ssrAttribute = 'data-vm-ssr';
  function addVnode(isSSR, teleports, to, vnodes) {
    var _teleports$to;

    var nodes = isArray(vnodes) ? vnodes : [vnodes];

    if (!isSSR) {
      // Comments shouldnt have any use on the client as they are not reactive anyway
      nodes.forEach(function (vnode, idx) {
        if (vnode.type === vue.Comment) {
          nodes.splice(idx, 1);
        }
      }); // only add ssrAttribute's for real meta tags
    } else if (!to.endsWith('Attrs')) {
      nodes.forEach(function (vnode) {
        if (!vnode.props) {
          vnode.props = {};
        }

        vnode.props[ssrAttribute] = true;
      });
    }

    if (!teleports[to]) {
      teleports[to] = [];
    }

    (_teleports$to = teleports[to]).push.apply(_teleports$to, _toConsumableArray__default(nodes));
  }
  var createMetaManager = function createMetaManager() {
    var isSSR = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    var config = arguments.length > 1 ? arguments[1] : undefined;
    var resolver = arguments.length > 2 ? arguments[2] : undefined;
    return MetaManager.create(isSSR, config || defaultConfig, resolver || defaultResolver);
  };
  var MetaManager = /*#__PURE__*/function () {
    function MetaManager(isSSR, config, target, resolver) {
      _classCallCheck__default(this, MetaManager);

      _defineProperty__default(this, "isSSR", false);

      _defineProperty__default(this, "config", void 0);

      _defineProperty__default(this, "target", void 0);

      _defineProperty__default(this, "resolver", void 0);

      _defineProperty__default(this, "ssrCleanedUp", false);

      this.isSSR = isSSR;
      this.config = config;
      this.target = target;

      if (resolver && 'setup' in resolver && isFunction(resolver.setup)) {
        this.resolver = resolver;
      }
    }

    _createClass__default(MetaManager, [{
      key: "install",
      value: function install(app) {
        app.component('Metainfo', Metainfo);
        app.config.globalProperties.$metaManager = this;
        app.provide(metaActiveKey, this.target.context.active);
      }
    }, {
      key: "addMeta",
      value: function addMeta(metadata, vm) {
        var _this = this;

        if (!vm) {
          vm = vue.getCurrentInstance() || undefined;
        }

        var metaGuards = {
          removed: []
        };
        var resolveContext = {
          vm: vm
        };
        var resolver = this.resolver;

        if (resolver && resolver.setup) {
          resolver.setup(resolveContext);
        } // TODO: optimize initial compute (once)


        var meta = this.target.addSource(metadata, resolveContext, true);

        var onRemoved = function onRemoved(removeGuard) {
          return metaGuards.removed.push(removeGuard);
        };

        var unmount = function unmount(ignoreGuards) {
          return _this.unmount(!!ignoreGuards, meta, metaGuards, vm);
        };

        if (vm) {
          vue.onUnmounted(unmount);
        }

        return {
          meta: meta,
          onRemoved: onRemoved,
          unmount: unmount
        };
      }
    }, {
      key: "unmount",
      value: function unmount(ignoreGuards, meta, metaGuards, vm) {
        var _this2 = this;

        if (vm) {
          var $el = vm.proxy.$el; // Wait for element to be removed from DOM

          if ($el && $el.offsetParent) {
            var observer = new MutationObserver(function (records) {
              var _iterator = _createForOfIteratorHelper(records),
                  _step;

              try {
                for (_iterator.s(); !(_step = _iterator.n()).done;) {
                  var removedNodes = _step.value.removedNodes;

                  if (!removedNodes) {
                    continue;
                  }

                  removedNodes.forEach(function (el) {
                    if (el === $el && observer) {
                      observer.disconnect();
                      observer = undefined;

                      _this2.reallyUnmount(ignoreGuards, meta, metaGuards);
                    }
                  });
                }
              } catch (err) {
                _iterator.e(err);
              } finally {
                _iterator.f();
              }
            });
            observer.observe($el.parentNode, {
              childList: true
            });
            return;
          }
        }

        this.reallyUnmount(ignoreGuards, meta, metaGuards);
      }
    }, {
      key: "reallyUnmount",
      value: function () {
        var _reallyUnmount = _asyncToGenerator__default( /*#__PURE__*/_regeneratorRuntime__default.mark(function _callee(ignoreGuards, meta, metaGuards) {
          return _regeneratorRuntime__default.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  this.target.delSource(meta);

                  if (!(!ignoreGuards && metaGuards)) {
                    _context.next = 4;
                    break;
                  }

                  _context.next = 4;
                  return Promise.all(metaGuards.removed.map(function (removeGuard) {
                    return removeGuard();
                  }));

                case 4:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee, this);
        }));

        function reallyUnmount(_x, _x2, _x3) {
          return _reallyUnmount.apply(this, arguments);
        }

        return reallyUnmount;
      }()
    }, {
      key: "render",
      value: function render() {
        var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            slots = _ref.slots;

        var active = this.target.context.active; // TODO: clean this method

        var isSSR = this.isSSR; // cleanup ssr tags if not yet done

        if (!isSSR && !this.ssrCleanedUp) {
          this.ssrCleanedUp = true;

          var cleanUpSSR = function cleanUpSSR() {
            var ssrTags = document.querySelectorAll("[".concat(ssrAttribute, "]"));

            if (ssrTags && ssrTags.length) {
              ssrTags.forEach(function (el) {
                return el.parentNode && el.parentNode.removeChild(el);
              });
            }
          };

          if (document.readyState === 'loading') {
            // Listen for DOM loaded because tags in the body couldnt
            // have loaded yet once the manager does it first render
            // (preferable there should only be one meta render on hydration)
            window.addEventListener('DOMContentLoaded', cleanUpSSR, {
              once: true
            });
          } else {
            cleanUpSSR();
          }
        }

        var teleports = {};

        for (var key in active) {
          var config = this.config[key] || {};
          var renderedNodes = renderMeta({
            isSSR: isSSR,
            metainfo: active,
            slots: slots
          }, key, active[key], config);

          if (!renderedNodes) {
            continue;
          }

          if (!isArray(renderedNodes)) {
            renderedNodes = [renderedNodes];
          }

          var defaultTo = key !== 'base' && active[key].to;

          if (!defaultTo && 'to' in config) {
            defaultTo = config.to;
          }

          if (!defaultTo && 'attributesFor' in config) {
            defaultTo = key;
          }

          var _iterator2 = _createForOfIteratorHelper(renderedNodes),
              _step2;

          try {
            for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
              var _step2$value = _step2.value,
                  to = _step2$value.to,
                  vnode = _step2$value.vnode;
              addVnode(this.isSSR, teleports, to || defaultTo || 'head', vnode);
            }
          } catch (err) {
            _iterator2.e(err);
          } finally {
            _iterator2.f();
          }
        }

        if (slots) {
          for (var slotName in slots) {
            var tagName = slotName === 'default' ? 'head' : slotName; // Only teleport the contents of head/body slots

            if (tagName !== 'head' && tagName !== 'body') {
              continue;
            }

            var slot = slots[slotName];

            if (isFunction(slot)) {
              addVnode(this.isSSR, teleports, tagName, slot({
                metainfo: active
              }));
            }
          }
        }

        return Object.keys(teleports).map(function (to) {
          var teleport = teleports[to];
          return vue.h(vue.Teleport, {
            to: to
          }, teleport);
        });
      }
    }]);

    return MetaManager;
  }();

  _defineProperty__default(MetaManager, "create", function (isSSR, config, resolver) {
    var resolve = function resolve(options, contexts, active, key, pathSegments) {
      if (isFunction(resolver)) {
        return resolver(options, contexts, active, key, pathSegments);
      }

      return resolver.resolve(options, contexts, active, key, pathSegments);
    };

    var active = vue.reactive({});
    var mergedObject = createMergedObject(resolve, active); // TODO: validate resolver

    var manager = new MetaManager(isSSR, config, mergedObject, resolver);
    return manager;
  });

  var defaultOptions = {
    keyName: 'metaInfo'
  };
  var createMixin = function createMixin(options) {
    return {
      created: function created() {
        var instance = vue.getCurrentInstance();

        if (!(instance !== null && instance !== void 0 && instance.type) || !(options.keyName in instance.type)) {
          return;
        }

        var metaInfo = instance.type[options.keyName];

        if (isFunction(metaInfo)) {
          var computedMetaInfo = vue.computed(metaInfo.bind(this));
          useMeta(computedMetaInfo);
        } else {
          useMeta(metaInfo);
        }
      }
    };
  };
  var install = function install(app) {
    var _options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var options = Object.assign({}, defaultOptions, _options);
    app.mixin(createMixin(options));
  };

  exports.createMetaManager = createMetaManager;
  exports.deepestResolver = defaultResolver;
  exports.defaultConfig = defaultConfig;
  exports.getCurrentManager = getCurrentManager;
  exports.plugin = install;
  exports.resolveOption = resolveOption;
  exports.useActiveMeta = useActiveMeta;
  exports.useMeta = useMeta;

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;

})({}, _asyncToGenerator, _classCallCheck, _createClass, _defineProperty, _toConsumableArray, _regeneratorRuntime, Vue, _typeof, _slicedToArray);
