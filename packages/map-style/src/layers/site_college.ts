import type { StyleConfig } from '..'

export const site_college = (config: StyleConfig) => ({
  source: 'vector',
  id: 'site-college',
  type: 'fill',
  'source-layer': 'sites',
  filter: ['in', 'kind', 'college'],
  paint: {
    'fill-color': 'rgb(255,255,128)',
    'fill-opacity': 0.1,
  },
})
