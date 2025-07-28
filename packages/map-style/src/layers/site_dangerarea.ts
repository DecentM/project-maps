import type { StyleConfig } from '..'

export const site_dangerarea = (config: StyleConfig) => ({
  source: 'vector',
  id: 'site-dangerarea',
  type: 'fill',
  'source-layer': 'sites',
  filter: ['in', 'kind', 'danger_area'],
  paint: {
    'fill-color': 'rgb(255,0,0)',
    'fill-outline-color': 'rgb(255,0,0)',
    'fill-opacity': 0.3,
    'fill-pattern': 'mdi:alert-box',
  },
})
