export const Colours = {
  water: '#a0c8f0',
  buildingFill: '#f2eae2',
  buildingOutline: '#dfdbd7',
  park: '#d8e8c8',
  landuse: '#e0e4dd',
  boundary: '#000000',
  boundaryOutline: 'hsl(248, 1%, 41%)',
  boundary3Outline: '#9e9cab',
  road: '#ffffff',
  transportation: '#cccccc',
  labelText: '#666',
  labelHalo: '#ffffff',
  parkOutline: 'rgba(228, 241, 215, 1)',
  aerowayFill: 'rgba(229, 228, 224, 1)',
  aerowayRunway: '#f0ede9',
  aerowayTaxiway: '#f0ede9',
  background: 'rgb(239, 239, 239)',
  bridgeLinkCasing: '#e9ac77',
  bridgeLink: '#fea',
} as const

export const FillOpacities = {
  park: 0.7,
  aeroway: 0.7,
} as const

export const Urls = {
  sprite: '{spritesUrlBase}/mdi',
  glyphs: '{fontsUrlBase}/{fontstack}/{range}.pbf',
  openmaptilesSource: '{tileUrlBase}/metadata.json',
  terrainSource: '{terrainUrlBase}/metadata.json',
} as const
