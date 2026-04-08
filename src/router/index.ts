import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import StatsHomeView from '../views/StatsHomeView.vue'
import ANSHomeView from '../views/ANSHomeView.vue'
import NotFoundView from '../views/NotFoundView.vue'

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/stats', name: 'stats', component: StatsHomeView },
  { path: '/ans', name: 'ans', component: ANSHomeView },
  { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFoundView },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
