import type { LayerSpecification } from 'maplibre-gl'

import * as Consts from '../consts'

export const aeroway_fill: LayerSpecification = {
  id: 'aeroway_fill',
  type: 'fill',
  source: 'openmaptiles',
  'source-layer': 'aeroway',
  minzoom: 11,
  filter: ['==', '$type', 'Polygon'],
  paint: { 'fill-color': Consts.Colours.aerowayFill, 'fill-opacity': Consts.FillOpacities.aeroway },
} as unknown as LayerSpecification
