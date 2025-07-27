import type { RouteRecordRaw } from 'vue-router'

export const mapRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('src/map/layout/map-layout.vue'),
    children: [
      {
        name: 'IndexPage',
        path: '',
        components: {
          Sidebar: () => import('src/map/pages/index-page.vue'),
          Topbar: () => import('src/shared/components/search-bar/fake-search-bar.vue'),
        },
      },
      {
        name: 'DetailsPage',
        path: '/details/:id',
        components: {
          Sidebar: () => import('src/map/pages/details-page.vue'),
          Topbar: () => import('src/shared/components/search-bar/fake-search-bar.vue'),
        },
      },
      {
        name: 'SearchPage',
        path: '/search',
        components: {
          Sidebar: () => import('src/map/pages/search-page.vue'),
          Topbar: () => import('src/shared/components/search-bar/search-bar.vue'),
        },
      },
    ],
  },
]
