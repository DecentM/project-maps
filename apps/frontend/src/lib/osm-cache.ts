import type { Element } from '@project-maps/proto/lib/openstreetmap/web'
import { LocalforageCache } from './localforage-cache'
import type { MapGeoJSONFeature } from 'maplibre-gl'

const key = (type: Element['result']['case'], id: string | number) => {
  return `${type}:${id}`
}

export const useOsmCache = () => {
  const cache = new LocalforageCache<Element['result']>('osm')

  const get = async (
    type: Element['result']['case'],
    id: string | number
  ): Promise<Element['result'] | null> => {
    try {
      return await cache.get(key(type, id))
    } catch (error) {
      console.error(error)
      return null
    }
  }

  const set = async (element: Element['result'] | MapGeoJSONFeature): Promise<boolean> => {
    if ('source' in element) {
      return setGeoJson(element)
    }

    if (!element.case || !element.value?.id) {
      return false
    }

    try {
      return await cache.set(key(element.case, element.value.id.toString()), element)
    } catch (error) {
      console.error(error)
      return false
    }
  }

  const setGeoJson = async (feature: MapGeoJSONFeature): Promise<boolean> => {
    if (!feature.properties?.osm_id) {
      return false
    }

    switch (feature.geometry.type) {
      case 'Point':
        return set({
          case: 'node',
          value: {
            $typeName: 'OpenStreetMap.Node',
            id: feature.properties.osm_id,
            tags: feature.properties,
            lat: feature.geometry.type === 'Point' ? feature.geometry.coordinates[1] : Number.NaN,
            lon: feature.geometry.type === 'Point' ? feature.geometry.coordinates[0] : Number.NaN,
          },
        })
      case 'LineString':
      case 'Polygon':
        return set({
          case: 'way',
          value: {
            $typeName: 'OpenStreetMap.Way',
            id: feature.properties.osm_id,
            tags: feature.properties,
            nodes: [],
          },
        })
      default:
        return set({
          case: 'relation',
          value: {
            $typeName: 'OpenStreetMap.Relation',
            id: feature.properties.osm_id,
            tags: feature.properties,
            members: [],
          },
        })
    }
  }

  return { get, set }
}
