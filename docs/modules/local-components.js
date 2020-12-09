import { join } from 'path'

export default function () {
  this.nuxt.hook('components:dirs', (dirs) => {
    dirs.push({
      global: true,
      path: join(__dirname, '../components'),
      level: -10
    })
  })
}
