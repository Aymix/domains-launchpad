<script setup>
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { store, findDomain } from '../store.js'
import DomainCard from '../components/DomainCard.vue'
import ResourceList from '../components/ResourceList.vue'
import { clusterKey, resourceCount } from '../lib.js'

const query = ref('')
const activeCluster = ref('all')

const content = computed(() => store.content || {})
const domains = computed(() => content.value.domains || [])
const clusters = computed(() => content.value.clusters || [])
const guide = computed(() => content.value.guide || {})
const totalResources = computed(() => domains.value.reduce((n, d) => n + resourceCount(d), 0))

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  return domains.value.filter((d) => {
    if (activeCluster.value !== 'all' && d.cluster !== activeCluster.value) return false
    if (!q) return true
    const hay = [d.name, d.tagline, d.overview, (d.toolsAndTech || []).join(' ')].join(' ').toLowerCase()
    return hay.includes(q)
  })
})

const grouped = computed(() =>
  clusters.value
    .map((c) => ({ cluster: c, items: filtered.value.filter((d) => d.cluster === c) }))
    .filter((g) => g.items.length)
)

function trackDomains(slugs) {
  return (slugs || []).map((s) => findDomain(s)).filter(Boolean)
}
function clusterBar(c) {
  return 'cl-bar-' + clusterKey(c)
}
</script>

<template>
  <section class="hero">
    <div class="container">
      <p class="eyebrow">A beginner's launchpad</p>
      <h1>Find the field that fits you — and exactly where to start.</h1>
      <p class="lede">
        A friendly map of {{ domains.length }} tech, engineering and creative domains. For each one:
        what it really is, who it's for, a step-by-step roadmap, and the best <b>free</b> courses,
        YouTube channels and communities to learn it.
      </p>
      <div class="hero-actions">
        <RouterLink to="/start-here" class="btn btn-primary">Start here — how to choose →</RouterLink>
        <a href="#domains" class="btn btn-ghost">Browse all domains</a>
      </div>
      <div class="hero-stats">
        <div class="stat"><div class="n">{{ domains.length }}</div><div class="l">domains explained</div></div>
        <div class="stat"><div class="n">{{ clusters.length }}</div><div class="l">big-picture clusters</div></div>
        <div class="stat"><div class="n">{{ totalResources }}+</div><div class="l">free resources, link-checked</div></div>
        <div class="stat"><div class="n">100%</div><div class="l">free to learn</div></div>
      </div>
    </div>
  </section>

  <section class="section" id="domains">
    <div class="container">
      <div class="section-head">
        <h2>Explore the domains</h2>
        <p>Search by keyword, or filter by the three big clusters. Click any card for the full beginner guide.</p>
      </div>

      <div class="filterbar">
        <input class="search-input" v-model="query" type="search" placeholder="Search domains, tools, keywords… (e.g. python, arduino, 3d)" />
        <button class="chip" :class="{ active: activeCluster === 'all' }" @click="activeCluster = 'all'">All</button>
        <button v-for="c in clusters" :key="c" class="chip" :class="{ active: activeCluster === c }" @click="activeCluster = c">{{ c }}</button>
      </div>

      <div v-if="!filtered.length" class="callout">No domains match “{{ query }}”. Try a broader keyword.</div>

      <div v-for="g in grouped" :key="g.cluster" class="cluster-group">
        <div class="cg-head">
          <span class="cg-bar" :class="clusterBar(g.cluster)"></span>
          <h3 style="margin:0">{{ g.cluster }}</h3>
          <span class="cluster-tag" :class="clusterKey(g.cluster)">{{ g.items.length }} fields</span>
        </div>
        <div class="grid grid-cards">
          <DomainCard v-for="d in g.items" :key="d.slug" :domain="d" />
        </div>
      </div>
    </div>
  </section>

  <section class="section section-soft" v-if="(guide.starterTracks || []).length">
    <div class="container">
      <div class="section-head">
        <h2>Not sure where to begin? Try a starter track</h2>
        <p>Each track bundles a few domains that naturally go together, so you build momentum instead of jumping around.</p>
      </div>
      <div class="grid" style="grid-template-columns:repeat(auto-fill,minmax(320px,1fr))">
        <div class="track" v-for="(t, i) in guide.starterTracks" :key="i">
          <h3>{{ t.name }}</h3>
          <p class="tt" v-if="t.tagline">{{ t.tagline }}</p>
          <div class="track-domains">
            <RouterLink v-for="d in trackDomains(t.domains)" :key="d.slug" :to="`/domain/${d.slug}`" class="tag">{{ d.icon }} {{ d.name }}</RouterLink>
          </div>
          <p style="color:var(--text-soft);margin:0" v-if="t.why">{{ t.why }}</p>
        </div>
      </div>
    </div>
  </section>

  <section class="section" v-if="(guide.universalFreeResources || []).length">
    <div class="container narrow">
      <div class="section-head">
        <h2>Free resources that help with everything</h2>
        <p>These work no matter which domain you pick — great places to build core habits and fundamentals.</p>
      </div>
      <ResourceList :items="guide.universalFreeResources" />
    </div>
  </section>

  <section class="section section-soft" v-if="(guide.firstSevenDays || []).length">
    <div class="container narrow">
      <div class="section-head">
        <h2>Your first 7 days</h2>
        <p>A tiny, doable plan to get unstuck and feel real progress this week.</p>
      </div>
      <ol class="numbered">
        <li v-for="(d, i) in guide.firstSevenDays" :key="i">{{ d }}</li>
      </ol>
      <div style="margin-top:24px">
        <RouterLink to="/start-here" class="btn btn-primary">Read the full Start Here guide →</RouterLink>
      </div>
    </div>
  </section>
</template>
