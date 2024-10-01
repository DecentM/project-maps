<script lang="ts" setup>
import type { Map as MaplibreMap } from 'maplibre-gl'
import { inject, ref, shallowRef, watch, type ShallowRef, computed, nextTick } from 'vue'

import { MapSymbol } from './map-symbol'
import MapMarker from './map-marker.vue'

const props = withDefaults(
  defineProps<{
    layers: string[]
    limit?: number
  }>(),
  {
    limit: Number.MAX_SAFE_INTEGER,
  }
)

const map = inject<ShallowRef<MaplibreMap>>(MapSymbol)
const pois: ShallowRef<GeoJSON.Feature[]> = shallowRef([])

const idleCallback = ref<number | NodeJS.Timeout | null>(null)

const requestIdleCallback = (callback: (...args: unknown[]) => void) => {
  if (idleCallback.value) return

  if (typeof window === 'undefined') return callback()

  if ('requestIdleCallback' in window) {
    idleCallback.value = window.requestIdleCallback(() =>
      nextTick(() => {
        idleCallback.value = null
        callback()
      })
    )
  } else {
    idleCallback.value = setTimeout(
      () =>
        nextTick(() => {
          idleCallback.value = null
          callback()
        }),
      250
    )
  }
}

const recalculatePoisImmediate = () => {
  if (!map?.value) return

  pois.value = map.value.queryRenderedFeatures(undefined, {
    layers: props.layers,
  })
}

const recalculatePois = () => requestIdleCallback(recalculatePoisImmediate)

if (map)
  watch(map, (newMap) => {
    if (!newMap) return

    newMap.on('move', recalculatePois)
    newMap.on('zoom', recalculatePois)
    newMap.on('moveend', recalculatePois)
    newMap.on('zoomend', recalculatePois)
  })

// Apply a limit to a Point array by removing points that are close to each
// other. This prevents cluttering the map too
const removeTooClose = (pois: GeoJSON.Feature<GeoJSON.Point>[], limit: number) => {
  if (pois.length <= limit) return pois

  const result: GeoJSON.Feature<GeoJSON.Point>[] = []

  for (const poi of pois) {
    let tooClose = false

    for (const other of result) {
      const dx = poi.geometry.coordinates[0] - other.geometry.coordinates[0]
      const dy = poi.geometry.coordinates[1] - other.geometry.coordinates[1]

      if (dx * dx + dy * dy < 0.0000001) {
        tooClose = true
        break
      }
    }

    if (!tooClose) result.push(poi)

    if (result.length >= limit) break
  }

  return result
}

const points = computed<GeoJSON.Feature<GeoJSON.Point>[]>(() =>
  removeTooClose(
    pois.value.filter(
      (poi) => poi?.geometry?.type === 'Point' && poi.geometry.coordinates
    ) as GeoJSON.Feature<GeoJSON.Point>[],
    props.limit
  )
)
</script>

<template>
  <keep-alive :max="Math.min(props.limit * 2, Number.MAX_SAFE_INTEGER)">
    <map-marker
      v-for="poi in points"
      :key="poi.id"
      :coordinates="[poi.geometry.coordinates[0], poi.geometry.coordinates[1]]"
      :options="{ offset: [0, 0] }"
    >
      <slot name="poi" :poi="poi" />
    </map-marker>
  </keep-alive>
</template>
