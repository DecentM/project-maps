import type { LayerSpecification } from 'maplibre-gl'

import * as Consts from '../consts'

export const background: LayerSpecification = {
  id: 'background',
  type: 'background',
  paint: { 'background-color': Consts.Colours.background },
} as unknown as LayerSpecification
