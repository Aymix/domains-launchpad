#!/usr/bin/env node
/**
 * Insert the 3-cluster overlapping-circles image into the Start-Here doc, under
 * the "How the domains connect" heading. Uses the editor (file upload) so the
 * existing TED embed is preserved (a documents.update would flatten the embed).
 * Env: OUTLINE_URL, OUTLINE_API_TOKEN.
 */
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const { chromium } = require('/home/amine/.npm/_npx/705bc6b22212b352/node_modules/playwright')

const BASE = (process.env.OUTLINE_URL || 'https://outline.31.97.193.81.sslip.io').replace(/\/$/, '')
const T = process.env.OUTLINE_API_TOKEN || ''
const HEADING = 'How the domains connect'
const PNG = '/tmp/claude-1000/-home-amine/ce61f95a-c242-43f3-81fa-a9c19b7969ca/scratchpad/clusters-venn.png'
const SHOT = '/tmp/claude-1000/-home-amine/ce61f95a-c242-43f3-81fa-a9c19b7969ca/scratchpad'

async function api(p, b) {
  const r = await fetch(BASE + '/api/' + p, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + T }, body: JSON.stringify(b) })
  return r.json()
}

const cols = await api('collections.list', { limit: 100 })
const cid = cols.data[0].id
const list = await api('documents.list', { collectionId: cid, limit: 100 })
const doc = list.data.find((d) => /^Start Here/i.test(d.title))

const ctx = await chromium.launchPersistentContext(SHOT + '/pwprofile', {
  headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'],
  extraHTTPHeaders: { Authorization: 'Bearer ' + T }, viewport: { width: 1400, height: 1100 },
})
const page = await ctx.newPage()
try {
  await page.goto(BASE + doc.url, { waitUntil: 'networkidle', timeout: 35000 })
  await page.waitForSelector('.ProseMirror', { timeout: 20000 })
  await page.waitForTimeout(2500)

  // place the image right after the "three overlapping circles" sentence
  const found = await page.evaluate(() => {
    const ps = [...document.querySelectorAll('.ProseMirror p, .ProseMirror li')]
    const el = ps.find((e) => e.textContent.includes('three overlapping circles'))
    if (!el) return false
    el.scrollIntoView({ block: 'center' })
    const pm = el.closest('.ProseMirror'); pm.focus()
    const r = document.createRange(); r.selectNodeContents(el); r.collapse(false)
    const s = window.getSelection(); s.removeAllRanges(); s.addRange(r)
    return true
  })
  if (!found) throw new Error('sentence not found')

  await page.keyboard.press('Enter')          // empty paragraph under the heading
  await page.waitForTimeout(300)
  await page.keyboard.type('/image')          // open block menu, filter to Image
  await page.waitForTimeout(1200)
  const [chooser] = await Promise.all([
    page.waitForEvent('filechooser', { timeout: 9000 }),
    page.keyboard.press('Enter'),             // select the Image item -> opens file picker
  ])
  await chooser.setFiles(PNG)
  await page.waitForTimeout(6000)             // upload + render

  const imgs = await page.evaluate(() => document.querySelectorAll('.ProseMirror img').length)
  console.log('images in editor:', imgs)
  await page.screenshot({ path: SHOT + '/venn-inserted.png' })
  await page.waitForTimeout(3000)             // autosave
} finally {
  await ctx.close()
}

const info = await api('documents.info', { id: doc.id })
const txt = info.data.text || ''
const hasImg = /!\[[^\]]*\]\([^)]+\)/.test(txt)
console.log('doc has an image markdown:', hasImg)
console.log('still has TED embed:', txt.includes('[https://www.youtube.com/watch?v=4sZdcB6bjI8]'))
const i = txt.split('\n').findIndex((l) => l.includes('How the domains connect'))
console.log('around heading:', JSON.stringify(txt.split('\n').slice(i, i + 4)))
