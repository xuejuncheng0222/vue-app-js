import { createMemoryHistory, createRouter } from 'vue-router'

import HomeView from '../components/HelloWorld.vue'
import Table from '../views/TableTest.vue'
import TransformationType from '../views/TransformationType.vue'

const routes = [
  { path: '/', redirect: '/trans' },
  { path: '/home', component: HomeView },
  { path: '/table', component: Table },
  { path: '/trans', component: TransformationType },
]

const router = createRouter({
  history: createMemoryHistory(),
  routes,
})

export default router
