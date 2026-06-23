<script setup>
const props = defineProps({ stages: { type: Array, default: () => [] } })
</script>

<template>
  <div class="roadmap">
    <div class="stage" v-for="(s, i) in stages" :key="i">
      <div class="stage-head">
        <span class="num">{{ i + 1 }}</span>
        <h3>{{ s.stage }}</h3>
      </div>
      <p class="goal" v-if="s.goal">🎯 {{ s.goal }}</p>
      <ol v-if="s.steps && s.steps.length">
        <li v-for="(step, j) in s.steps" :key="j">{{ step }}</li>
      </ol>
      <div class="milestone" v-if="s.milestoneProject">
        <b>Milestone project:</b> {{ s.milestoneProject }}
      </div>
    </div>
  </div>
</template>
