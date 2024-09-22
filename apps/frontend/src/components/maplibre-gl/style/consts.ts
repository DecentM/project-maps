export const Colours = {
  water: '#a0c8f0',
  buildingFill: '#f2eae2',
  buildingOutline: '#dfdbd7',
  park: 'red', //'#d8e8c8',
  landuse: '#e0e4dd',
  boundary: '#000000',
  road: '#ffffff',
  transportation: '#cccccc',
  labelText: '#666',
  labelHalo: '#ffffff',
  parkOutline: 'rgba(228, 241, 215, 1)',
} as const

export const FillOpacities = {
  park: 0.7,
} as const

export const LineWidths = {
  road: 2,
  transportation: 1.5,
  boundary: 1,
} as const

export const Sizes = {
  iconSize: 0.5,
  labelTextSize: 12,
  labelHaloWidth: 2,
} as const

export const Urls = {
  sprite: '{spritesUrlBase}/mdi',
  glyphs: '{fontsUrlBase}/{fontstack}/{range}.pbf',
  openmaptilesSource: '{tileUrlBase}/metadata.json',
} as const
