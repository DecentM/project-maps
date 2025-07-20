import type { LayerSpecification } from 'maplibre-gl'

import * as Consts from '../consts'

import type { StyleComponent } from '..'

export const aeroway_taxiway: StyleComponent = (config) =>
  ({
    id: 'aeroway_taxiway',
    type: 'line',
    source: 'openmaptiles',
    'source-layer': 'aeroway',
    minzoom: 11,
    filter: ['all', ['==', '$type', 'LineString'], ['==', 'class', 'taxiway']],
    paint: {
      'line-color': Consts.Colours.aerowayTaxiway,
      'line-width': {
        base: 1.2,
        stops: [
          [11, 0.5],
          [20, 6],
        ],
      },
    },
  }) as unknown as LayerSpecification
