<script setup>
import { computed } from 'vue'
const props = defineProps({ text: { type: String, default: '' } })
const paras = computed(() =>
  String(props.text || '')
    .split(/\n{2,}/)
    .map((s) => s.trim())
    .filter(Boolean)
)
</script>

<template>
  <div class="prose">
    <p v-for="(p, i) in paras" :key="i">{{ p }}</p>
  </div>
</template>
