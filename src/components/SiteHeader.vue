<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <header class="site-header">
    <div class="container">
      <RouterLink to="/" class="brand">
        <span class="logo">🚀</span>
        <span>Launchpad</span>
      </RouterLink>
      <nav class="nav">
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/start-here">Start Here</RouterLink>
        <RouterLink to="/about">About</RouterLink>
        <RouterLink to="/#domains" class="btn btn-primary">Explore domains</RouterLink>
      </nav>
    </div>
  </header>
</template>
