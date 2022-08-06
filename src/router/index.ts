import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    component: () => import('../views/json-to-table.vue'),
    name: 'json-to-table',
    path: '/json-to-table'
  },
  {
    component: () => import('../views/time-data-chart.vue'),
    name: 'time-data-chart',
    path: '/time-data-chart'
  },
  {
    component: () => import('../views/hex-ieee754.vue'),
    name: 'hex-ieee754',
    path: '/hex-ieee754'
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
