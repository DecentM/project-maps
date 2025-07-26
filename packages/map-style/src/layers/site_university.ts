import type { StyleConfig } from '..'

export const site_university = (config: StyleConfig) => ({
  source: 'vector',
  id: 'site-university',
  type: 'fill',
  'source-layer': 'sites',
  filter: ['in', 'kind', 'university'],
  paint: {
    'fill-color': 'rgb(255,255,128)',
    'fill-opacity': 0.1,
  },
})
