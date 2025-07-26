import type { StyleConfig } from '..'

export const symbol_transit_airfield = (config: StyleConfig) => ({
  source: 'vector',
  id: 'symbol-transit-airfield',
  type: 'symbol',
  'source-layer': 'public_transport',
  filter: ['all', ['==', 'kind', 'aerodrome'], ['!has', 'iata']],
  layout: {
    'text-field': '{name_en}',
    'icon-size': {
      stops: [
        [13, 0.5],
        [15, 1],
      ],
    },
    'symbol-placement': 'point',
    'icon-keep-upright': true,
    'text-font': ['Noto Sans Regular'],
    'text-size': 10,
    'icon-anchor': 'bottom',
    'text-anchor': 'top',
    'icon-image': 'basics:icon-airfield',
  },
  paint: {
    'icon-opacity': 0.7,
    'icon-color': 'rgb(102,98,106)',
    'text-color': 'rgb(102,98,106)',
    'text-halo-color': 'rgba(255,255,255,0.8)',
    'text-halo-width': 2,
    'text-halo-blur': 1,
  },
  minzoom: 13,
})
