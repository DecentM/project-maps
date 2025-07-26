import type { StyleConfig } from '..'

export const label_street_primary = (config: StyleConfig) => ({
  source: 'vector',
  id: 'label-street-primary',
  type: 'symbol',
  'source-layer': 'street_labels',
  filter: ['==', 'kind', 'primary'],
  layout: {
    'text-field': [
      'coalesce',
      ['get', 'name_int'],
      ['get', 'name_en'],
      ['get', 'name:latin'],
      ['get', 'name'],
    ],
    'text-font': ['Noto Sans Regular'],
    'symbol-placement': 'line',
    'text-anchor': 'center',
    'text-size': {
      stops: [
        [12, 10],
        [15, 13],
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
  minzoom: 12,
})
