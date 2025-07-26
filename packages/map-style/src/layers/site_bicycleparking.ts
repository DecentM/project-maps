import type { StyleConfig } from '..'

export const site_bicycleparking = (config: StyleConfig) => ({
  source: 'vector',
  id: 'site-bicycleparking',
  type: 'fill',
  'source-layer': 'sites',
  filter: ['in', 'kind', 'bicycle_parking'],
  paint: {
    'fill-color': 'rgb(235,232,230)',
  },
})
