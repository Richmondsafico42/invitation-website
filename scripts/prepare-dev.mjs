import { copyFileSync, existsSync, mkdirSync, readdirSync, statSync } from 'node:fs'
import path from 'node:path'

copyFileSync('index.source.html', 'index.html')

const fromDir = 'celebrants'
const toDir = path.join('public', 'celebrants')

if (existsSync(fromDir)) {
  if (!existsSync(toDir)) mkdirSync(toDir, { recursive: true })
  for (const entry of readdirSync(fromDir)) {
    const fromPath = path.join(fromDir, entry)
    const stat = statSync(fromPath)
    if (!stat.isFile()) continue
    if (path.extname(entry).toLowerCase() !== '.svg') continue
    copyFileSync(fromPath, path.join(toDir, entry))
  }
}
