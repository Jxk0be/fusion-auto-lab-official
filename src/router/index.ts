import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  { path: '/', name: 'home', component: () => import('@/pages/HomeView.vue') },
  { path: '/services', name: 'services', component: () => import('@/pages/ServicesView.vue') },
  {
    path: '/auto-mechanic-services',
    name: 'mechanic',
    component: () => import('@/pages/MechanicView.vue'),
  },
  { path: '/gallery', name: 'gallery', component: () => import('@/pages/GalleryView.vue') },
  { path: '/reviews', name: 'reviews', component: () => import('@/pages/ReviewsView.vue') },
  { path: '/faq', name: 'faq', component: () => import('@/pages/FaqView.vue') },
  { path: '/contact', name: 'contact', component: () => import('@/pages/ContactView.vue') },
  { path: '/payment', name: 'payment', component: () => import('@/pages/PaymentView.vue') },
  { path: '/privacy', name: 'privacy', component: () => import('@/pages/PrivacyView.vue') },
  { path: '/terms', name: 'terms', component: () => import('@/pages/TermsView.vue') },
  { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('@/pages/NotFoundView.vue') },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, top: 96, behavior: 'smooth' }
    return { top: 0 }
  },
})
