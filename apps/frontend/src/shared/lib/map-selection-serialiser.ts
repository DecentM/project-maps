export type SelectionStateInput = {
  coords: {
    lat: number
    lng: number
  }
  zoom: number
}

export type SelectionStateString = string & { __type: 'SelectionStateString' }

export class SelectionState {
  private static DefaultState: SelectionStateInput = {
    coords: {
      lat: 0,
      lng: 0,
    },
    zoom: 1,
  } as const

  public static isMapString(input: unknown): input is SelectionStateString {
    if (typeof input !== 'string') return false

    const parts = input.split('_')
    if (parts.length !== 3) return false

    const [lng, lat, zoom] = parts

    if (Number.isNaN(Number.parseFloat(lng))) return false
    if (Number.isNaN(Number.parseFloat(lat))) return false
    if (Number.isNaN(Number.parseFloat(zoom))) return false

    return true
  }

  public static toString(input: Partial<SelectionStateInput>): SelectionStateString {
    return [
      input.coords?.lng ?? SelectionState.DefaultState.coords.lng,
      input.coords?.lat ?? SelectionState.DefaultState.coords.lat,
      input?.zoom ?? SelectionState.DefaultState.zoom,
    ].join('_') as SelectionStateString
  }

  public static fromString(input: string): SelectionStateInput | undefined {
    if (!SelectionState.isMapString(input)) return undefined

    const parts = input.split('_')
    const [lng, lat, zoom] = parts.map(Number.parseFloat)

    return {
      coords: {
        lat,
        lng,
      },
      zoom,
    }
  }
}
