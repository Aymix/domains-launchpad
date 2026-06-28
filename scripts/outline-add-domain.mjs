#!/usr/bin/env node
/**
 * Add ONE domain doc as a child of its existing cluster parent doc in Outline,
 * WITHOUT touching sibling domain docs (they may have manually-embedded videos).
 * Also refreshes the cluster parent's intro list. Idempotent (update if exists).
 *
 *   OUTLINE_URL=... OUTLINE_API_TOKEN=... node scripts/outline-add-domain.mjs <slug>
 *
 * Then run scripts/outline-embed-videos.mjs with ONLY_SLUGS=<slug> for the player.
 */
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const kb = JSON.parse(await readFile(join(__dirname, '..', 'src/content/knowledge-base.json'), 'utf8'))

const SLUG = process.argv[2]
if (!SLUG) { console.error('Usage: node scripts/outline-add-domain.mjs <slug>'); process.exit(1) }
const domain = kb.domains.find((d) => d.slug === SLUG)
if (!domain) { console.error('No domain with slug', SLUG); process.exit(1) }
const CLUSTER = domain.cluster

const BASE = (process.env.OUTLINE_URL || '').replace(/\/$/, '')
const TOKEN = process.env.OUTLINE_API_TOKEN || ''
if (!BASE || !TOKEN) { console.error('Set OUTLINE_URL and OUTLINE_API_TOKEN.'); process.exit(1) }

/* ----- markdown helpers (in sync with outline-import.mjs) ----- */
const esc = (s) => String(s || '').trim()
const link = (title, url) => (url ? `[${esc(title)}](${url})` : esc(title))
function resourceLines(items, titleKey = 'title', noteKey = 'note') {
  return (items || []).map((it) => {
    const name = it[titleKey] || it.title || it.name
    const meta = [it.provider, it.level].filter(Boolean).join(', ')
    const note = it[noteKey] || it.whyGood || it.note || ''
    const tail = [meta, note].filter(Boolean).join(' — ')
    return `- ${link(name, it.url)}${tail ? ` — ${tail}` : ''}`
  }).join('\n')
}
function domainMarkdown(d) {
  const L = []
  L.push(`*${esc(d.tagline)}*\n`)
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
const clusterIntro = (cluster, domains) =>
  `Fields in the **${cluster}** track.\n\n${domains.map((d) => `- **${d.name}** — ${esc(d.tagline)}`).join('\n')}\n`

async function api(path, body) {
  const res = await fetch(`${BASE}/api/${path}`, {
    method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${TOKEN}` }, body: JSON.stringify(body),
  })
  const json = await res.json().catch(() => ({}))
  if (!res.ok || json.ok === false) throw new Error(`${path}: HTTP ${res.status} ${JSON.stringify(json).slice(0, 200)}`)
  return json.data
}

const cols = await api('collections.list', { limit: 100 })
const collectionId = ((cols || []).find((c) => c.name === 'Domains' || c.name === 'Launchpad') || (cols || [])[0])?.id
if (!collectionId) throw new Error('collection not found')

const docs = await api('documents.list', { collectionId, limit: 100 })
const byTitle = new Map((docs || []).map((d) => [d.title, d]))

const parent = byTitle.get(CLUSTER)
if (!parent) throw new Error(`cluster parent doc "${CLUSTER}" not found`)

// 1) add/update ONLY this domain doc
const existing = byTitle.get(domain.name)
if (existing) {
  await api('documents.update', { id: existing.id, text: domainMarkdown(domain) })
  console.log(`~ updated "${domain.name}" (${existing.id})`)
} else {
  const child = await api('documents.create', { title: domain.name, text: domainMarkdown(domain), collectionId, parentDocumentId: parent.id, publish: true })
  console.log(`+ created "${domain.name}" (${child.id}) under "${CLUSTER}"`)
}

// 2) refresh the cluster parent intro list (parent has no video embed, safe to rewrite)
const clusterDomains = kb.domains.filter((d) => d.cluster === CLUSTER)
await api('documents.update', { id: parent.id, text: clusterIntro(CLUSTER, clusterDomains) })
console.log(`~ refreshed cluster intro "${CLUSTER}" (${clusterDomains.length} domains)`)
console.log('Done. Next: embed the video player with ONLY_SLUGS=' + SLUG)
