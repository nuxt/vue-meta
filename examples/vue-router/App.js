import { watch } from 'vue'
import { useMeta, useMetainfo } from 'vue-meta'

export default {
  setup () {
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
      ]
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

    if (!process.server) {
      window.$metadata = metadata
    }

    watch(metadata, (newValue) => {
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
