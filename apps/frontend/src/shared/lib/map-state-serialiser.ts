export type MapStateInput = {
  coords: {
    lat: number
    lng: number
  }
  zoom: number
  pitch: number
  bearing: number
}

export type MapStateString = string & { __type: 'MapStateString' }

export class MapState {
  private static DefaultState: MapStateInput = {
    coords: {
      lat: 0,
      lng: 0,
    },
    bearing: 0,
    pitch: 0,
    zoom: 1,
  } as const

  public static isMapString(input: unknown): input is MapStateString {
    if (typeof input !== 'string') return false

    const parts = input.split('_')
    if (parts.length !== 5) return false

    const [lng, lat, zoom, pitch, bearing] = parts

    if (Number.isNaN(Number.parseFloat(lng))) return false
    if (Number.isNaN(Number.parseFloat(lat))) return false
    if (Number.isNaN(Number.parseFloat(zoom))) return false
    if (Number.isNaN(Number.parseFloat(pitch))) return false
    if (Number.isNaN(Number.parseInt(bearing, 10))) return false

    return true
  }

  public static toString(input: Partial<MapStateInput>): MapStateString {
    return [
      input.coords?.lng ?? MapState.DefaultState.coords.lng,
      input.coords?.lat ?? MapState.DefaultState.coords.lat,
      input.zoom ?? MapState.DefaultState.zoom,
      input.pitch ?? MapState.DefaultState.pitch,
      input.bearing ?? MapState.DefaultState.bearing,
    ].join('_') as MapStateString
  }

  public static fromString(input: string): MapStateInput | undefined {
    if (!MapState.isMapString(input)) return undefined

    const parts = input.split('_')
    const [lng, lat, zoom, pitch, bearing] = parts.map(Number.parseFloat)

    return {
      coords: {
        lat,
        lng,
      },
      bearing,
      zoom,
      pitch,
    }
  }
}
