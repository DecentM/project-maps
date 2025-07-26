import type { StyleConfig } from '..'

export const water_pier_area = (config: StyleConfig) => ({
  source: 'vector',
  id: 'water-pier-area',
  type: 'fill',
  'source-layer': 'pier_polygons',
  filter: ['in', 'kind', 'pier', 'breakwater', 'groyne'],
  paint: {
    'fill-color': 'rgb(249,244,238)',
    'fill-opacity': {
      stops: [
        [12, 0],
        [13, 1],
      ],
    },
  },
})
