import type { StyleConfig } from '..'

export const street_service_bicycle = (config: StyleConfig) => ({
  source: 'vector',
  id: 'street-service-bicycle',
  type: 'line',
  'source-layer': 'streets',
  filter: [
    'all',
    ['==', 'kind', 'service'],
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
