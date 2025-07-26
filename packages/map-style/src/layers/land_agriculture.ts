import type { StyleConfig } from '..'

export const land_agriculture = (config: StyleConfig) => ({
  source: 'vector',
  id: 'land-agriculture',
  type: 'fill',
  'source-layer': 'land',
  filter: [
    'all',
    [
      'in',
      'kind',
      'brownfield',
      'farmland',
      'farmyard',
      'greenfield',
      'greenhouse_horticulture',
      'orchard',
      'plant_nursery',
      'vineyard',
    ],
  ],
  paint: {
    'fill-color': 'rgb(240,231,209)',
    'fill-opacity': {
      stops: [
        [10, 0],
        [11, 1],
      ],
    },
  },
})
