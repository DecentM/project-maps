import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/map-layout.vue'),
    children: [
      {
        name: 'IndexPage',
        path: '',
        component: () => import('pages/index-page.vue'),
      },
      {
        name: 'DetailsPage',
        path: '/details/:id',
        component: () => import('pages/details-page.vue'),
      },
      process.env.NODE_ENV === 'development'
        ? {
            name: 'DevPage',
            path: '/dev',
            component: () => import('pages/dev-page.vue'),
          }
        : null,
    ].filter((route) => route !== null),
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/error-not-found.vue'),
  },
]

export default routes
