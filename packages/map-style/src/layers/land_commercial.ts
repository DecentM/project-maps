import type { StyleConfig } from '..'

export const land_commercial = (config: StyleConfig) => ({
  source: 'vector',
  id: 'land-commercial',
  type: 'fill',
  'source-layer': 'land',
  filter: ['all', ['in', 'kind', 'commercial', 'retail']],
  paint: {
    'fill-color': 'rgba(247,222,237,0.251)',
    'fill-opacity': {
      stops: [
        [10, 0],
        [11, 1],
      ],
    },
  },
})
