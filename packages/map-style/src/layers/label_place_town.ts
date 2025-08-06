import type { StyleConfig } from '..'

export const label_place_town = (config: StyleConfig) => ({
  source: 'vector',
  id: 'label-place-town',
  type: 'symbol',
  'source-layer': 'place_labels',
  filter: ['==', 'kind', 'town'],
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
      stops: [
        [8, 11],
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
  minzoom: 9,
})
