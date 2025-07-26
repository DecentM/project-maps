import type { StyleConfig } from '..'

export const land_residential = (config: StyleConfig) => ({
  source: 'vector',
  id: 'land-residential',
  type: 'fill',
  'source-layer': 'land',
  filter: ['all', ['in', 'kind', 'garages', 'residential']],
  paint: {
    'fill-color': 'rgba(234,230,225,0.2)',
    'fill-opacity': {
      stops: [
        [10, 0],
        [11, 1],
      ],
    },
  },
})
