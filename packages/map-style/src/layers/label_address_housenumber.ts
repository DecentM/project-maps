import type { StyleConfig } from '..'

export const label_address_housenumber = (config: StyleConfig) => ({
  source: 'vector',
  id: 'label-address-housenumber',
  type: 'symbol',
  'source-layer': 'addresses',
  filter: ['has', 'housenumber'],
  layout: {
    'text-field': '{housenumber}',
    'text-font': ['Noto Sans Regular'],
    'symbol-placement': 'point',
    'text-anchor': 'center',
    'text-size': {
      stops: [
        [17, 8],
        [19, 10],
      ],
    },
  },
  paint: {
    'text-halo-color': 'rgb(243,235,227)',
    'text-halo-width': 2,
    'text-halo-blur': 1,
    'icon-color': 'rgb(169,164,158)',
    'text-color': 'rgb(169,164,158)',
  },
  minzoom: 17,
})
