import v2 from './v2'
import { v3, v3cached, v3binding } from './v3'

const metaInfo = {
  title: 'the title',
  meta: [
    { charset: 'utf-8' },
    { name: 'description', content: 'the description' },
    { name: 'og:description', content: 'the description' },
    { name: 'twitter:description', content: 'the description' },
  ],
  script: [
    { src: '/script.hs' }
  ],
  noscript: [
    { innerHTML: 'no script' }
  ]
}

const count = 10000

const suites = {
  v2,
  v3,
  v3cached,
  v3binding
}

async function run() {
  for (const suite of Object.keys(suites)) {
    const data = []
    for (let i = 0; i < count; i++) {
      data.push(JSON.parse(JSON.stringify({
        ...metaInfo,
        title: metaInfo.title + i
      })))
    }

    let s = new Date().getTime()

    for (let i = 0; i < count; i++) {
      const html = await suites[suite](data[i])
      // console.log(html)
    }

    const t = new Date().getTime() - s

    console.log(`${suite}:`, t, 'ms')
  }
}

run()
