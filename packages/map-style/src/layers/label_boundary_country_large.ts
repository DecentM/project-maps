import type { StyleConfig } from '..'

export const label_boundary_country_large = (config: StyleConfig) => ({
  source: 'vector',
  id: 'label-boundary-country-large',
  type: 'symbol',
  'source-layer': 'boundary_labels',
  filter: ['all', ['in', 'admin_level', 2, '2'], ['>=', 'way_area', 90000000]],
  layout: {
    'text-field': '{name_en}',
    'text-font': ['Noto Sans Regular'],
    'text-transform': 'uppercase',
    'text-anchor': 'top',
    'text-offset': [0, 0.2],
    'text-padding': 0,
    'text-optional': true,
    'text-size': {
      stops: [
        [2, 8],
        [5, 13],
      ],
    },
  },
  paint: {
    'icon-color': 'rgb(51,51,68)',
    'text-color': 'rgb(51,51,68)',
    'text-halo-color': 'rgba(255,255,255,0.8)',
    'text-halo-width': 2,
    'text-halo-blur': 1,
  },
  minzoom: 2,
})
