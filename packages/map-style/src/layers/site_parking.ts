import type { StyleConfig } from '..'

export const site_parking = (config: StyleConfig) => ({
  source: 'vector',
  id: 'site-parking',
  type: 'fill',
  'source-layer': 'sites',
  filter: ['in', 'kind', 'parking'],
  paint: {
    'fill-color': 'rgb(235,232,230)',
  },
})
