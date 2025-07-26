import type { StyleConfig } from '..'

export const label_boundary_state = (config: StyleConfig) => ({
  source: 'vector',
  id: 'label-boundary-state',
  type: 'symbol',
  'source-layer': 'boundary_labels',
  filter: ['in', 'admin_level', 4, '4'],
  layout: {
    'text-field': [
      'coalesce',
      ['get', 'name_int'],
      ['get', 'name_en'],
      ['get', 'name:latin'],
      ['get', 'name'],
    ],
    'text-font': ['Noto Sans Regular'],
    'text-transform': 'uppercase',
    'text-anchor': 'top',
    'text-offset': [0, 0.2],
    'text-padding': 0,
    'text-optional': true,
    'text-size': {
      stops: [
        [5, 8],
        [8, 12],
      ],
    },
  },
  paint: {
    'icon-color': 'rgb(61,61,77)',
    'text-color': 'rgb(61,61,77)',
    'text-halo-color': 'rgba(255,255,255,0.8)',
    'text-halo-width': 2,
    'text-halo-blur': 1,
  },
  minzoom: 5,
})
