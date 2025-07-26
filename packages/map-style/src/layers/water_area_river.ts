import type { StyleConfig } from '..'

export const water_area_river = (config: StyleConfig) => ({
  source: 'vector',
  id: 'water-area-river',
  type: 'fill',
  'source-layer': 'water_polygons',
  filter: ['==', 'kind', 'river'],
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
