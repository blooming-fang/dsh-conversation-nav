/**
 * Build the browser half into `lib/client.js` for the client-modules bundle
 * route. esbuild emits a CommonJS body; a banner/footer wrap it in the
 * `window.__ModuleLoader__.load({ id, factory })` handoff the web shell's
 * module table expects. `react` is left external so the factory resolves it
 * through the module-table seed; everything else is inlined.
 */
import { build } from 'esbuild'
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const id = 'dsh-conversation-nav'

const result = await build({
  entryPoints: [resolve(root, 'src/client/index.js')],
  outfile: resolve(root, 'lib/client.js'),
  bundle: true,
  format: 'cjs',
  target: 'es2020',
  platform: 'browser',
  external: ['react'],
  loader: { '.css': 'text' },
  write: false,
})

const body = result.outputFiles[0].text
const banner = `window.__ModuleLoader__.load({ id: ${JSON.stringify(id)}, factory: (require) => {\nvar module = { exports: {} }; var exports = module.exports;\n`
const footer = '\nreturn module.exports;\n} });\n'
mkdirSync(resolve(root, 'lib'), { recursive: true })
writeFileSync(resolve(root, 'lib/client.js'), banner + body + footer)