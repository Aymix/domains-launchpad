<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <header class="site-header">
    <div class="container">
      <RouterLink to="/" class="brand">
        <span class="logo">L</span>
        <span>Launchpad</span>
      </RouterLink>
      <nav class="nav">
        <RouterLink to="/" class="hide-sm">Home</RouterLink>
        <RouterLink to="/start-here">Start here</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div>
  </header>
</template>
