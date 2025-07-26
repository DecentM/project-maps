import type { StyleConfig } from '..'

export const water_area = (config: StyleConfig) => ({
  source: 'vector',
  id: 'water-area',
  type: 'fill',
  'source-layer': 'water_polygons',
  filter: ['==', 'kind', 'water'],
  paint: {
    'fill-color': 'rgb(190,221,243)',
    'fill-opacity': {
      stops: [
        [4, 0],
        [6, 1],
      ],
    },
  },
})
