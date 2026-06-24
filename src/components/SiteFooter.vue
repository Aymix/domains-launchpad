<script setup>
import { RouterLink } from 'vue-router'
import { store } from '../store.js'
</script>

<template>
  <footer class="site-footer">
    <div class="container fcols">
      <div>
        <div class="brand" style="margin-bottom:12px"><span class="logo">L</span><span>Launchpad</span></div>
        <p class="muted">A calm, beginner-first map of tech, engineering and creative fields — what each one is, where to start, and the best free ways to learn it.</p>
        <p class="muted" style="font-size:0.8rem;margin-top:8px">Content: {{ store.source === 'buttercms' ? 'ButterCMS (live)' : 'bundled snapshot' }}</p>
      </div>
      <div>
        <div class="feyebrow">Explore</div>
        <p><RouterLink to="/">All domains</RouterLink></p>
        <p><RouterLink to="/start-here">Start here</RouterLink></p>
        <p><RouterLink to="/about">About</RouterLink></p>
      </div>
      <div>
        <div class="feyebrow">Built with</div>
        <p><a href="https://buttercms.com/docs/frameworks/starter-projects/vue" target="_blank" rel="noopener">ButterCMS + Vue</a></p>
        <p><a href="https://vuejs.org" target="_blank" rel="noopener">Vue 3 &amp; Vite</a></p>
      </div>
    </div>
  </footer>
</template>
