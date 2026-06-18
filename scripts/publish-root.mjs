import { cpSync, existsSync, rmSync } from 'node:fs'
import { join } from 'node:path'

const root = '.'
const dist = 'dist'

const files = ['index.html', '.htaccess', 'favicon.svg', 'og-image.jpg']

if (!existsSync(join(dist, 'index.html'))) {
  throw new Error('Build output missing dist/index.html. Run npm run build first.')
}

for (const file of files) {
  cpSync(join(dist, file), join(root, file))
}

for (const dir of ['assets']) {
  const target = join(root, dir)
  if (existsSync(target)) rmSync(target, { recursive: true, force: true })
  cpSync(join(dist, dir), target, { recursive: true })
}
