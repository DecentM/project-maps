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
          Topbar: () => import('src/map/components/top-bar/search-bar.vue'),
        },
      },
      {
        name: 'DetailsPage',
        path: '/details/:id',
        components: {
          Sidebar: () => import('src/map/pages/details-page.vue'),
          Topbar: () => import('src/map/components/top-bar/navigation-bar.vue'),
        },
      },
      {
        name: 'GalleryPage',
        path: '/gallery/:id/:index?',
        components: {
          Sidebar: () => import('src/map/pages/gallery-page.vue'),
        },
      },
    ],
  },
]
