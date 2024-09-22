import type { LayerSpecification } from 'maplibre-gl'

export const landcover_grass: LayerSpecification = {
  id: 'landcover_grass',
  type: 'fill',
  source: 'openmaptiles',
  'source-layer': 'landcover',
  filter: ['all', ['==', 'class', 'grass']],
  paint: {
    'fill-antialias': false,
    'fill-color': 'rgba(176, 213, 154, 1)',
    'fill-opacity': 0.3,
  },
} as LayerSpecification
