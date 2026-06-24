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
</script>

<template>
  <section class="hero">
    <div class="container">
      <p class="eyebrow">A beginner's launchpad</p>
      <h1>Find the field that fits you — and where to start.</h1>
      <p class="lede">
        A calm map of {{ domains.length }} tech, engineering and creative domains: what each one
        really is, who it's for, a clear roadmap, and the best free ways to learn it.
      </p>
      <div class="hero-actions">
        <RouterLink to="/start-here" class="btn btn-primary">Start here</RouterLink>
        <a href="#domains" class="btn-text">Browse all domains →</a>
      </div>
      <p class="hero-meta">
        <b>{{ domains.length }}</b> domains · <b>{{ totalResources }}+</b> free resources, link-checked ·
        <b>{{ clusters.length }}</b> clusters
      </p>
    </div>
  </section>

  <section class="section" id="domains">
    <div class="container">
      <div class="section-head">
        <h2>Explore the domains</h2>
        <p>Search by keyword, or filter by cluster. Open any card for the full beginner guide.</p>
      </div>

      <div class="filterbar">
        <input class="search-input" v-model="query" type="search" placeholder="Search domains, tools, keywords…" />
        <button class="chip" :class="{ active: activeCluster === 'all' }" @click="activeCluster = 'all'">All</button>
        <button v-for="c in clusters" :key="c" class="chip" :class="{ active: activeCluster === c }" @click="activeCluster = c">{{ c }}</button>
      </div>

      <div v-if="!filtered.length" class="callout muted">No domains match “{{ query }}”. Try a broader keyword.</div>

      <div v-for="g in grouped" :key="g.cluster" class="cluster-group">
        <div class="cg-head">
          <span class="dot" :class="clusterKey(g.cluster)"></span>
          <h3>{{ g.cluster }}</h3>
          <span class="cg-count">{{ g.items.length }}</span>
        </div>
        <div class="grid grid-cards">
          <DomainCard v-for="d in g.items" :key="d.slug" :domain="d" />
        </div>
      </div>
    </div>
  </section>

  <section class="section section-alt" v-if="(guide.starterTracks || []).length">
    <div class="container">
      <div class="section-head">
        <h2>Starter tracks</h2>
        <p>Each starter track bundles a few domains that go well together, so you build momentum instead of jumping around.</p>
      </div>
      <div class="grid" style="grid-template-columns:repeat(auto-fill,minmax(320px,1fr))">
        <div class="track" v-for="(t, i) in guide.starterTracks" :key="i">
          <h3>{{ t.name }}</h3>
          <p class="tt" v-if="t.tagline">{{ t.tagline }}</p>
          <div class="track-domains">
            <RouterLink v-for="d in trackDomains(t.domains)" :key="d.slug" :to="`/domain/${d.slug}`" class="tag">{{ d.name }}</RouterLink>
          </div>
          <p style="color:var(--body);margin:0;font-size:0.92rem" v-if="t.why">{{ t.why }}</p>
        </div>
      </div>
    </div>
  </section>

  <section class="section" v-if="(guide.universalFreeResources || []).length">
    <div class="container narrow">
      <div class="section-head">
        <h2>Free resources for everything</h2>
        <p>These help no matter which domain you pick — good places to build core habits and fundamentals.</p>
      </div>
      <ResourceList :items="guide.universalFreeResources" />
    </div>
  </section>

  <section class="section section-alt" v-if="(guide.firstSevenDays || []).length">
    <div class="container narrow">
      <div class="section-head">
        <h2>Your first 7 days</h2>
        <p>A small, doable plan to get unstuck and feel real progress this week.</p>
      </div>
      <ol class="numbered">
        <li v-for="(d, i) in guide.firstSevenDays" :key="i">{{ d }}</li>
      </ol>
      <div style="margin-top:28px">
        <RouterLink to="/start-here" class="btn btn-primary">Read the full Start-here guide</RouterLink>
      </div>
    </div>
  </section>
</template>
