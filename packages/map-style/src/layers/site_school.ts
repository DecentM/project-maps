import type { StyleConfig } from '..'

export const site_school = (config: StyleConfig) => ({
  source: 'vector',
  id: 'site-school',
  type: 'fill',
  'source-layer': 'sites',
  filter: ['in', 'kind', 'school'],
  paint: {
    'fill-color': 'rgb(255,255,128)',
    'fill-opacity': 0.1,
  },
})
