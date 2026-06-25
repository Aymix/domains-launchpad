#!/usr/bin/env node
/**
 * Embed a well-known intro TED talk into the Start-Here doc, right after the
 * "How to choose a domain" heading. Same editor-paste technique as
 * outline-embed-videos.mjs. Env: OUTLINE_URL, OUTLINE_API_TOKEN.
 */
import { createRequire } from 'module'
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
const require = createRequire(import.meta.url)
const { chromium } = require('/home/amine/.npm/_npx/705bc6b22212b352/node_modules/playwright')

const __dirname = dirname(fileURLToPath(import.meta.url))
const BASE = (process.env.OUTLINE_URL || '').replace(/\/$/, '')
const T = process.env.OUTLINE_API_TOKEN || ''
const HEADING = 'How to choose a domain'
const kbPath = join(__dirname, '..', 'src/content/knowledge-base.json')

// candidates, best first
const CANDIDATES = [
  { url: 'https://www.youtube.com/watch?v=4sZdcB6bjI8', id: '4sZdcB6bjI8', title: 'Why Some of Us Don’t Have One True Calling — Emilie Wapnick (TED)' },
  { url: 'https://www.youtube.com/watch?v=bvAEJ8G9l9U', id: 'bvAEJ8G9l9U', title: 'How to find work you love — Scott Dinsmore (TED)' },
]

async function api(path, body) {
  const r = await fetch(BASE + '/api/' + path, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + T }, body: JSON.stringify(body) })
  return r.json()
}
async function oembedOk(id) {
  try {
    const r = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`, { headers: { 'User-Agent': 'Mozilla/5.0' } })
    if (!r.ok) return null
    const j = await r.json()
    return j?.title ? j : null
  } catch { return null }
}

// pick the first embeddable candidate
let chosen = null
for (const c of CANDIDATES) {
  const o = await oembedOk(c.id)
  if (o) { chosen = { ...c, title: o.title, channel: o.author_name }; break }
}
if (!chosen) { console.error('No embeddable candidate'); process.exit(1) }
console.log('Using:', chosen.title, '—', chosen.url)

// record on the guide for reference
const kb = JSON.parse(readFileSync(kbPath, 'utf8'))
kb.guide = kb.guide || {}
kb.guide.introVideo = { url: chosen.url, videoId: chosen.id, title: chosen.title, channel: chosen.channel }
writeFileSync(kbPath, JSON.stringify(kb, null, 2))

// find the Start-Here doc
const cols = await api('collections.list', { limit: 100 })
const cid = (cols.data.find((c) => c.name === 'Domains' || c.name === 'Launchpad') || cols.data[0]).id
const list = await api('documents.list', { collectionId: cid, limit: 100 })
const doc = list.data.find((d) => /^Start Here/i.test(d.title))
if (!doc) { console.error('Start-Here doc not found'); process.exit(1) }

const ctx = await chromium.launchPersistentContext('/tmp/claude-1000/-home-amine/ce61f95a-c242-43f3-81fa-a9c19b7969ca/scratchpad/pwprofile', {
  headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'],
  extraHTTPHeaders: { Authorization: 'Bearer ' + T }, viewport: { width: 1400, height: 1100 },
})
const page = await ctx.newPage()
try {
  await page.goto(BASE + doc.url, { waitUntil: 'networkidle', timeout: 35000 })
  await page.waitForSelector('.ProseMirror', { timeout: 20000 })
  await page.waitForTimeout(2000)

  // clipboard via trusted Ctrl+C
  await page.evaluate((u) => {
    const ta = document.createElement('textarea'); ta.id = '__cliptmp'; ta.value = u
    ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0'
    document.body.appendChild(ta); ta.focus(); ta.select()
  }, chosen.url)
  await page.keyboard.press('Control+C')
  await page.evaluate(() => document.getElementById('__cliptmp')?.remove())

  // caret at end of the "How to choose a domain" heading, then new line.
  // Search across ALL editors (Outline has a separate title editor first).
  const found = await page.evaluate((heading) => {
    const heads = [...document.querySelectorAll('.ProseMirror h1, .ProseMirror h2, .ProseMirror h3, .ProseMirror h4')]
    // Outline prefixes a "#" permalink anchor to the heading text content.
    const h = heads.find((e) => e.textContent.trim().replace(/^#+\s*/, '') === heading)
    if (!h) return false
    h.scrollIntoView({ block: 'center' })
    const pm = h.closest('.ProseMirror'); pm.focus()
    const r = document.createRange(); r.selectNodeContents(h); r.collapse(false)
    const s = window.getSelection(); s.removeAllRanges(); s.addRange(r)
    return true
  }, HEADING)
  if (!found) { console.error(`Heading "${HEADING}" not found`); await ctx.close(); process.exit(1) }
  await page.keyboard.press('Enter')
  await page.waitForTimeout(250)

  await page.keyboard.press('Control+V')
  const embed = page.getByText('Embed', { exact: true })
  try {
    await embed.first().waitFor({ state: 'visible', timeout: 9000 })
    await embed.first().click()
  } catch {
    await page.keyboard.press('ArrowDown'); await page.keyboard.press('Enter')
  }
  await page.waitForTimeout(3000)
  const iframes = await page.evaluate(() => document.querySelectorAll('.ProseMirror iframe').length)
  console.log('iframes in Start-Here editor:', iframes)
  await page.screenshot({ path: '/tmp/claude-1000/-home-amine/ce61f95a-c242-43f3-81fa-a9c19b7969ca/scratchpad/starthere.png' })
  await page.waitForTimeout(2500)
} finally {
  await ctx.close()
}

const info = await api('documents.info', { id: doc.id })
const enc = chosen.url.replace(/_/g, '%5F')
const ok = (info.data.text || '').includes(`[${enc}](${enc})`) || (info.data.text || '').includes(`[${chosen.url}](${chosen.url})`)
console.log('API confirms embed in Start-Here:', ok)
const idx = (info.data.text || '').split('\n').findIndex((l) => l.includes('youtube.com'))
console.log('context:', JSON.stringify((info.data.text || '').split('\n').slice(Math.max(0, idx - 1), idx + 2)))
