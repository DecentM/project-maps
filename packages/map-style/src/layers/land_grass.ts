import type { StyleConfig } from '..'

export const land_grass = (config: StyleConfig) => ({
  source: 'vector',
  id: 'land-grass',
  type: 'fill',
  'source-layer': 'land',
  filter: ['all', ['in', 'kind', 'grass', 'grassland', 'meadow', 'wet_meadow']],
  paint: {
    'fill-color': 'rgb(216,232,200)',
    'fill-opacity': {
      stops: [
        [11, 0],
        [12, 1],
      ],
    },
  },
})
