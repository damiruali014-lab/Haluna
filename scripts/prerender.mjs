// Build-time prerender of the home page so the hero (the LCP) is in the first HTML response.
// Other routes are served the untouched app shell (dist/app.html) via vercel.json, so they never
// flash home content before the client router takes over.
import { copyFileSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { pathToFileURL } from 'node:url'

const shell = readFileSync('dist/index.html', 'utf8')
copyFileSync('dist/index.html', 'dist/app.html')

const { render } = await import(pathToFileURL('dist-ssr/entry-server.js').href)
const html = await render('/')
writeFileSync('dist/index.html', shell.replace('<div id="root"></div>', `<div id="root">${html}</div>`))
rmSync('dist-ssr', { recursive: true, force: true })
console.log(`Prerendered / (${(html.length / 1024).toFixed(1)} kB of HTML)`)
