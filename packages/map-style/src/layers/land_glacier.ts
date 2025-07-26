import type { StyleConfig } from '..'

export const land_glacier = (config: StyleConfig) => ({
  source: 'vector',
  id: 'land-glacier',
  type: 'fill',
  'source-layer': 'water_polygons',
  filter: ['all', ['==', 'kind', 'glacier']],
  paint: {
    'fill-color': 'rgb(255,255,255)',
  },
})
