import type { StyleConfig } from '..'

export const water_dam_area = (config: StyleConfig) => ({
  source: 'vector',
  id: 'water-dam-area',
  type: 'fill',
  'source-layer': 'dam_polygons',
  filter: ['==', 'kind', 'dam'],
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
