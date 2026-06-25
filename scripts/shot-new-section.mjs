import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const { chromium } = require('/home/amine/.npm/_npx/705bc6b22212b352/node_modules/playwright')
const BASE = (process.env.OUTLINE_URL || '').replace(/\/$/, ''), T = process.env.OUTLINE_API_TOKEN || ''
if (!BASE || !T) { console.error('Set OUTLINE_URL and OUTLINE_API_TOKEN'); process.exit(1) }
const SHOT = '/tmp/claude-1000/-home-amine/ce61f95a-c242-43f3-81fa-a9c19b7969ca/scratchpad'
const api = async (p, b) => (await fetch(BASE + '/api/' + p, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + T }, body: JSON.stringify(b) })).json()
const cols = await api('collections.list', { limit: 100 })
const cid = (cols.data.find((c) => c.name === 'Domains' || c.name === 'Launchpad') || cols.data[0]).id
const list = await api('documents.list', { collectionId: cid, limit: 100 })
const doc = list.data.find((d) => d.title === 'Applied AI & Generative AI')
const ctx = await chromium.launchPersistentContext(SHOT + '/pwprofile', { headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'], extraHTTPHeaders: { Authorization: 'Bearer ' + T }, viewport: { width: 1300, height: 1000 } })
const page = await ctx.newPage()
await page.goto(BASE + doc.url, { waitUntil: 'domcontentloaded', timeout: 45000 })
await page.waitForSelector('.ProseMirror iframe', { timeout: 30000 })
await page.waitForTimeout(3000)
await page.screenshot({ path: SHOT + '/new-applied-ai.png' })
console.log('iframes:', await page.evaluate(() => document.querySelectorAll('.ProseMirror iframe').length))
await ctx.close()
