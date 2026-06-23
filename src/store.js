import { reactive } from 'vue'
import { getContent } from './butter.js'

export const store = reactive({
  loaded: false,
  loading: false,
  content: null,
  source: 'bundled',
})

let pending = null

export function loadKB() {
  if (store.loaded) return Promise.resolve(store.content)
  if (pending) return pending
  store.loading = true
  pending = getContent().then((c) => {
    store.content = c
    store.source = c.source || 'bundled'
    store.loaded = true
    store.loading = false
    return c
  })
  return pending
}

export function findDomain(slug) {
  if (!store.content) return null
  return (store.content.domains || []).find((d) => d.slug === slug) || null
}
