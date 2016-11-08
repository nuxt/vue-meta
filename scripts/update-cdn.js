import { readFileSync, writeFileSync } from 'fs'
import updateSection from 'update-section'
import { name, main, version } from '../package.json'

console.log(`Updating CDN info to latest v${version} release...`)

const readmePath = './README.md'
const cdnUrl = `https://unpkg.com/${name}@${version}/${main}`
const minifiedUrl = cdnUrl.replace('.js', '.min.js')

const content = readFileSync(readmePath, 'utf-8')

const update = `
  <!-- start CDN generator - do **NOT** remove this comment -->
  **Uncompressed:**
  \`\`\`html
  <script src="${cdnUrl}"></script>
  \`\`\`

  **Minified:**
  \`\`\`html
  <script src="${minifiedUrl}"></script>
  \`\`\`
  <!-- end CDN generator - do **NOT** remove this comment -->
`.trim().replace(/ {2}/gm, '')

const updated = updateSection(
  content,
  update,
  (line) => (/<!-- start CDN generator/).test(line),
  (line) => (/<!-- end CDN generator/).test(line)
)

writeFileSync(readmePath, updated)

console.log('CDN info updated.')
