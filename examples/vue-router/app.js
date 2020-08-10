import {
  createApp,
  defineComponent,
  reactive,
  toRefs,
  h,
  watch
} from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { defaultConfig, createManager, useMeta, useMetainfo } from 'vue-meta'
// import About from './about.vue'

const metaUpdated = 'no'

const ChildComponent = defineComponent({
  name: 'child-component',
  props: {
    page: String
  },
  template: `
  <div>
    <h3>You're looking at the <strong>{{ page }}</strong> page</h3>
    <p>Has metaInfo been updated due to navigation? {{ metaUpdated }}</p>
  </div>
  `,
  setup (props) {
    const state = reactive({
      date: null,
      metaUpdated
    })

    const title = props.page[0].toUpperCase() + props.page.slice(1)
    console.log('ChildComponent Setup')
    /* useMeta({
      charset: 'utf16',
      title,
      description: 'Description ' + props.page,
      og: {
        title: 'Og Title ' + props.page,
      },
    }) */

    return {
      ...toRefs(state)
    }
  }
})

function view (page) {
  return {
    name: `section-${page}`,
    render () {
      return h(ChildComponent, { page })
    }
  }
}

const App = {
  setup () {
    // console.log('App', getCurrentInstance())
    const { meta } = useMeta({
      base: { href: '/vue-router', target: '_blank' },
      charset: 'utf8',
      title: 'My Title',
      description: 'The Description',
      og: {
        title: 'Og Title',
        description: 'Bla bla',
        image: [
          'https://picsum.photos/600/400/?image=80',
          'https://picsum.photos/600/400/?image=82'
        ]
      },
      twitter: {
        title: 'Twitter Title'
      },
      noscript: [
        { tag: 'link', rel: 'stylesheet', href: 'style.css' }
      ],
      otherNoscript: {
        tag: 'noscript',
        'data-test': 'hello',
        children: [
          { tag: 'link', rel: 'stylesheet', href: 'style2.css' }
        ]
      },
      body: 'body-script1.js',
      htmlAttrs: {
        amp: true,
        lang: ['en', 'nl']
      },
      bodyAttrs: {
        class: ['theme-dark']
      },
      script: [
        { src: 'head-script1.js' },
        { json: { '@context': 'http://schema.org', unsafe: '<p>hello</p>' } },
        { content: 'window.a = "<br/>"; </script><script>alert(\'asdasd\');' },
        { rawContent: 'window.b = "<br/>"; </script><script> alert(\'123321\');' },
        { src: 'body-script2.js', to: 'body' },
        { src: 'body-script3.js', to: '#put-it-here' }
      ],
      esi: {
        children: [
          {
            tag: 'choose',
            children: [
              {
                tag: 'when',
                test: '$(HTTP_COOKIE{group})=="Advanced"',
                children: [
                  {
                    tag: 'include',
                    src: 'http://www.example.com/advanced.html'
                  }
                ]
              }
            ]
          }
        ]
      }
    })

    setTimeout(() => (meta.title = 'My Updated Title'), 2000)
    setTimeout(() => (meta.htmlAttrs.amp = undefined), 2000)

    const metadata = useMetainfo()

    window.$metadata = metadata

    watch(metadata, (newValue, oldValue) => {
      console.log('UPDATE', newValue)
    })

    /* let i = 0
    const walk = (data, path = []) => {
      for (const key in data) {
        const newPath = [...path, key]
        if (typeof data[key] === 'object') {
          walk(data[key], newPath)
        } else {
          console.log(newPath.join('.'))
        }
        i++
        if (i > 50) {
          break
        }
      }
    }
    setTimeout(() => walk(metadata), 1000) */

    return {
      metadata
    }
  },
  template: `
    <metainfo>
      <template v-slot:base="{ content, metainfo }">http://nuxt.dev:3000{{ content }}</template>
      <template v-slot:title="{ content, metainfo }">{{ content }} - {{ metainfo.description }} - Hello</template>
      <template v-slot:og(title)="{ content, metainfo, og }">
        {{ content }} - {{ og.description }} - {{ metainfo.description }} - Hello Again
      </template>

      <script src="lalala1.js"></script>
      <script src="lalala2.js"></script>

      <template v-slot:head="{ metainfo }">
        <!--[if IE]>
        // -> Reactivity is not supported by Vue, all comments are ignored
        <script :src="metainfo.script[0].src" ></script>
        // -> but a static file should work
        <script src="lalala3.js" ></script>
        // -> altho Vue probably strips comments in production builds (but can be configged afaik)
        <![endif]-->
        <script :src="metainfo.script[0].src" ></script>
      </template>

      <template v-slot:body>
        <script src="lalala4.js"></script>
      </template>
    </metainfo>

    <div id="app">
      <h1>vue-router</h1>
      <router-link to="/">Home</router-link>
      <router-link to="/about">About</router-link>
      <transition name="page" mode="out-in">
        <router-view></router-view>
      </transition>
      <p>Inspect Element to see the meta info</p>
    </div>
  `
}

function decisionMaker5000000 (key, pathSegments, getOptions, getCurrentValue) {
  let theChosenOne

  const options = getOptions()

  for (const option of options) {
    if (!theChosenOne || theChosenOne.context.vm.uid < option.context.vm.uid) {
      theChosenOne = option
    }
  }

  console.log(
    key,
    getCurrentValue(),
    options.map(({ value }) => value)
  )
  console.log(theChosenOne.value)
  return theChosenOne.value
}

const metaManager = createManager({
  ...defaultConfig,
  esi: {
    group: true,
    namespaced: true,
    attributes: ['src', 'test', 'text']
  }
}, decisionMaker5000000)

/* useMeta(
  {
    og: {
      something: 'test',
    },
  },
  metaManager
) */

const router = createRouter({
  history: createWebHistory('/vue-router'),
  routes: [
    { name: 'home', path: '/', component: view('home') },
    { name: 'about', path: '/about', component: view('about') }
  ]
})

const app = createApp(App)
app.use(router)
app.use(metaManager)
app.mount('#app')

// old stuff:
/*
const { set, remove } = app.$meta().addApp('custom')

set({
  bodyAttrs: {
    class: 'custom-app'
  },
  meta: [
    { charset: 'utf=8' }
  ]
})
setTimeout(() => remove(), 3000)
*/
/*
const waitFor = time => new Promise(r => setTimeout(r, time || 1000))
const o = {
  meta: [{ a: 1 }]
}
const ob = Vue.observable(o)

const root = new Vue({
  beforeCreate() {
    this.meta = ob.meta

    this.$options.computed = this.$options.computed || {}
    this.$options.computed['$ob'] = () => {
      return { meta: this.meta }
    }
  },
  created() {
    console.log('HERE')
    this.$watch('$ob', (a, b) => {
      console.log('WATCHER', this.$ob.meta[0].a, a.meta[0].a, b.meta[0].a, diff(a, b))
    }, { deep: true })
  },
  render(h) {
    return h('div', null, 'test')
  }
})

async function main () {
  root.$mount('#app')
  console.log(root)
  await waitFor(500)

  root.meta[0].a = 2
  await waitFor(100)

  ob.meta[0].a = 3
  await waitFor(100)
}
main()
/**/
