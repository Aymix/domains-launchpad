#!/usr/bin/env node
/**
 * Merge beginner intro videos (from the workflow) into knowledge-base.json.
 * Re-verifies each candidate via YouTube oEmbed and picks the first that is
 * real AND embeddable. Usage:
 *   node scripts/merge-videos.mjs <workflow-output-file.json>
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const kbPath = join(__dirname, '..', 'src/content/knowledge-base.json')
const outputFile = process.argv[2]
if (!outputFile) { console.error('Pass the workflow output file path.'); process.exit(1) }

const wrap = JSON.parse(readFileSync(outputFile, 'utf8'))
const result = wrap.result || wrap
const videos = result.videos || []
const bySlug = Object.fromEntries(videos.map((v) => [v.slug, v]))

function extractId(c) {
  if (c.videoId && /^[\w-]{11}$/.test(c.videoId)) return c.videoId
  const m = String(c.url || '').match(/[?&]v=([\w-]{11})/) || String(c.url || '').match(/youtu\.be\/([\w-]{11})/) || String(c.url || '').match(/embed\/([\w-]{11})/)
  return m ? m[1] : null
}

async function oembed(id) {
  const watch = `https://www.youtube.com/watch?v=${id}`
  try {
    const r = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(watch)}&format=json`, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
    })
    if (!r.ok) return null
    const j = await r.json()
    return j && j.title ? { url: watch, videoId: id, title: j.title, channel: j.author_name } : null
  } catch {
    return null
  }
}

const kb = JSON.parse(readFileSync(kbPath, 'utf8'))
let picked = 0
const failed = []
for (const d of kb.domains) {
  const v = bySlug[d.slug]
  if (!v || !v.candidates?.length) { failed.push(`${d.slug} (no candidates)`); console.log(`  ✗ ${d.slug}: no candidates`); continue }
  let chosen = null
  for (const c of v.candidates) {
    const id = extractId(c)
    if (!id) continue
    const o = await oembed(id)
    if (o) { chosen = o; break }
  }
  if (chosen) { d.introVideo = chosen; picked++; console.log(`  ✓ ${d.slug.padEnd(24)} ${chosen.title.slice(0, 50)} — ${chosen.channel}`) }
  else { failed.push(`${d.slug} (none verified)`); console.log(`  ✗ ${d.slug}: candidates found but none passed oEmbed`) }
}
writeFileSync(kbPath, JSON.stringify(kb, null, 2))
console.log(`\nPicked ${picked}/${kb.domains.length}. ${failed.length ? 'Unresolved: ' + failed.join(', ') : 'All resolved.'}`)
