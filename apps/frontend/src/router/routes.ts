import type { RouteRecordRaw } from 'vue-router'

import { mapRoutes } from 'src/map/routes'

const routes: RouteRecordRaw[] = [
  ...mapRoutes,

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/error-not-found.vue'),
  },
]

export default routes
