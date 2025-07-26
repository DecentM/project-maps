import type { StyleConfig } from '..'

export const land_park = (config: StyleConfig) => ({
  source: 'vector',
  id: 'land-park',
  type: 'fill',
  'source-layer': 'land',
  filter: ['all', ['in', 'kind', 'park', 'village_green', 'recreation_ground']],
  paint: {
    'fill-color': 'rgb(217,217,165)',
    'fill-opacity': {
      stops: [
        [11, 0],
        [12, 1],
      ],
    },
  },
})
