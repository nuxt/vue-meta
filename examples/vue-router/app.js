import {
  createApp,
  defineComponent,
  reactive,
  toRefs,
  h,
  watch
} from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { defaultConfig, createManager, useMeta, useMetainfo, resolveOption } from 'vue-meta'
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

    useMeta({
      charset: 'utf16',
      title,
      description: 'Description ' + props.page,
      og: {
        title: 'Og Title ' + props.page,
      },
    })

    return toRefs(state)
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
        // TODO 'head-script2.js',
        // TODO { json: { '@context': 'http://schema.org', unsafe: '<p>hello</p>' } },
        // TODO { content: 'window.a = "<br/>"; </script><script>alert(\'asdasd\');' },
        // TODO { rawContent: 'window.b = "<br/>"; </script><script> alert(\'123321\');' },
        { src: 'body-script2.js', to: 'body' },
        { src: 'body-script3.js', to: '#put-it-here' }
      ],
      /* esi: {
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
      },
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
      } */
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

      <!-- // TODO: Using script triggers [Vue warn]: Template compilation error: Tags with side effect (<script> and <style>) are ignored in client component templates. -->
      <component is="script">window.users = []</component>
      <component is="script" src="user-1.js"></component>
      <component is="script" src="user-2.js"></component>

      <template v-slot:head="{ metainfo }">
        <!--[if IE]>
        // -> Reactivity is not supported by Vue in comments, all comments are ignored
        <component is="script" :src="metainfo.script[0].src" ></component>
        // -> but a static file should work
        <script src="user-3.js" ></script>
        // -> altho Vue probably strips comments in production builds (but can be configged afaik)
        <![endif]-->
        <component is="script" :src="metainfo.script[0].src" ></component>
      </template>

      <template v-slot:body>
        <component is="script" src="user-4.js"></component>
      </template>
    </metainfo>

    <div id="app">
      <h1>vue-router</h1>
      <router-link to="/">Home</router-link>
      <router-link to="/about">About</router-link>

      <router-view v-slot="{ Component }">
        <transition name="page" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>

      <p>Inspect Element to see the meta info</p>
    </div>
  `
}

const decisionMaker5000000 = resolveOption((prevValue, context) => {
  const { uid = 0 } = context.vm || {}
  if (!prevValue || prevValue < uid) {
    return uid
  }
})

const metaManager = createManager({
  ...defaultConfig,
  esi: {
    group: true,
    namespaced: true,
    attributes: ['src', 'test', 'text']
  }
}, decisionMaker5000000)

useMeta(
  {
    og: {
      something: 'test',
    },
  },
  metaManager
) /**/

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
