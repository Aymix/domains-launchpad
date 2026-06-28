#!/usr/bin/env node
/**
 * Embed a video player right AFTER the description (tagline) paragraph in a
 * single Outline doc. Fixes the title-editor mis-targeting in
 * outline-embed-videos.mjs by selecting the BODY editor that contains the
 * tagline, not the first .ProseMirror (which is the title editor).
 *
 *   OUTLINE_URL=... OUTLINE_API_TOKEN=... node scripts/outline-embed-after-desc.mjs <docId> <youtubeUrl> <taglineSnippet>
 */
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const { chromium } = require('/home/amine/.npm/_npx/705bc6b22212b352/node_modules/playwright')

const BASE = (process.env.OUTLINE_URL || '').replace(/\/$/, '')
const T = process.env.OUTLINE_API_TOKEN || ''
const [DOCID, URL, SNIPPET] = process.argv.slice(2)
const SHOT = '/tmp/claude-1000/-home-amine/ce61f95a-c242-43f3-81fa-a9c19b7969ca/scratchpad'
if (!BASE || !T || !DOCID || !URL || !SNIPPET) { console.error('args: <docId> <youtubeUrl> <taglineSnippet>'); process.exit(1) }

const api = async (p, b) => (await fetch(BASE + '/api/' + p, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + T }, body: JSON.stringify(b) })).json()
const doc = (await api('documents.info', { id: DOCID })).data

const ctx = await chromium.launchPersistentContext(SHOT + '/pwprofile', { headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'], extraHTTPHeaders: { Authorization: 'Bearer ' + T }, viewport: { width: 1400, height: 1100 } })
const page = await ctx.newPage()
try {
  await page.goto(BASE + doc.url, { waitUntil: 'domcontentloaded', timeout: 45000 })
  await page.waitForSelector('.ProseMirror', { timeout: 30000 })
  await page.waitForTimeout(2500)

  // clipboard via trusted Ctrl+C
  await page.evaluate((u) => {
    const ta = document.createElement('textarea'); ta.id = '__cliptmp'; ta.value = u
    ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0'
    document.body.appendChild(ta); ta.focus(); ta.select()
  }, URL)
  await page.keyboard.press('Control+C')
  await page.evaluate(() => document.getElementById('__cliptmp')?.remove())

  // caret at end of the tagline paragraph in the BODY editor (the editor that
  // actually contains the tagline text — NOT the separate title editor).
  const placed = await page.evaluate((snip) => {
    const eds = [...document.querySelectorAll('.ProseMirror')]
    for (const ed of eds) {
      const p = [...ed.querySelectorAll('p')].find((el) => el.textContent.includes(snip))
      if (p) {
        p.scrollIntoView({ block: 'center' })
        ed.focus()
        const r = document.createRange(); r.selectNodeContents(p); r.collapse(false)
        const s = window.getSelection(); s.removeAllRanges(); s.addRange(r)
        return true
      }
    }
    return false
  }, SNIPPET)
  if (!placed) { console.error('tagline paragraph not found'); await ctx.close(); process.exit(1) }

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
  console.log('iframes:', iframes)
  await page.screenshot({ path: SHOT + '/video-editing-doc.png' })
  await page.waitForTimeout(2500)
} finally { await ctx.close() }

const info = await api('documents.info', { id: DOCID })
const lines = (info.data.text || '').split('\n')
const yi = lines.findIndex((l) => /^\[https:\/\/www\.youtube\.com\/watch/.test(l))
console.log('embed line index:', yi, '| context:', JSON.stringify(lines.slice(Math.max(0, yi - 1), yi + 2)))
