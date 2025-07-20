import type { LayerSpecification } from 'maplibre-gl'

import * as Consts from '../consts'

import type { StyleComponent } from '..'

export const background: StyleComponent = (config) =>
  ({
    id: 'background',
    type: 'background',
    paint: { 'background-color': Consts.Colours.background },
  }) as unknown as LayerSpecification
