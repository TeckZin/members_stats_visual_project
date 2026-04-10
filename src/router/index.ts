import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import StatsDashboardView from '../views/StatsDashboardView.vue'
import StatsDataManager from '../views/StatsDataManagerView.vue'
import AdminView from '../views/AdminView.vue'
import DocsView from '../views/DocsView.vue'
import ANSHomeView from '../views/ANSHomeView.vue'
import NotFoundView from '../views/NotFoundView.vue'
import AuthView from '../views/AuthView.vue'
import VerifyEmailView from '../views/VerifyEmailView.vue'
import AccountView from '../views/AccountView.vue'

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/stats', redirect: '/stats/dashboard' },
  { path: '/stats/dashboard', name: 'stats-dashboard', component: StatsDashboardView },
  { path: '/stats/data-manager', name: 'stats-demographic', component: StatsDataManager },
  { path: '/admin', name: 'admin', component: AdminView },
  { path: '/docs', name: 'docs', component: DocsView },
  { path: '/ans', name: 'ans', component: ANSHomeView },
  { path: '/auth', name: 'auth', component: AuthView },
  { path: '/auth/verify-email', name: 'verify-email', component: VerifyEmailView },
  { path: '/account', name: 'account', component: AccountView },
  { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFoundView },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
