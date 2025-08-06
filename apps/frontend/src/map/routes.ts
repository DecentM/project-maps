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
          Toolbar: () => import('src/map/components/top-bar/search-bar.vue'),
          Footer: () => import('src/map/layout/footer/map-footer.vue'),
        },
      },
      {
        name: 'DetailsPage',
        path: 'details/:type/:id',
        components: {
          Sidebar: () => import('src/map/pages/details/details-page.vue'),
          Toolbar: () => import('src/map/layout/toolbar/map-toolbar.vue'),
          Footer: () => import('src/map/layout/footer/map-footer.vue'),
        },
      },
      {
        name: 'GalleryPage',
        path: 'details/:type/:id/gallery/:index?',
        components: {
          default: () => import('src/map/pages/details/gallery/gallery-page.vue'),
          Sidebar: () => import('src/map/pages/details/details-page.vue'),
          Toolbar: () => import('src/map/layout/toolbar/map-toolbar.vue'),
        },
      },
    ],
  },
]
