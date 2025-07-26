import type { StyleConfig } from '..'

export const label_place_suburb = (config: StyleConfig) => ({
  source: 'vector',
  id: 'label-place-suburb',
  type: 'symbol',
  'source-layer': 'place_labels',
  filter: ['==', 'kind', 'suburb'],
  layout: {
    'text-field': '{name_en}',
    'text-font': ['Noto Sans Regular'],
    'text-size': {
      stops: [
        [11, 11],
        [13, 14],
      ],
    },
    'text-transform': 'uppercase',
  },
  paint: {
    'icon-color': 'rgb(40,57,73)',
    'text-color': 'rgb(40,57,73)',
    'text-halo-color': 'rgba(255,255,255,0.8)',
    'text-halo-width': 2,
    'text-halo-blur': 1,
  },
  minzoom: 11,
})
