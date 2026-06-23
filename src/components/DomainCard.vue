<script setup>
import { RouterLink } from 'vue-router'
import { clusterClass, resourceCount } from '../lib.js'

const props = defineProps({ domain: { type: Object, required: true } })
</script>

<template>
  <RouterLink :to="`/domain/${domain.slug}`" class="card domain-card" :class="clusterClass(domain.cluster)">
    <div class="top">
      <span class="ic">{{ domain.icon || '📘' }}</span>
      <h3>{{ domain.name }}</h3>
    </div>
    <p class="tagline">{{ domain.tagline }}</p>
    <div class="foot">
      <span class="cluster-tag">{{ domain.cluster }}</span>
      <span class="arrow">Open →</span>
    </div>
  </RouterLink>
</template>
