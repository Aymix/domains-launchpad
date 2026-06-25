#!/usr/bin/env node
/**
 * Build Outline-ready content from the Launchpad knowledge base, and
 * (optionally) push it into a running Outline instance via its API.
 *
 *   node scripts/outline-import.mjs
 *     -> writes outline-export/*.md  (one Start-Here doc + one per cluster + one per domain)
 *
 *   OUTLINE_URL=http://outline.example  OUTLINE_API_TOKEN=xxxxx \
 *   node scripts/outline-import.mjs --push
 *     -> creates a "Launchpad" collection and all documents (nested) via the API
 *
 * Get an API token in Outline: Settings -> API Tokens (after you sign in).
 * Docs: https://www.getoutline.com/developers
 */
import { readFile, writeFile, mkdir, rm } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const kb = JSON.parse(await readFile(join(root, 'src/content/knowledge-base.json'), 'utf8'))

/* ----------------------------- markdown helpers ----------------------------- */
const esc = (s) => String(s || '').trim()
const link = (title, url) => (url ? `[${esc(title)}](${url})` : esc(title))

function resourceLines(items, titleKey = 'title', noteKey = 'note') {
  return (items || [])
    .map((it) => {
      const name = it[titleKey] || it.title || it.name
      const meta = [it.provider, it.level].filter(Boolean).join(', ')
      const note = it[noteKey] || it.whyGood || it.note || ''
      const tail = [meta, note].filter(Boolean).join(' — ')
      return `- ${link(name, it.url)}${tail ? ` — ${tail}` : ''}`
    })
    .join('\n')
}

function domainMarkdown(d) {
  const L = []
  L.push(`*${esc(d.tagline)}*\n`)
  // Beginner intro video is inserted as a real Outline embed via browser
  // automation (scripts/outline-embed-videos.mjs), because Outline only creates
  // a player when a URL is pasted in the editor — markdown import yields a link.
  // (introVideo data is kept in knowledge-base.json for reference.)
  if (d.overview) L.push(`## Overview\n\n${esc(d.overview)}\n`)
  if (d.whyItMatters) L.push(`## Why it matters\n\n${esc(d.whyItMatters)}\n`)
  if (d.isItForYou) L.push(`## Is this for you?\n\n${esc(d.isItForYou)}\n`)
  if (d.prerequisites?.length) L.push(`## Nice to have first\n\n${d.prerequisites.map((p) => `- ${esc(p)}`).join('\n')}\n`)

  if (d.roadmap?.length) {
    L.push(`## Learning roadmap\n`)
    d.roadmap.forEach((s, i) => {
      L.push(`### ${i + 1}. ${esc(s.stage)}`)
      if (s.goal) L.push(`*Goal: ${esc(s.goal)}*\n`)
      if (s.steps?.length) L.push(s.steps.map((x) => `1. ${esc(x)}`).join('\n'))
      if (s.milestoneProject) L.push(`\n> **Milestone project:** ${esc(s.milestoneProject)}`)
      L.push('')
    })
  }
  if (d.coreConcepts?.length) L.push(`## Core concepts\n\n${d.coreConcepts.map((c) => `- **${esc(c.name)}** — ${esc(c.what)}`).join('\n')}\n`)
  if (d.toolsAndTech?.length) L.push(`## Tools & technologies\n\n${d.toolsAndTech.map((t) => `\`${esc(t)}\``).join(' ')}\n`)
  if (d.freeCourses?.length) L.push(`## Free courses\n\n${resourceLines(d.freeCourses)}\n`)
  if (d.youtubeChannels?.length) L.push(`## YouTube channels\n\n${resourceLines(d.youtubeChannels, 'name', 'whyGood')}\n`)
  if (d.articlesAndDocs?.length) L.push(`## Articles, docs & sites\n\n${resourceLines(d.articlesAndDocs)}\n`)
  if (d.interactivePractice?.length) L.push(`## Practice & playgrounds\n\n${resourceLines(d.interactivePractice, 'name')}\n`)
  if (d.communities?.length) L.push(`## Communities\n\n${resourceLines(d.communities, 'name')}\n`)
  if (d.projectIdeas?.length) L.push(`## Project ideas\n\n${d.projectIdeas.map((p) => `- **${esc(p.title)}**${p.difficulty ? ` _(${esc(p.difficulty)})_` : ''} — ${esc(p.what)}`).join('\n')}\n`)
  if (d.careerPaths?.length || d.timeToJobReady) {
    L.push(`## Careers\n`)
    if (d.timeToJobReady) L.push(`Job-ready in roughly **${esc(d.timeToJobReady)}** of consistent, project-based learning.\n`)
    if (d.careerPaths?.length) L.push(d.careerPaths.map((c) => `- ${esc(c)}`).join('\n') + '\n')
  }
  if (d.commonMistakes?.length) L.push(`## Common beginner mistakes\n\n${d.commonMistakes.map((m) => `- ${esc(m)}`).join('\n')}\n`)
  if (d.glossary?.length) L.push(`## Glossary\n\n${d.glossary.map((g) => `- **${esc(g.term)}** — ${esc(g.definition)}`).join('\n')}\n`)
  if (d.relatedDomains?.length) {
    const names = d.relatedDomains.map((s) => kb.domains.find((x) => x.slug === s)).filter(Boolean).map((x) => x.name)
    if (names.length) L.push(`## Related domains\n\n${names.map((n) => `- ${esc(n)}`).join('\n')}\n`)
  }
  return L.join('\n')
}

