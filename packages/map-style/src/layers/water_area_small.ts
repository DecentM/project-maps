import type { StyleConfig } from '..'

export const water_area_small = (config: StyleConfig) => ({
  source: 'vector',
  id: 'water-area-small',
  type: 'fill',
  'source-layer': 'water_polygons',
  filter: ['in', 'kind', 'reservoir', 'basin', 'dock'],
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
