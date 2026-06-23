<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { store, findDomain } from '../store.js'
import Prose from '../components/Prose.vue'
import ResourceList from '../components/ResourceList.vue'

const guide = computed(() => (store.content && store.content.guide) || {})
function trackDomains(slugs) {
  return (slugs || []).map((s) => findDomain(s)).filter(Boolean)
}
</script>

<template>
  <section class="hero" style="padding:56px 0 36px">
    <div class="container narrow">
      <p class="eyebrow">Start here</p>
      <h1>How to choose a direction — and actually begin</h1>
      <Prose v-if="guide.intro" :text="guide.intro" />
    </div>
  </section>

  <section class="section">
    <div class="container narrow">
      <div v-if="guide.howToChoose">
        <h2>🧭 How to choose a domain</h2>
        <Prose :text="guide.howToChoose" />
      </div>

      <div v-if="guide.domainMap" style="margin-top:36px">
        <h2>🗺️ How the domains connect</h2>
        <Prose :text="guide.domainMap" />
      </div>

      <div v-if="(guide.learningPrinciples || []).length" style="margin-top:36px">
        <h2>📐 Learning principles that always work</h2>
        <ul class="prose">
          <li v-for="(p, i) in guide.learningPrinciples" :key="i">{{ p }}</li>
        </ul>
      </div>
    </div>
  </section>

  <section class="section section-soft" v-if="(guide.starterTracks || []).length">
    <div class="container">
      <div class="section-head">
        <h2>Starter tracks</h2>
        <p>Themed bundles of domains that build on each other.</p>
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
      <h2>🆓 Universal free resources</h2>
      <p style="color:var(--text-soft)">Useful for every path on this site.</p>
      <ResourceList :items="guide.universalFreeResources" />
    </div>
  </section>

  <section class="section section-soft" v-if="(guide.firstSevenDays || []).length">
    <div class="container narrow">
      <h2>📅 Your first 7 days</h2>
      <ol class="numbered">
        <li v-for="(d, i) in guide.firstSevenDays" :key="i">{{ d }}</li>
      </ol>
    </div>
  </section>

  <section class="section" v-if="(guide.mindsetTips || []).length">
    <div class="container narrow">
      <h2>🌱 Mindset tips</h2>
      <ul class="prose">
        <li v-for="(t, i) in guide.mindsetTips" :key="i">{{ t }}</li>
      </ul>
      <div style="margin-top:24px">
        <RouterLink to="/#domains" class="btn btn-primary">Browse the domains →</RouterLink>
      </div>
    </div>
  </section>
</template>
