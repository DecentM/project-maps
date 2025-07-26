import type { StyleConfig } from '..'

export const tunnel_street_pedestrian_zone = (config: StyleConfig) => ({
  source: 'vector',
  id: 'tunnel-street-pedestrian-zone',
  type: 'fill',
  'source-layer': 'street_polygons',
  filter: ['all', ['==', 'tunnel', true], ['==', 'kind', 'pedestrian']],
  paint: {
    'fill-color': 'rgb(247,247,247)',
    'fill-opacity': {
      stops: [
        [12, 0],
        [13, 1],
      ],
    },
  },
})
