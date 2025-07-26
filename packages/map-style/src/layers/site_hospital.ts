import type { StyleConfig } from '..'

export const site_hospital = (config: StyleConfig) => ({
  source: 'vector',
  id: 'site-hospital',
  type: 'fill',
  'source-layer': 'sites',
  filter: ['in', 'kind', 'hospital'],
  paint: {
    'fill-color': 'rgb(255,102,102)',
    'fill-opacity': 0.1,
  },
})
