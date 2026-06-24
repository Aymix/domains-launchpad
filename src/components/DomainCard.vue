<script setup>
import { RouterLink } from 'vue-router'
import { clusterKey, clusterShort, resourceCount } from '../lib.js'

const props = defineProps({ domain: { type: Object, required: true } })
</script>

<template>
  <RouterLink :to="`/domain/${domain.slug}`" class="domain-card">
    <div class="top">
      <span class="ic">{{ domain.icon || '•' }}</span>
      <h3>{{ domain.name }}</h3>
    </div>
    <p class="tagline">{{ domain.tagline }}</p>
    <div class="foot">
      <span class="cluster"><span class="dot" :class="clusterKey(domain.cluster)"></span>{{ clusterShort(domain.cluster) }}</span>
      <span class="count">{{ resourceCount(domain) }} resources</span>
    </div>
  </RouterLink>
</template>
