import type { StyleConfig } from '..'

export const label_place_quarter = (config: StyleConfig) => ({
  source: 'vector',
  id: 'label-place-quarter',
  type: 'symbol',
  'source-layer': 'place_labels',
  filter: ['==', 'kind', 'quarter'],
  layout: {
    'text-field': [
      'coalesce',
      ['get', 'name_int'],
      ['get', 'name_en'],
      ['get', 'name:latin'],
      ['get', 'name'],
    ],
    'text-font': ['NotoSans-Regular'],
    'text-size': {
      stops: [[13, 13]],
    },
    'text-transform': 'uppercase',
  },
  paint: {
    'icon-color': 'rgb(40,62,73)',
    'text-color': 'rgb(40,62,73)',
    'text-halo-color': 'rgba(255,255,255,0.8)',
    'text-halo-width': 2,
    'text-halo-blur': 1,
  },
  minzoom: 13,
})
