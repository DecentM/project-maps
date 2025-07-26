import type { StyleConfig } from '..'

export const land_vegetation = (config: StyleConfig) => ({
  source: 'vector',
  id: 'land-vegetation',
  type: 'fill',
  'source-layer': 'land',
  filter: ['all', ['in', 'kind', 'heath', 'scrub']],
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
