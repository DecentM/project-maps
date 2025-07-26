import type { StyleConfig } from '..'

export const bridge_street_motorway_bridge = (config: StyleConfig) => ({
  source: 'vector',
  id: 'bridge-street-motorway:bridge',
  type: 'line',
  'source-layer': 'streets',
  filter: ['all', ['==', 'bridge', true], ['in', 'kind', 'motorway'], ['!=', 'link', true]],
  layout: {
    'line-cap': 'butt',
    'line-join': 'round',
  },
  paint: {
    'line-color': 'rgb(244,239,233)',
    'line-opacity': 0.5,
    'line-width': {
      stops: [
        [5, 0],
        [6, 3],
        [10, 7],
        [14, 7],
        [16, 20],
        [18, 53],
        [19, 118],
        [20, 235],
      ],
    },
  },
})
