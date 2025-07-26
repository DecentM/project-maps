import type { StyleConfig } from '..'

export const label_place_capital = (config: StyleConfig) => ({
  source: 'vector',
  id: 'label-place-capital',
  type: 'symbol',
  'source-layer': 'place_labels',
  filter: ['==', 'kind', 'capital'],
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
      stops: [
        [5, 12],
        [10, 16],
      ],
    },
  },
  paint: {
    'icon-color': 'rgb(40,48,73)',
    'text-color': 'rgb(40,48,73)',
    'text-halo-color': 'rgba(255,255,255,0.8)',
    'text-halo-width': 2,
    'text-halo-blur': 1,
  },
  minzoom: 5,
})
