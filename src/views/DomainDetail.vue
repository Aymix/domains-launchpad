<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { RouterLink } from 'vue-router'
import { findDomain } from '../store.js'
import { clusterKey } from '../lib.js'
import Prose from '../components/Prose.vue'
import Roadmap from '../components/Roadmap.vue'
import ResourceList from '../components/ResourceList.vue'

const props = defineProps({ slug: { type: String, required: true } })
const domain = computed(() => findDomain(props.slug))

const SECTIONS = [
  { id: 'overview', label: 'Overview', has: (d) => d.overview },
  { id: 'why', label: 'Why it matters', has: (d) => d.whyItMatters },
  { id: 'fit', label: 'Is it for you?', has: (d) => d.isItForYou },
  { id: 'roadmap', label: 'Learning roadmap', has: (d) => d.roadmap && d.roadmap.length },
  { id: 'concepts', label: 'Core concepts', has: (d) => d.coreConcepts && d.coreConcepts.length },
  { id: 'tools', label: 'Tools & tech', has: (d) => d.toolsAndTech && d.toolsAndTech.length },
  { id: 'courses', label: 'Free courses', has: (d) => d.freeCourses && d.freeCourses.length },
  { id: 'youtube', label: 'YouTube channels', has: (d) => d.youtubeChannels && d.youtubeChannels.length },
  { id: 'articles', label: 'Articles & docs', has: (d) => d.articlesAndDocs && d.articlesAndDocs.length },
  { id: 'practice', label: 'Practice', has: (d) => d.interactivePractice && d.interactivePractice.length },
  { id: 'communities', label: 'Communities', has: (d) => d.communities && d.communities.length },
  { id: 'projects', label: 'Project ideas', has: (d) => d.projectIdeas && d.projectIdeas.length },
  { id: 'careers', label: 'Careers', has: (d) => (d.careerPaths && d.careerPaths.length) || d.timeToJobReady },
  { id: 'mistakes', label: 'Common mistakes', has: (d) => d.commonMistakes && d.commonMistakes.length },
  { id: 'glossary', label: 'Glossary', has: (d) => d.glossary && d.glossary.length },
  { id: 'related', label: 'Related domains', has: (d) => d.relatedDomains && d.relatedDomains.length },
]

const toc = computed(() => (domain.value ? SECTIONS.filter((s) => s.has(domain.value)) : []))
const related = computed(() => (domain.value?.relatedDomains || []).map((s) => findDomain(s)).filter(Boolean))

const active = ref('overview')
let observer = null

onMounted(async () => {
  await nextTick()
  const els = toc.value.map((s) => document.getElementById(s.id)).filter(Boolean)
  if (!('IntersectionObserver' in window) || !els.length) return
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) active.value = e.target.id
      })
    },
    { rootMargin: '-80px 0px -68% 0px', threshold: 0 }
  )
  els.forEach((el) => observer.observe(el))
})
onBeforeUnmount(() => observer && observer.disconnect())
</script>

