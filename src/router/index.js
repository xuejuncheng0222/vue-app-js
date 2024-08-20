import { createWebHistory, createRouter } from 'vue-router'

import A from '../components/AA.vue'
import B from '../views/BB.vue'
import C from '../views/CC.vue'

const routes = [
  { path: '/', redirect: '/home' },
  { path: '/home', component: A },
  { path: '/b', component: B },
  { path: '/c', component: C },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
