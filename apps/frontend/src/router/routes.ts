import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/:zoom?/:lng?/:lat?',
    component: () => import('layouts/map-layout.vue'),
    children: [{ path: '', component: () => import('pages/index-page.vue') }],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/error-not-found.vue'),
  },
]

if (process.env.NODE_ENV === 'development') {
  routes.push({
    path: '/dev',
    component: () => import('pages/dev.vue'),
  })
}

export default routes
