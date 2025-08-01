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
          Sidebar: () => import('src/map/pages/index.vue'),
          Toolbar: () => import('src/map/components/top-bar/search-bar.vue'),
          Footer: () => import('src/map/layout/footer/map-footer.vue'),
        },
      },
      {
        name: 'DetailsPage',
        path: 'details/:id',
        components: {
          Sidebar: () => import('src/map/pages/details/details.vue'),
          Toolbar: () => import('src/map/layout/toolbar/map-toolbar.vue'),
          Footer: () => import('src/map/layout/footer/map-footer.vue'),
        },
      },
      {
        name: 'GalleryPage',
        path: 'details/:id/gallery/:index?',
        components: {
          default: () => import('src/map/pages/details/gallery/gallery.vue'),
          Sidebar: () => import('src/map/pages/details/details.vue'),
          Toolbar: () => import('src/map/layout/toolbar/map-toolbar.vue'),
        },
      },
    ],
  },
]
