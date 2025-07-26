import type { StyleConfig } from '..'

export const street_pedestrian_zone = (config: StyleConfig) => ({
  source: 'vector',
  id: 'street-pedestrian-zone',
  type: 'fill',
  'source-layer': 'street_polygons',
  filter: ['all', ['!=', 'bridge', true], ['!=', 'tunnel', true], ['==', 'kind', 'pedestrian']],
  paint: {
    'fill-color': 'rgba(251,235,255,0.25)',
    'fill-opacity': {
      stops: [
        [12, 0],
        [13, 1],
        [14, 0],
        [15, 1],
      ],
    },
  },
})
