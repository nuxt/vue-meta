# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [3.0.0-alpha.2](https://github.com/nuxt/vue-meta/compare/v3.0.0-alpha.1...v3.0.0-alpha.2) (2021-02-28)


### Features

* add support for computed metadata ([3e1a0da](https://github.com/nuxt/vue-meta/commit/3e1a0da9e4d744f74702ae11bbe3a1bec0f0a125))

## [3.0.0-alpha.1](https://github.com/nuxt/vue-meta/compare/v3.0.0-alpha.0...v3.0.0-alpha.1) (2021-01-31)


### Features

* rollup dts ([616d6b4](https://github.com/nuxt/vue-meta/commit/616d6b4db60e5b587ce85bb5915cb963a1f1e9cd))


### Bug Fixes

* consolidate types ([45704e0](https://github.com/nuxt/vue-meta/commit/45704e0a3187b168bee43e153aedfb82f3fe1d4c))

## [3.0.0-alpha.0](https://github.com/nuxt/vue-meta/compare/v2.3.3...v3.0.0-alpha.0) (2021-01-25)

The first alpha release for vue-meta v3 supporting Vue 3, basic functionality should work but needs lots more testing. Don't use this in production. Help with squashing bugs would be appreciated.

### Quick overview of features

#### useApi

See ./examples/vue-router for a working example

```js
import { watch } from 'vue'
import { useMeta, useMetainfo } from 'vue-meta'

export default {
  setup () {
    // add meta info. The object passed into useMeta is configurable
    const { meta } = useMeta({
      title: 'My Title'
    })

    // get the currently used metainfo
    const metadata = useMetainfo()

    watch(metadata, (newValue) => {
      // metadata was updated, do something
    })
  }
}
```

#### SSR

See ./examples/ssr for a working example

```js
import { createSSRApp } from 'vue'
import { renderToStringWithMeta } from 'vue-meta'
import { App, metaManager } from './App'

export function renderPage() {
  const app = createSSRApp(App)
  app.use(metaManager)

  const [appHtml, ctx] = await renderToStringWithMeta(app)

  return `
  <html ${ctx.teleports.htmlAttrs || ''}>
    <head ${ctx.teleports.headAttrs || ''}>
     ${ctx.teleports.head || ''}
    </head>
    <body ${ctx.teleports.bodyAttrs || ''}>
      <div id="app">${appHtml}</div>
     ${ctx.teleports.body || ''}
    </body>
  </html>`
```

#### Meta Resolvers

> needs more attention + real world testing

In vue-meta v2 there was limited control on which metadata to show if you had multiple components returning the same information.

In v3 we introduce meta resolvers, these are functions that should give you full control on which data to show when multiple options exist.

See eg ./src/resolvers/deepest and ./examples/vue-router/main. The _deepest_ resolver uses the data of the component with the highest depth (from the $root component). The resolver in the vue-router example just returns the data of the newest component (highest _uid).

#### Metainfo Component

> Adding this component is currently required, but it will eventually be optional

Add a `Metainfo` component in your app to extend the used metadata using slots.

```vue
  <div class="my-layout">
    <metainfo>
      <!-- // content contains the value active value for base from `useMetainfo` -->
      <template v-slot:base="{ content, metainfo }">http://nuxt.dev:3000{{ content }}</template>
      <template v-slot:title="{ content, metainfo }">
        {{ content }} - {{ metainfo.description }} - Add the description to the title
      </template>
    </metainfo>
  </div>
```

#### Known Issues

- _Metainfo component has to be present otherwise client side updates wont work_
- _The error `Uncaught ReferenceError: body is not defined` is logged in the browser_
  Solution: Add a body slot to your metainfo component with an empty tag: `<metainfo><template v-slot:body><span/></template></metainfo>`

### Features

* add amp-boilerplate as boolean attribute (resolves: [#530](https://github.com/nuxt/vue-meta/issues/530)) ([#531](https://github.com/nuxt/vue-meta/issues/531)) ([bb45319](https://github.com/nuxt/vue-meta/commit/bb453195747058d90862d2db20d6a538ef04811f))
* add deepest resolver (wip) ([bb04dc0](https://github.com/nuxt/vue-meta/commit/bb04dc068dbcf1871bdd08eddd3bb7997b122f04))
* add poc vue-compiler ([6d25ff2](https://github.com/nuxt/vue-meta/commit/6d25ff2f372f20af682389d2a8f85eacdc3423ed))
* add support for attributes (wip) ([5eaa0ab](https://github.com/nuxt/vue-meta/commit/5eaa0ab5b63000a56e0f1d4460700cc6a10d3b79))
* continued progress ([642a62c](https://github.com/nuxt/vue-meta/commit/642a62c56126f5dfdc094282f6bc179e07f022eb))
* convert to ts (wip) ([28d3fc1](https://github.com/nuxt/vue-meta/commit/28d3fc192363b9caf0a8b25a357684e6e7ae337f))
* first work on vue v3 composition metainfo app ([5d0eb1a](https://github.com/nuxt/vue-meta/commit/5d0eb1ab60ce476ed8a97e97d4d409e74284df9b))
* implement first useApi basics ([b0edfbe](https://github.com/nuxt/vue-meta/commit/b0edfbe6bd638ae3404739ec881d6a0ef598e43c))
* improve useApi ([303eae1](https://github.com/nuxt/vue-meta/commit/303eae1603a5f15611a9d66457a56b417784da8c))
* make attributes part of the metainfo object ([5add8bf](https://github.com/nuxt/vue-meta/commit/5add8bf83f597e9576b3a4502d6d7a0f1a76014c))
* make ssr work ([9cfde5b](https://github.com/nuxt/vue-meta/commit/9cfde5b5509e7cd0899ea450801bed753ec64075))
* refactor of object merge & make vue-router example work ([e68b535](https://github.com/nuxt/vue-meta/commit/e68b53573e60969a0f616c053e58a90fe87ceee2))


### Bug Fixes

* resolving arrays (collections still wip) ([5c4ee7a](https://github.com/nuxt/vue-meta/commit/5c4ee7a54720ce54cd94217c2e663b350873f4f2))

### [2.3.3](https://github.com/nuxt/vue-meta/compare/v2.3.2...v2.3.3) (2020-02-26)


### Bug Fixes

* memory leak, use hook events (thanks [#522](https://github.com/nuxt/vue-meta/issues/522)) ([21621e1](https://github.com/nuxt/vue-meta/commit/21621e13f53f45eeef5d75c76ed01c7703ad78b9))
* support once (with skip) client side (fix [#498](https://github.com/nuxt/vue-meta/issues/498)) ([c74c645](https://github.com/nuxt/vue-meta/commit/c74c645d1881e22569a2ea7ac0c903a4f6ee2243))

### [2.3.2](https://github.com/nuxt/vue-meta/compare/v2.3.1...v2.3.2) (2020-01-12)


### Bug Fixes

* call afterNavigation after nextTick ([#478](https://github.com/nuxt/vue-meta/issues/478)) ([fa12530](https://github.com/nuxt/vue-meta/commit/fa12530b3ec450338c52dea2873f6913ee3abaf0))

### [2.3.1](https://github.com/nuxt/vue-meta/compare/v2.3.0...v2.3.1) (2019-10-09)


### Bug Fixes

* accept and pass options as second arg for generate ([2ce5177](https://github.com/nuxt/vue-meta/commit/2ce5177))
* still traverse children when metainfo doesnt return object ([#469](https://github.com/nuxt/vue-meta/issues/469)) ([35b7099](https://github.com/nuxt/vue-meta/commit/35b7099))
* try to detect global mixins adding meta info ([#467](https://github.com/nuxt/vue-meta/issues/467)) ([2231ec1](https://github.com/nuxt/vue-meta/commit/2231ec1))

## [2.3.0](https://github.com/nuxt/vue-meta/compare/v2.3.0-beta.0...v2.3.0) (2019-10-03)

## [2.3.0-beta.0](https://github.com/nuxt/vue-meta/compare/v2.2.2...v2.3.0-beta.0) (2019-09-17)


### Bug Fixes

* use computed prop (which uses caching) instead of calling the fn directly ([c344d60](https://github.com/nuxt/vue-meta/commit/c344d60))


### Features

* add option waitOnDestroyed ([f745059](https://github.com/nuxt/vue-meta/commit/f745059))
* add options debounceWait ([d43b77c](https://github.com/nuxt/vue-meta/commit/d43b77c))
* add possibility to add additional  meta info ([0ab76ee](https://github.com/nuxt/vue-meta/commit/0ab76ee))
* add support for setting attributes from multiple apps ([d9b0ab2](https://github.com/nuxt/vue-meta/commit/d9b0ab2))
* enable setting refreshOnceOnNavigation during runtime ([9d14387](https://github.com/nuxt/vue-meta/commit/9d14387))

### [2.2.2](https://github.com/nuxt/vue-meta/compare/v2.2.1...v2.2.2) (2019-08-30)


### Bug Fixes

* workaround for memoryleak in destroyed hook ([ec7b1fb](https://github.com/nuxt/vue-meta/commit/ec7b1fb))
* **types:** add "content" property to MetaPropertyEquiv and remove "name" ([#436](https://github.com/nuxt/vue-meta/issues/436)) ([4384f44](https://github.com/nuxt/vue-meta/commit/4384f44))

### [2.2.1](https://github.com/nuxt/vue-meta/compare/v2.2.0...v2.2.1) (2019-08-04)


### Bug Fixes

* dont assign to global console ([2c0c4c3](https://github.com/nuxt/vue-meta/commit/2c0c4c3))
* meta content templates ([#429](https://github.com/nuxt/vue-meta/issues/429)) ([6907f9a](https://github.com/nuxt/vue-meta/commit/6907f9a))

## [2.2.0](https://github.com/nuxt/vue-meta/compare/v2.1.1...v2.2.0) (2019-07-28)


### Features

* support generating tags directly from metaInfo object ([cb2758e](https://github.com/nuxt/vue-meta/commit/cb2758e))


### Tests

* use build/dist for e2e testing ([#421](https://github.com/nuxt/vue-meta/issues/421)) ([0bf0ceb](https://github.com/nuxt/vue-meta/commit/0bf0ceb))


### [2.1.1](https://github.com/nuxt/vue-meta/compare/v2.1.0...v2.1.1) (2019-07-26)


### Bug Fixes

* babel config for rollup ([71b2d52](https://github.com/nuxt/vue-meta/commit/71b2d52))



## [2.1.0](https://github.com/nuxt/vue-meta/compare/v2.0.5...v2.1.0) (2019-07-24)


### Bug Fixes

* also use ssrAppId for client update ([50c0509](https://github.com/nuxt/vue-meta/commit/50c0509))
* don't generate <title> tag if metaInfo.title is null or false ([#409](https://github.com/nuxt/vue-meta/issues/409)) ([39ef287](https://github.com/nuxt/vue-meta/commit/39ef287))
* dont update title on client with falsy value except empty string ([6efcdf1](https://github.com/nuxt/vue-meta/commit/6efcdf1))


### Features

* add option for prepending (no)script to body ([#410](https://github.com/nuxt/vue-meta/issues/410)) ([05163a7](https://github.com/nuxt/vue-meta/commit/05163a7))
* auto add ssrAttribute to htmlAttrs ([9cf6d32](https://github.com/nuxt/vue-meta/commit/9cf6d32))
* enable onload callbacks ([#414](https://github.com/nuxt/vue-meta/issues/414)) ([fc71e1f](https://github.com/nuxt/vue-meta/commit/fc71e1f))
* make ssr app id configurable ([b0c85e5](https://github.com/nuxt/vue-meta/commit/b0c85e5))
* support json content (without disabling sanitizers) ([#415](https://github.com/nuxt/vue-meta/issues/415)) ([51fe6ea](https://github.com/nuxt/vue-meta/commit/51fe6ea))


### Tests

* update browser config ([8c35863](https://github.com/nuxt/vue-meta/commit/8c35863))



### [2.0.5](https://github.com/nuxt/vue-meta/compare/v2.0.4...v2.0.5) (2019-07-11)


### Bug Fixes

* ensure hasAttribute exists on $root.$el ([f1511ac](https://github.com/nuxt/vue-meta/commit/f1511ac))
* only show boolean attrs with truthy value ([1d9072a](https://github.com/nuxt/vue-meta/commit/1d9072a))



### [2.0.4](https://github.com/nuxt/vue-meta/compare/v2.0.3...v2.0.4) (2019-06-22)


### Bug Fixes

* add warning for v1 boolean attribute syntax ([bfeab17](https://github.com/nuxt/vue-meta/commit/bfeab17))
* dont change title when value is undefined (fix [#396](https://github.com/nuxt/vue-meta/issues/396)) ([90f9710](https://github.com/nuxt/vue-meta/commit/90f9710))


### Tests

* enable all getMetaInfo tests again ([24d7fee](https://github.com/nuxt/vue-meta/commit/24d7fee))



### [2.0.3](https://github.com/nuxt/vue-meta/compare/v2.0.2...v2.0.3) (2019-06-11)


### Bug Fixes

* $meta can be called server side before app is initiated ([ecd725d](https://github.com/nuxt/vue-meta/commit/ecd725d))



### [2.0.2](https://github.com/nuxt/vue-meta/compare/v2.0.1...v2.0.2) (2019-06-10)


### Bug Fixes

* correctly transpile builds ([6751d24](https://github.com/nuxt/vue-meta/commit/6751d24))
* use simple polyfilled includes method ([623970d](https://github.com/nuxt/vue-meta/commit/623970d))



### [2.0.1](https://github.com/nuxt/vue-meta/compare/v2.0.0...v2.0.1) (2019-06-09)


### Bug Fixes

* allow _hasMetaInfo to be configurable ([8b7b991](https://github.com/nuxt/vue-meta/commit/8b7b991))
* prevent vue-meta plugin to be installed twice ([094fd9d](https://github.com/nuxt/vue-meta/commit/094fd9d))


### Tests

* prevent plugin install twice ([8ab63b4](https://github.com/nuxt/vue-meta/commit/8ab63b4))



## [2.0.0](https://github.com/nuxt/vue-meta/compare/v2.0.0-rc.2...v2.0.0) (2019-06-09)


### Bug Fixes

* set ssr appId in mounted hook ([2dd1697](https://github.com/nuxt/vue-meta/commit/2dd1697))
* use empty string value for boolean attributes on client side (fixes [#381](https://github.com/nuxt/vue-meta/issues/381)) ([eb4980c](https://github.com/nuxt/vue-meta/commit/eb4980c))


### Features

* **ts:** add microdata meta tag type ([#382](https://github.com/nuxt/vue-meta/issues/382)) ([11c8138](https://github.com/nuxt/vue-meta/commit/11c8138))


### Tests

* add type tests to circleci ([c6180af](https://github.com/nuxt/vue-meta/commit/c6180af))
* fix ssr hydration tests ([fc57998](https://github.com/nuxt/vue-meta/commit/fc57998))



## [2.0.0-rc.2](https://github.com/nuxt/vue-meta/compare/v2.0.0-rc.1...v2.0.0-rc.2) (2019-06-06)


### Bug Fixes

* detect and apply changes triggered before or during initialization ([#377](https://github.com/nuxt/vue-meta/issues/377)) ([34c6ad9](https://github.com/nuxt/vue-meta/commit/34c6ad9))


### Features

* add basic support for multiple apps on one page ([#373](https://github.com/nuxt/vue-meta/issues/373)) ([024e7c5](https://github.com/nuxt/vue-meta/commit/024e7c5))



# [2.0.0-rc.1](https://github.com/nuxt/vue-meta/compare/v2.0.0-rc.0...v2.0.0-rc.1) (2019-04-23)


### Bug Fixes

* move addNavGuards check to mounted hook ([e80643b](https://github.com/nuxt/vue-meta/commit/e80643b)), closes [#348](https://github.com/nuxt/vue-meta/issues/348)
* use timers instead of requestAnimationFrame ([c040de7](https://github.com/nuxt/vue-meta/commit/c040de7)), closes [#313](https://github.com/nuxt/vue-meta/issues/313)



# [2.0.0-rc.0](https://github.com/nuxt/vue-meta/compare/v1.6.0...v2.0.0-rc.0) (2019-04-20)


### Bug Fixes

* add afterNavigation type ([722786d](https://github.com/nuxt/vue-meta/commit/722786d))
* add inject stub for browser build ([02e4094](https://github.com/nuxt/vue-meta/commit/02e4094))
* add ts type for refresh once ([5935cf3](https://github.com/nuxt/vue-meta/commit/5935cf3))
* afterNavigation logic (its never set in options) ([4a8f975](https://github.com/nuxt/vue-meta/commit/4a8f975))
* also render boolean attributes correctly for tags ([66e4fb4](https://github.com/nuxt/vue-meta/commit/66e4fb4))
* another inline array to const ([78f2c46](https://github.com/nuxt/vue-meta/commit/78f2c46))
* dev env name ([502c89e](https://github.com/nuxt/vue-meta/commit/502c89e))
* dont call changed with explicit this ([5ad6711](https://github.com/nuxt/vue-meta/commit/5ad6711))
* dont inline typeof definitions ([5031acf](https://github.com/nuxt/vue-meta/commit/5031acf))
* dont updateTags when the new info is not an array ([12c7949](https://github.com/nuxt/vue-meta/commit/12c7949))
* dont use object.assign/spread ([d717dbf](https://github.com/nuxt/vue-meta/commit/d717dbf))
* fix cjs build (for now) by adding var window ([95c138e](https://github.com/nuxt/vue-meta/commit/95c138e))
* ignore cssText for coverage ([e3fd8ab](https://github.com/nuxt/vue-meta/commit/e3fd8ab))
* ignore data when its not an object (fixes: [#253](https://github.com/nuxt/vue-meta/issues/253), [#279](https://github.com/nuxt/vue-meta/issues/279), [#297](https://github.com/nuxt/vue-meta/issues/297)) ([7615f41](https://github.com/nuxt/vue-meta/commit/7615f41))
* ignore package-lock not yarn.lock ([164cd8e](https://github.com/nuxt/vue-meta/commit/164cd8e))
* implement simply array polyfills (fixes [#328](https://github.com/nuxt/vue-meta/issues/328)) ([d38f81e](https://github.com/nuxt/vue-meta/commit/d38f81e))
* move rollup config and case fix ([76632ad](https://github.com/nuxt/vue-meta/commit/76632ad))
* one less thing to review ([bf864f6](https://github.com/nuxt/vue-meta/commit/bf864f6))
* only add navguards when refreshOnceOnNav is false ([93f021b](https://github.com/nuxt/vue-meta/commit/93f021b))
* prefer filter over slice ([82ba8c0](https://github.com/nuxt/vue-meta/commit/82ba8c0))
* prefer for..in instead keys.forEach ([6741897](https://github.com/nuxt/vue-meta/commit/6741897))
* prefer includes over indexOf ([6bbcf74](https://github.com/nuxt/vue-meta/commit/6bbcf74))
* remove leaked poc dependencies ([0dada3d](https://github.com/nuxt/vue-meta/commit/0dada3d))
* remove only descriptors ([c08e461](https://github.com/nuxt/vue-meta/commit/c08e461))
* rollup paths ([bfbd181](https://github.com/nuxt/vue-meta/commit/bfbd181))
* trigger meta refresh on page load (fixes [#283](https://github.com/nuxt/vue-meta/issues/283)) ([b824a27](https://github.com/nuxt/vue-meta/commit/b824a27))
* typo ([3631526](https://github.com/nuxt/vue-meta/commit/3631526))
* use Array.from ([f9604c0](https://github.com/nuxt/vue-meta/commit/f9604c0))
* use const arrays ([288871f](https://github.com/nuxt/vue-meta/commit/288871f))
* use correct var ([1e6c5b9](https://github.com/nuxt/vue-meta/commit/1e6c5b9))
* use single object prop on ([9c80dab](https://github.com/nuxt/vue-meta/commit/9c80dab))
* use undefined as child ignore indicator ([104113a](https://github.com/nuxt/vue-meta/commit/104113a))


### Features

* add afterNavigation callback (fix: [#259](https://github.com/nuxt/vue-meta/issues/259)) ([97badf6](https://github.com/nuxt/vue-meta/commit/97badf6))
* add amp as boolean attribute (resolves: [#311](https://github.com/nuxt/vue-meta/issues/311)) ([b7ee040](https://github.com/nuxt/vue-meta/commit/b7ee040))
* add browser build without ssr code ([2862a5b](https://github.com/nuxt/vue-meta/commit/2862a5b))
* add es build ([56f0b61](https://github.com/nuxt/vue-meta/commit/56f0b61))
* add getOptions method (resolves: [#215](https://github.com/nuxt/vue-meta/issues/215)) ([31e975d](https://github.com/nuxt/vue-meta/commit/31e975d))
* add option to refresh once during navigation (possible fix for [#320](https://github.com/nuxt/vue-meta/issues/320)) ([8e21175](https://github.com/nuxt/vue-meta/commit/8e21175))
* add pause/resume methods to pause updates ([d237180](https://github.com/nuxt/vue-meta/commit/d237180))
* attr keys can have array values (resolves [#231](https://github.com/nuxt/vue-meta/issues/231)) ([01edc8c](https://github.com/nuxt/vue-meta/commit/01edc8c))
* child can indicate its content should be ignored (resolves: [#204](https://github.com/nuxt/vue-meta/issues/204)) ([22e456c](https://github.com/nuxt/vue-meta/commit/22e456c))
* child can indicate parent vmid to be removed (resolves: [#288](https://github.com/nuxt/vue-meta/issues/288)) ([915fedf](https://github.com/nuxt/vue-meta/commit/915fedf))
* export hasMetaInfo helper function ([173b31d](https://github.com/nuxt/vue-meta/commit/173b31d))
* major refactor, cleanup and jest tests ([5d64d43](https://github.com/nuxt/vue-meta/commit/5d64d43))
* **ts:** update types for v2 ([#338](https://github.com/nuxt/vue-meta/issues/338)) ([7b85ff2](https://github.com/nuxt/vue-meta/commit/7b85ff2))
* render boolean attributes correctly (previously [#317](https://github.com/nuxt/vue-meta/issues/317)) ([deea5cf](https://github.com/nuxt/vue-meta/commit/deea5cf))
* track branches which contain metaInfo components ([f2e8eb5](https://github.com/nuxt/vue-meta/commit/f2e8eb5))
* use named exports to export helper functions ([95c3b7d](https://github.com/nuxt/vue-meta/commit/95c3b7d))
