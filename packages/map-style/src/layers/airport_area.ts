import type { StyleConfig } from '..'

export const airport_area = (config: StyleConfig) => ({
  source: 'vector',
  id: 'airport-area',
  type: 'fill',
  'source-layer': 'street_polygons',
  filter: ['in', 'kind', 'runway', 'taxiway'],
  paint: {
    'fill-color': 'rgb(255,255,255)',
    'fill-opacity': 0.5,
  },
})
