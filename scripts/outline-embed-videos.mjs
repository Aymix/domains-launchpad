#!/usr/bin/env node
/**
 * Insert a real Outline video EMBED (player) at the top of each domain doc.
 *
 * Outline only creates an embed when a URL is pasted in the editor and the
 * "Embed" paste-menu option is chosen — markdown/API import only yields a link.
 * So we drive the editor with Playwright: paste the YouTube URL after the
 * description, then click "Embed". A real embed round-trips through the API as
 * [url](url); a plain link as <url>.
 *
 * Env: OUTLINE_URL, OUTLINE_API_TOKEN  (token also authenticates the web app
 * via an injected Authorization header). PLAYWRIGHT_BROWSERS_PATH if needed.
 *
 *   node scripts/outline-embed-videos.mjs
 */
import { createRequire } from 'module'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
const require = createRequire(import.meta.url)
const { chromium } = require('/home/amine/.npm/_npx/705bc6b22212b352/node_modules/playwright')

const __dirname = dirname(fileURLToPath(import.meta.url))
const BASE = (process.env.OUTLINE_URL || '').replace(/\/$/, '')
const T = process.env.OUTLINE_API_TOKEN || ''
const COLLECTION = 'Domains'
if (!BASE || !T) { console.error('Set OUTLINE_URL and OUTLINE_API_TOKEN'); process.exit(1) }

const kb = JSON.parse(readFileSync(join(__dirname, '..', 'src/content/knowledge-base.json'), 'utf8'))

async function api(path, body) {
  const r = await fetch(BASE + '/api/' + path, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + T }, body: JSON.stringify(body) })
  return r.json()
}

const cols = await api('collections.list', { limit: 100 })
const collectionId = ((cols.data || []).find((c) => c.name === COLLECTION || c.name === 'Launchpad') || (cols.data || [])[0])?.id
const list = await api('documents.list', { collectionId, limit: 100 })
const byTitle = new Map((list.data || []).map((d) => [d.title, d]))

const ONLY = (process.env.ONLY_SLUGS || '').split(',').map((s) => s.trim()).filter(Boolean)
const targets = kb.domains.filter((d) => d.introVideo?.url && byTitle.has(d.name) && (!ONLY.length || ONLY.includes(d.slug)))
console.log(`Embedding videos into ${targets.length} domain docs...`)

const ctx = await chromium.launchPersistentContext('/tmp/claude-1000/-home-amine/ce61f95a-c242-43f3-81fa-a9c19b7969ca/scratchpad/pwprofile', {
  headless: true,
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
  extraHTTPHeaders: { Authorization: 'Bearer ' + T },
  viewport: { width: 1400, height: 1100 },
})
const page = await ctx.newPage()

async function embedOne(d) {
  const doc = byTitle.get(d.name)
  const url = d.introVideo.url
  await page.goto(BASE + doc.url, { waitUntil: 'domcontentloaded', timeout: 45000 })
  await page.waitForSelector('.ProseMirror', { timeout: 30000 })
  await page.waitForTimeout(2500)

  // load URL into clipboard via a trusted Ctrl+C (navigator.clipboard is blocked on http)
  await page.evaluate((u) => {
    const ta = document.createElement('textarea')
    ta.id = '__cliptmp'; ta.value = u
    ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0'
    document.body.appendChild(ta); ta.focus(); ta.select()
  }, url)
  await page.keyboard.press('Control+C')
  await page.evaluate(() => document.getElementById('__cliptmp')?.remove())

  // caret at an empty paragraph right after the first body block (the description)
  await page.evaluate(() => {
    const pm = document.querySelector('.ProseMirror'); pm.focus()
    const r = document.createRange(); r.selectNodeContents(pm.firstElementChild); r.collapse(false)
    const s = window.getSelection(); s.removeAllRanges(); s.addRange(r)
  })
  await page.keyboard.press('Enter')
  await page.waitForTimeout(250)

  await page.keyboard.press('Control+V')
  // paste menu opens; wait for the async embeddability check, then choose Embed
  const embed = page.getByText('Embed', { exact: true })
  try {
    await embed.first().waitFor({ state: 'visible', timeout: 9000 })
    await embed.first().click()
  } catch {
    await page.keyboard.press('ArrowDown')
    await page.keyboard.press('Enter')
  }
  await page.waitForTimeout(2500)
  const iframes = await page.evaluate(() => document.querySelectorAll('.ProseMirror iframe').length)
  await page.waitForTimeout(1500) // let it autosave before navigating away
  return iframes
}

let ok = 0
for (const d of targets) {
  try {
    const frames = await embedOne(d)
    console.log(`  ${frames > 0 ? '✓' : '?'} ${d.name}  (iframes: ${frames})`)
    if (frames > 0) ok++
  } catch (e) {
    console.log(`  ✗ ${d.name}: ${e.message.slice(0, 80)}`)
  }
}
await ctx.close()

// verify via API
const after = await api('documents.list', { collectionId, limit: 100 })
let embeds = 0
for (const d of targets) {
  const doc = (after.data || []).find((x) => x.title === d.name)
  const info = await api('documents.info', { id: doc.id })
  if ((info.data.text || '').includes(`[${d.introVideo.url}](${d.introVideo.url})`)) embeds++
}
console.log(`\nDone. Editor showed players for ${ok}/${targets.length}; API confirms real embeds in ${embeds}/${targets.length}.`)
