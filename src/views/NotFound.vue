<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <section class="section">
    <div class="container narrow" style="text-align:center;padding:90px 0">
      <p class="eyebrow">404</p>
      <h1>This page doesn't exist</h1>
      <p style="color:var(--muted)">The link may be broken, or the page may have moved.</p>
      <RouterLink to="/" class="btn btn-primary" style="margin-top:8px">Back to the launchpad</RouterLink>
    </div>
  </section>
</template>
