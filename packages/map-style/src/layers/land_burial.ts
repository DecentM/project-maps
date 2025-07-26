import type { StyleConfig } from '..'

export const land_burial = (config: StyleConfig) => ({
  source: 'vector',
  id: 'land-burial',
  type: 'fill',
  'source-layer': 'land',
  filter: ['all', ['in', 'kind', 'cemetery', 'grave_yard']],
  paint: {
    'fill-color': 'rgb(221,219,202)',
    'fill-opacity': {
      stops: [
        [13, 0],
        [14, 1],
      ],
    },
  },
})
