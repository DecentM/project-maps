import type { StyleConfig } from '..'

export const tunnel_street_service_bicycle = (config: StyleConfig) => ({
  source: 'vector',
  id: 'tunnel-street-service-bicycle',
  type: 'line',
  'source-layer': 'streets',
  filter: [
    'all',
    ['==', 'kind', 'service'],
    ['==', 'bicycle', 'designated'],
    ['==', 'tunnel', true],
  ],
  paint: {
    'line-color': 'rgb(247,247,247)',
  },
  layout: {
    'line-join': 'round',
    'line-cap': 'round',
  },
})
