import type { LayerSpecification } from 'maplibre-gl'

import * as Consts from '../consts'

import type { StyleComponent } from '..'

export const aeroway_fill: StyleComponent = (config) =>
  ({
    id: 'aeroway_fill',
    type: 'fill',
    source: 'openmaptiles',
    'source-layer': 'aeroway',
    minzoom: 11,
    filter: ['==', '$type', 'Polygon'],
    paint: {
      'fill-color': Consts.Colours.aerowayFill,
      'fill-opacity': Consts.FillOpacities.aeroway,
    },
  }) as unknown as LayerSpecification
