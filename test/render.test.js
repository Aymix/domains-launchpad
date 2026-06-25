import { describe, it, expect, beforeAll } from 'vitest'
import { mount } from '@vue/test-utils'
import kb from '../src/content/knowledge-base.json'
import { store } from '../src/store.js'
import Home from '../src/views/Home.vue'
import DomainDetail from '../src/views/DomainDetail.vue'
import StartHere from '../src/views/StartHere.vue'
import About from '../src/views/About.vue'

const RouterLinkStub = { props: ['to'], template: '<a :href="String(to)"><slot /></a>' }
const global = { stubs: { RouterLink: RouterLinkStub } }

beforeAll(() => {
  store.content = kb
  store.loaded = true
  store.source = 'bundled'
})

describe('content sanity', () => {
  it('has a full set of fully-formed domains', () => {
    expect(kb.domains.length).toBeGreaterThanOrEqual(18)
    for (const d of kb.domains) {
      expect(d.slug, 'slug').toBeTruthy()
      expect(d.name, `name ${d.slug}`).toBeTruthy()
      expect(d.overview, `overview ${d.slug}`).toBeTruthy()
      expect(d.roadmap?.length, `roadmap ${d.slug}`).toBeGreaterThan(0)
      expect(d.freeCourses?.length, `courses ${d.slug}`).toBeGreaterThan(0)
      expect(d.youtubeChannels?.length, `yt ${d.slug}`).toBeGreaterThan(0)
    }
  })
  it('every resource link is a real http(s) URL', () => {
    let count = 0
    for (const d of kb.domains) {
      for (const key of ['freeCourses', 'youtubeChannels', 'articlesAndDocs', 'interactivePractice', 'communities']) {
        for (const r of d[key] || []) {
          if (r.url) {
            expect(r.url, `${d.slug}.${key}`).toMatch(/^https?:\/\//)
            count++
          }
        }
      }
    }
    expect(count).toBeGreaterThan(300)
  })
  it('related-domain links resolve to existing slugs', () => {
    const slugs = new Set(kb.domains.map((d) => d.slug))
    for (const d of kb.domains) for (const r of d.relatedDomains || []) expect(slugs.has(r), `${d.slug} -> ${r}`).toBe(true)
  })
})

describe('Home view', () => {
  it('renders and lists every domain name', () => {
    const w = mount(Home, { global })
    const txt = w.text()
    expect(txt).toContain('Explore the domains')
    for (const d of kb.domains) expect(txt, d.slug).toContain(d.name)
  })
  it('renders starter tracks and universal resources', () => {
    const w = mount(Home, { global })
    const txt = w.text()
    expect(txt).toContain('starter track')
    expect(w.findAll('.domain-card').length).toBe(kb.domains.length)
  })
})

describe('DomainDetail view', () => {
  for (const slug of ['data-science', 'iot', 'game-development', 'mechanical-engineering', 'ar-vr-xr', 'embedded-systems']) {
    it(`renders ${slug} with roadmap + resources`, () => {
      const w = mount(DomainDetail, { props: { slug }, global })
      const txt = w.text()
      const d = kb.domains.find((x) => x.slug === slug)
      expect(txt).toContain(d.name)
      expect(txt).toContain('Learning roadmap')
      expect(txt).toContain('Free courses')
      expect(w.findAll('.res-item').length).toBeGreaterThan(5)
    })
  }
  it('handles an unknown slug gracefully', () => {
    const w = mount(DomainDetail, { props: { slug: 'nope' }, global })
    expect(w.text()).toContain('Domain not found')
  })
})

describe('StartHere + About views', () => {
  it('StartHere renders the guide', () => {
    const w = mount(StartHere, { global })
    expect(w.text()).toContain('How to choose')
  })
  it('About renders ButterCMS instructions', () => {
    const w = mount(About, { global })
    expect(w.text()).toContain('ButterCMS')
  })
})