function guideMarkdown(g) {
  const L = []
  if (g.intro) L.push(`${esc(g.intro)}\n`)
  if (g.howToChoose) L.push(`## How to choose a domain\n\n${esc(g.howToChoose)}\n`)
  if (g.domainMap) L.push(`## How the domains connect\n\n${esc(g.domainMap)}\n`)
  if (g.learningPrinciples?.length) L.push(`## Learning principles that always work\n\n${g.learningPrinciples.map((p) => `- ${esc(p)}`).join('\n')}\n`)
  if (g.starterTracks?.length) {
    L.push(`## Starter tracks\n`)
    g.starterTracks.forEach((t) => {
      const names = (t.domains || []).map((s) => kb.domains.find((x) => x.slug === s)).filter(Boolean).map((x) => x.name)
      L.push(`### ${esc(t.name)}`)
      if (t.tagline) L.push(`*${esc(t.tagline)}*\n`)
      if (names.length) L.push(`**Domains:** ${names.join(', ')}\n`)
      if (t.why) L.push(`${esc(t.why)}\n`)
    })
  }
  if (g.universalFreeResources?.length) L.push(`## Universal free resources\n\n${resourceLines(g.universalFreeResources)}\n`)
  if (g.firstSevenDays?.length) L.push(`## Your first 7 days\n\n${g.firstSevenDays.map((s) => `1. ${esc(s)}`).join('\n')}\n`)
  if (g.mindsetTips?.length) L.push(`## Mindset tips\n\n${g.mindsetTips.map((s) => `- ${esc(s)}`).join('\n')}\n`)
  return L.join('\n')
}

const clusterIntro = (cluster, domains) =>
  `Fields in the **${cluster}** track.\n\n${domains.map((d) => `- **${d.name}** — ${esc(d.tagline)}`).join('\n')}\n`

/* ----------------------------- build document tree ----------------------------- */
const slug = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
const clusters = kb.clusters || []

const tree = []
tree.push({ key: 'start-here', title: 'Start Here — How to choose & where to begin', text: guideMarkdown(kb.guide || {}), children: [] })
for (const c of clusters) {
  const ds = kb.domains.filter((d) => d.cluster === c)
  tree.push({
    key: 'cluster-' + slug(c),
    title: c,
    text: clusterIntro(c, ds),
    children: ds.map((d) => ({ key: slug(d.slug), title: `${d.name}`, text: domainMarkdown(d) })),
  })
}

/* ----------------------------- write markdown files ----------------------------- */
const outDir = join(root, 'outline-export')
await rm(outDir, { recursive: true, force: true })
await mkdir(outDir, { recursive: true })
let fileCount = 0
let order = 1
for (const node of tree) {
  const prefix = String(order++).padStart(2, '0')
  await writeFile(join(outDir, `${prefix}-${node.key}.md`), `# ${node.title}\n\n${node.text}`)
  fileCount++
  let sub = 1
  for (const child of node.children || []) {
    await writeFile(join(outDir, `${prefix}-${String(sub++).padStart(2, '0')}-${child.key}.md`), `# ${child.title}\n\n${child.text}`)
    fileCount++
  }
}
console.log(`Wrote ${fileCount} markdown files to outline-export/`)

/* ----------------------------- optional API push ----------------------------- */
const PUSH = process.argv.includes('--push')
const UPDATE = process.argv.includes('--update')
if (!PUSH && !UPDATE) {
  console.log('Run with --push (create everything) or --update (update existing domain docs), with OUTLINE_URL + OUTLINE_API_TOKEN set.')
  process.exit(0)
}

const BASE = (process.env.OUTLINE_URL || '').replace(/\/$/, '')
const TOKEN = process.env.OUTLINE_API_TOKEN || ''
if (!BASE || !TOKEN) {
  console.error('Set OUTLINE_URL and OUTLINE_API_TOKEN.')
  process.exit(1)
}

async function api(path, body) {
  const res = await fetch(`${BASE}/api/${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${TOKEN}` },
    body: JSON.stringify(body),
  })
  const json = await res.json().catch(() => ({}))
  if (!res.ok || json.ok === false) throw new Error(`${path}: HTTP ${res.status} ${JSON.stringify(json).slice(0, 200)}`)
  return json.data
}

if (UPDATE) {
  const cols = await api('collections.list', { limit: 100 })
  const collectionId = process.env.OUTLINE_COLLECTION_ID || ((cols || []).find((c) => c.name === 'Domains' || c.name === 'Launchpad') || (cols || [])[0])?.id
  if (!collectionId) throw new Error('Launchpad collection not found')
  const docs = await api('documents.list', { collectionId, limit: 100 })
  const byTitle = new Map((docs || []).map((d) => [d.title, d.id]))
  let n = 0
  for (const d of kb.domains) {
    const id = byTitle.get(d.name)
    if (!id) { console.warn(`  ! no doc for "${d.name}"`); continue }
    await api('documents.update', { id, text: domainMarkdown(d) })
    console.log(`  ~ updated ${d.name}${d.introVideo ? '  (+ video)' : ''}`)
    n++
  }
  console.log(`Done: updated ${n} domain documents.`)
  process.exit(0)
}

console.log(`Pushing to ${BASE} ...`)
const collection = await api('collections.create', {
  name: 'Domains',
  description: 'A beginner-first guide to 16 tech, engineering & creative domains.',
  permission: 'read',
  color: '#4F46E5',
})
console.log(`Collection created: ${collection.id}`)

let created = 0
for (const node of tree) {
  const parent = await api('documents.create', { title: node.title, text: node.text, collectionId: collection.id, publish: true })
  created++
  for (const child of node.children || []) {
    await api('documents.create', { title: child.title, text: child.text, collectionId: collection.id, parentDocumentId: parent.id, publish: true })
    created++
  }
  console.log(`  + ${node.title} (${(node.children || []).length} children)`)
}
console.log(`Done: ${created} documents created in the "Launchpad" collection.`)
