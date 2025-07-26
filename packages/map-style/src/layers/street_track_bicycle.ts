import type { StyleConfig } from '..'

export const street_track_bicycle = (config: StyleConfig) => ({
  source: 'vector',
  id: 'street-track-bicycle',
  type: 'line',
  'source-layer': 'streets',
  filter: [
    'all',
    ['==', 'kind', 'track'],
    ['==', 'bicycle', 'designated'],
    ['!=', 'bridge', true],
    ['!=', 'tunnel', true],
  ],
  paint: {
    'line-color': 'rgb(255,255,255)',
  },
  layout: {
    'line-join': 'round',
    'line-cap': 'round',
  },
})
