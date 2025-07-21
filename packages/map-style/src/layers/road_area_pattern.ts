import type { LayerSpecification } from 'maplibre-gl'

import type { StyleConfig } from '..'

export const road_area_pattern = (config: StyleConfig) =>
  ({
    id: 'road_area_pattern',
    type: 'fill',
    source: 'openmaptiles',
    'source-layer': 'transportation',
    filter: ['all', ['==', '$type', 'Polygon']],
    paint: { 'fill-pattern': 'pedestrian_polygon' },
  }) as unknown as LayerSpecification
