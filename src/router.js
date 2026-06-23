import { createRouter, createWebHistory } from 'vue-router'
import Home from './views/Home.vue'
import DomainDetail from './views/DomainDetail.vue'
import StartHere from './views/StartHere.vue'
import About from './views/About.vue'
import NotFound from './views/NotFound.vue'

const routes = [
  { path: '/', name: 'home', component: Home, meta: { title: 'Launchpad - Explore Tech, Engineering & Creative Domains' } },
  { path: '/start-here', name: 'start-here', component: StartHere, meta: { title: 'Start Here - How to choose & where to begin' } },
  { path: '/domain/:slug', name: 'domain', component: DomainDetail, props: true },
  { path: '/about', name: 'about', component: About, meta: { title: 'About this guide' } },
  { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFound },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, behavior: 'smooth', top: 80 }
    return { top: 0 }
  },
})

router.afterEach((to) => {
  const base = "Launchpad"
  document.title = to.meta?.title ? to.meta.title : base
})

export default router
