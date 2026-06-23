// Content layer for the Launchpad knowledge base.
//
// This project is built on the ButterCMS Vue architecture
// (https://buttercms.com/docs/frameworks/starter-projects/vue).
//
// - If VITE_BUTTER_TOKEN is set, content is pulled live from ButterCMS:
//     * the domains come from a ButterCMS Collection (key: VITE_BUTTER_DOMAINS_KEY)
//     * the Start-Here guide comes from a ButterCMS Page (slug: VITE_BUTTER_GUIDE_SLUG)
// - If no token is set, we fall back to the bundled snapshot in
//   src/content/knowledge-base.json (same shape), so the site always works.
//
// Use `npm run seed:butter` (with a write token) to push the bundled content
// into your own ButterCMS account. See scripts/seed-butter.mjs.

import Butter from 'buttercms'
import bundled from './content/knowledge-base.json'

const env = (typeof import.meta !== 'undefined' && import.meta.env) || {}
const TOKEN = env.VITE_BUTTER_TOKEN || ''
const GUIDE_SLUG = env.VITE_BUTTER_GUIDE_SLUG || 'start-here'
const DOMAINS_KEY = env.VITE_BUTTER_DOMAINS_KEY || 'domains'

let cache = null

export const usingButter = Boolean(TOKEN)

async function fromButter() {
  const butter = Butter(TOKEN)
  const [collectionRes, pageRes] = await Promise.all([
    butter.content.retrieve([DOMAINS_KEY]),
    butter.page.retrieve('*', GUIDE_SLUG).catch(() => null),
  ])
  const domains = (collectionRes?.data?.data?.[DOMAINS_KEY]) || []
  const guide = pageRes?.data?.data?.fields || bundled.guide
  return {
    ...bundled,
    domains: domains.length ? domains : bundled.domains,
    guide,
    source: 'buttercms',
  }
}

export async function getContent() {
  if (cache) return cache
  if (usingButter) {
    try {
      cache = await fromButter()
      return cache
    } catch (err) {
      // Network / token problem: degrade gracefully to the bundled snapshot.
      console.warn('[butter] falling back to bundled content:', err?.message || err)
    }
  }
  cache = { ...bundled, source: 'bundled' }
  return cache
}

export function getContentSync() {
  return { ...bundled, source: 'bundled' }
}

export const clusters = bundled.clusters || []
