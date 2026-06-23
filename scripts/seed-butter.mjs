#!/usr/bin/env node
/**
 * Seed your own ButterCMS account with the Launchpad content.
 *
 * What it does:
 *   1. Reads src/content/knowledge-base.json
 *   2. Writes butter-import.json shaped for a ButterCMS "domains" Collection
 *      (so you can import it manually or eyeball the field structure).
 *   3. If BUTTER_WRITE_TOKEN is set, it attempts to push each domain to the
 *      ButterCMS Write API (experimental — confirm your plan supports it).
 *
 * ButterCMS modelling:
 *   - Collection key:  domains   (fields mirror src/content/knowledge-base.json domains[])
 *   - Page slug:       start-here (fields mirror the `guide` object)
 *
 * Usage:
 *   node scripts/seed-butter.mjs                 # just writes butter-import.json
 *   BUTTER_WRITE_TOKEN=xxxx node scripts/seed-butter.mjs   # also tries the Write API
 *
 * Docs: https://buttercms.com/docs/api/ (Write API)
 */
import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

const kb = JSON.parse(await readFile(join(root, 'src/content/knowledge-base.json'), 'utf8'))
const token = process.env.BUTTER_WRITE_TOKEN || ''

const payload = {
  collection: {
    key: 'domains',
    items: kb.domains.map((d) => ({
      slug: d.slug,
      name: d.name,
      cluster: d.cluster,
      icon: d.icon,
      tagline: d.tagline,
      // Rich fields are stored as JSON strings so they fit any Butter field type.
      data_json: JSON.stringify(d),
    })),
  },
  page: {
    slug: 'start-here',
    page_type: 'guide',
    fields: kb.guide,
  },
}

await writeFile(join(root, 'butter-import.json'), JSON.stringify(payload, null, 2))
console.log(`Wrote butter-import.json (${kb.domains.length} domains).`)

if (!token) {
  console.log('\nNo BUTTER_WRITE_TOKEN set — skipping the live push.')
  console.log('Set BUTTER_WRITE_TOKEN and re-run to attempt the ButterCMS Write API.')
  process.exit(0)
}

// --- Experimental Write API push ---
// The exact endpoint/shape can vary by ButterCMS plan; this is a best-effort helper.
const API = 'https://api.buttercms.com/v2/content/'
let ok = 0
for (const item of payload.collection.items) {
  try {
    const res = await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Token ${token}` },
      body: JSON.stringify({ key: 'domains', status: 'published', fields: [item] }),
    })
    if (res.ok) ok++
    else console.warn(`  ! ${item.slug}: HTTP ${res.status} ${await res.text()}`)
  } catch (e) {
    console.warn(`  ! ${item.slug}: ${e.message}`)
  }
}
console.log(`\nWrite API: ${ok}/${payload.collection.items.length} domains pushed.`)
console.log('If this failed, import butter-import.json from the ButterCMS dashboard instead.')
