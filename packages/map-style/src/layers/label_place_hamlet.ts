import type { StyleConfig } from '..'

export const label_place_hamlet = (config: StyleConfig) => ({
  source: 'vector',
  id: 'label-place-hamlet',
  type: 'symbol',
  'source-layer': 'place_labels',
  filter: ['==', 'kind', 'hamlet'],
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
        [10, 11],
        [12, 14],
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
  minzoom: 13,
})
