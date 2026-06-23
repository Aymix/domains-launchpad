<script setup>
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import SiteHeader from './components/SiteHeader.vue'
import SiteFooter from './components/SiteFooter.vue'
import { loadKB, store } from './store.js'

const route = useRoute()
onMounted(() => loadKB())
</script>

<template>
  <SiteHeader />
  <main>
    <RouterView v-if="store.loaded" v-slot="{ Component }">
      <component :is="Component" :key="route.fullPath" />
    </RouterView>
    <div v-else class="container" style="padding:120px 0;text-align:center;color:var(--text-muted)">
      Loading the knowledge base…
    </div>
  </main>
  <SiteFooter />
</template>
