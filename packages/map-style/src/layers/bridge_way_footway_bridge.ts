import type { StyleConfig } from '..'

export const bridge_way_footway_bridge = (config: StyleConfig) => ({
  source: 'vector',
  id: 'bridge-way-footway:bridge',
  type: 'line',
  'source-layer': 'streets',
  filter: ['all', ['==', 'bridge', true], ['in', 'kind', 'footway']],
  layout: {
    'line-cap': 'butt',
    'line-join': 'round',
  },
  paint: {
    'line-color': 'rgb(244,239,233)',
    'line-opacity': 0.5,
    'line-width': {
      stops: [
        [15, 0],
        [16, 7],
        [18, 10],
        [19, 17],
        [20, 31],
      ],
    },
  },
  minzoom: 15,
})
