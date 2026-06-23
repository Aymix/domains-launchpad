<script setup>
const props = defineProps({
  items: { type: Array, default: () => [] },
})

function title(it) { return it.title || it.name || 'Untitled' }
function note(it) { return it.note || it.whyGood || '' }
function meta(it) {
  const bits = []
  if (it.provider) bits.push(it.provider)
  if (it.level) bits.push(it.level)
  return bits.join(' · ')
}
function host(url) {
  if (!url) return ''
  try { return new URL(url).hostname.replace(/^www\./, '') } catch { return '' }
}
</script>

<template>
  <div class="res-list">
    <component
      :is="it.url ? 'a' : 'div'"
      v-for="(it, i) in items"
      :key="i"
      class="res-item"
      :href="it.url || undefined"
      :target="it.url ? '_blank' : undefined"
      :rel="it.url ? 'noopener' : undefined"
    >
      <span class="rdot"></span>
      <div class="rmain">
        <div class="rtitle">{{ title(it) }}</div>
        <div class="rmeta" v-if="meta(it) || host(it.url)">
          <template v-if="meta(it)">{{ meta(it) }}<template v-if="host(it.url)"> · </template></template>
          <template v-if="host(it.url)">{{ host(it.url) }}</template>
        </div>
        <div class="rnote" v-if="note(it)">{{ note(it) }}</div>
      </div>
      <span class="badge" v-if="it.level">{{ it.level }}</span>
    </component>
  </div>
</template>
