<script setup>
import { RouterLink } from 'vue-router'
import { store } from '../store.js'
</script>

<template>
  <section class="hero" style="padding:56px 0 36px">
    <div class="container narrow">
      <p class="eyebrow">About</p>
      <h1>What this is &amp; how it was made</h1>
    </div>
  </section>

  <section class="section">
    <div class="container narrow prose">
      <p>
        <b>Launchpad</b> is a beginner-first guide for a student exploring what to study. It covers
        {{ (store.content && store.content.domains || []).length }} fields across software, hardware and
        creative tech — each with a plain-language overview, a step-by-step roadmap, and hand-picked
        <b>free</b> resources (courses, YouTube channels, docs, communities and project ideas).
      </p>

      <h2>How it was built</h2>
      <p>
        The content was produced with a multi-agent deep-research process: one researcher gathered and
        summarised each field, then a second pass fact-checked every resource link and YouTube channel to
        remove dead or invented links. A final editor wrote the cross-cutting “Start Here” guide.
      </p>
      <div class="callout warn">
        <div class="ct">A quick honesty note</div>
        Resources were auto-checked, but the web changes fast. If a link has moved, a quick search for the
        course or channel name will usually find its new home.
      </div>

      <h2>Built on ButterCMS + Vue</h2>
      <p>
        This site follows the
        <a href="https://buttercms.com/docs/frameworks/starter-projects/vue" target="_blank" rel="noopener">ButterCMS Vue starter</a>
        architecture. The domains map to a ButterCMS <b>Collection</b> and the Start-Here guide to a ButterCMS
        <b>Page</b>. Out of the box it renders a bundled snapshot of the content, so it always works — and you
        can switch to your own live ButterCMS account with one environment variable.
      </p>
      <h3>Connect your ButterCMS account</h3>
      <ol class="prose">
        <li>Create a free account at <a href="https://buttercms.com" target="_blank" rel="noopener">buttercms.com</a> and copy your <b>Read API token</b>.</li>
        <li>Set <code>VITE_BUTTER_TOKEN</code> in a <code>.env</code> file (see <code>.env.example</code>).</li>
        <li>Run <code>npm run seed:butter</code> with a <b>Write</b> token to push all content into your account, or recreate the collection/page in the dashboard.</li>
        <li>Rebuild — the site now reads live from ButterCMS, with the bundled snapshot as an automatic fallback.</li>
      </ol>

      <h2>Tech stack</h2>
      <div class="taglist">
        <span class="tag">Vue 3</span>
        <span class="tag">Vite</span>
        <span class="tag">Vue Router</span>
        <span class="tag">ButterCMS SDK</span>
        <span class="tag">Static / nginx</span>
        <span class="tag">Coolify</span>
      </div>

      <p style="margin-top:30px">
        <RouterLink to="/start-here" class="btn btn-primary">Start Here →</RouterLink>
      </p>
    </div>
  </section>
</template>
