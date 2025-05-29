import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/forklifts',
    name: 'forklifts',
    component: () => import('../views/ForkliftView.vue')
  },
  {
    path: '/downtimes',
    name: 'downtimes',
    component: () => import('../views/DowntimeView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router