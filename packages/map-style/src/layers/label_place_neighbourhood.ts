import type { StyleConfig } from '..'

export const label_place_neighbourhood = (config: StyleConfig) => ({
  source: 'vector',
  id: 'label-place-neighbourhood',
  type: 'symbol',
  'source-layer': 'place_labels',
  filter: ['==', 'kind', 'neighbourhood'],
  layout: {
    'text-field': [
      'coalesce',
      ['get', 'name_int'],
      ['get', 'name_en'],
      ['get', 'name:latin'],
      ['get', 'name'],
    ],
    'text-font': ['Noto Sans Regular'],
    'text-size': {
      stops: [[14, 12]],
    },
    'text-transform': 'uppercase',
  },
  paint: {
    'icon-color': 'rgb(40,67,73)',
    'text-color': 'rgb(40,67,73)',
    'text-halo-color': 'rgba(255,255,255,0.8)',
    'text-halo-width': 2,
    'text-halo-blur': 1,
  },
  minzoom: 14,
})
