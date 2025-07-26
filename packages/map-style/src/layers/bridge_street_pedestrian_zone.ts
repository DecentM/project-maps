import type { StyleConfig } from '..'

export const bridge_street_pedestrian_zone = (config: StyleConfig) => ({
  source: 'vector',
  id: 'bridge-street-pedestrian-zone',
  type: 'fill',
  'source-layer': 'street_polygons',
  filter: ['all', ['==', 'bridge', true], ['==', 'kind', 'pedestrian']],
  paint: {
    'fill-color': 'rgb(255,255,255)',
    'fill-opacity': {
      stops: [
        [12, 0],
        [13, 1],
      ],
    },
  },
})