<template>
  <div v-if="!domain" class="container narrow" style="padding:100px 0;text-align:center">
    <h1>Domain not found</h1>
    <p><RouterLink to="/">← Back to all domains</RouterLink></p>
  </div>

  <template v-else>
    <section class="detail-hero">
      <div class="container narrow">
        <p class="crumb"><RouterLink to="/">← All domains</RouterLink></p>
        <div class="cluster-line"><span class="dot" :class="clusterKey(domain.cluster)"></span>{{ domain.cluster }}</div>
        <div class="head">
          <span class="ic">{{ domain.icon }}</span>
          <h1>{{ domain.name }}</h1>
        </div>
        <p class="lede">{{ domain.tagline }}</p>
        <p v-if="domain.prerequisites && domain.prerequisites.length" style="color:var(--muted);font-size:0.9rem;margin-top:12px">
          Nice to have first: {{ domain.prerequisites.slice(0, 3).join(' · ') }}
        </p>
      </div>
    </section>

    <section class="section" style="padding-top:28px">
      <div class="container detail">
        <div class="detail-body">
          <section id="overview" v-if="domain.overview">
            <h2>Overview</h2>
            <Prose :text="domain.overview" />
          </section>

          <section id="why" v-if="domain.whyItMatters">
            <h2>Why it matters</h2>
            <Prose :text="domain.whyItMatters" />
          </section>

          <section id="fit" v-if="domain.isItForYou">
            <h2>Is this for you?</h2>
            <Prose :text="domain.isItForYou" />
          </section>

          <section id="roadmap" v-if="domain.roadmap && domain.roadmap.length">
            <h2>Learning roadmap</h2>
            <Roadmap :stages="domain.roadmap" />
          </section>

          <section id="concepts" v-if="domain.coreConcepts && domain.coreConcepts.length">
            <h2>Core concepts</h2>
            <div class="def-grid">
              <div class="def" v-for="(c, i) in domain.coreConcepts" :key="i">
                <div class="t">{{ c.name }}</div>
                <div class="d">{{ c.what }}</div>
              </div>
            </div>
          </section>

          <section id="tools" v-if="domain.toolsAndTech && domain.toolsAndTech.length">
            <h2>Tools &amp; technologies</h2>
            <div class="taglist">
              <span class="tag" v-for="(t, i) in domain.toolsAndTech" :key="i">{{ t }}</span>
            </div>
          </section>

          <section id="courses" v-if="domain.freeCourses && domain.freeCourses.length">
            <h2>Free courses</h2>
            <ResourceList :items="domain.freeCourses" />
          </section>

          <section id="youtube" v-if="domain.youtubeChannels && domain.youtubeChannels.length">
            <h2>YouTube channels</h2>
            <ResourceList :items="domain.youtubeChannels" />
          </section>

          <section id="articles" v-if="domain.articlesAndDocs && domain.articlesAndDocs.length">
            <h2>Articles, docs &amp; sites</h2>
            <ResourceList :items="domain.articlesAndDocs" />
          </section>

          <section id="practice" v-if="domain.interactivePractice && domain.interactivePractice.length">
            <h2>Practice &amp; playgrounds</h2>
            <ResourceList :items="domain.interactivePractice" />
          </section>

          <section id="communities" v-if="domain.communities && domain.communities.length">
            <h2>Communities</h2>
            <ResourceList :items="domain.communities" />
          </section>

          <section id="projects" v-if="domain.projectIdeas && domain.projectIdeas.length">
            <h2>Project ideas</h2>
            <div class="proj-grid">
              <div class="proj" v-for="(p, i) in domain.projectIdeas" :key="i">
                <div class="t">
                  <span>{{ p.title }}</span>
                  <span v-if="p.difficulty" class="badge">{{ p.difficulty }}</span>
                </div>
                <div class="d">{{ p.what }}</div>
              </div>
            </div>
          </section>

          <section id="careers" v-if="(domain.careerPaths && domain.careerPaths.length) || domain.timeToJobReady">
            <h2>Careers</h2>
            <div class="callout" v-if="domain.timeToJobReady">
              <div class="ct">How long to get job-ready?</div>
              <div>Roughly <b>{{ domain.timeToJobReady }}</b> of consistent, project-based learning — everyone's pace differs.</div>
            </div>
            <div class="taglist" v-if="domain.careerPaths && domain.careerPaths.length">
              <span class="tag" v-for="(c, i) in domain.careerPaths" :key="i">{{ c }}</span>
            </div>
          </section>

          <section id="mistakes" v-if="domain.commonMistakes && domain.commonMistakes.length">
            <h2>Common beginner mistakes</h2>
            <ul class="mistakes">
              <li v-for="(m, i) in domain.commonMistakes" :key="i">{{ m }}</li>
            </ul>
          </section>

          <section id="glossary" v-if="domain.glossary && domain.glossary.length">
            <h2>Glossary</h2>
            <div class="def-grid">
              <div class="def" v-for="(g, i) in domain.glossary" :key="i">
                <div class="t">{{ g.term }}</div>
                <div class="d">{{ g.definition }}</div>
              </div>
            </div>
          </section>

          <section id="related" v-if="related.length">
            <h2>Related domains</h2>
            <div class="related-grid">
              <RouterLink v-for="d in related" :key="d.slug" :to="`/domain/${d.slug}`" class="related">
                <span class="ic">{{ d.icon }}</span>
                <span>{{ d.name }}</span>
              </RouterLink>
            </div>
          </section>

          <div v-if="domain.verificationNotes && domain.verificationNotes.length" style="margin-top:32px">
            <details>
              <summary>Resource verification notes</summary>
              <ul style="color:var(--muted);font-size:0.86rem;margin-top:8px">
                <li v-for="(n, i) in domain.verificationNotes" :key="i">{{ n }}</li>
              </ul>
            </details>
          </div>
        </div>

        <aside class="toc">
          <div class="toc-label">On this page</div>
          <ul>
            <li v-for="s in toc" :key="s.id">
              <a :href="`#${s.id}`" :class="{ active: active === s.id }">{{ s.label }}</a>
            </li>
          </ul>
        </aside>
      </div>
    </section>
  </template>
</template>
