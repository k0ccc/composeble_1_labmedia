import { createMemoryHistory, createRouter } from 'vue-router'

import firstComposable from './pages/firstComposable.vue'
import secondComposable from './pages/secondComposable.vue'

const routes = [
  { path: '/first', component: firstComposable },
  { path: '/second', component: secondComposable },
]

const router = createRouter({
  history: createMemoryHistory(),
  routes,
})

export default router
