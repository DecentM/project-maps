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

export default routes
