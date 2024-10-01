<script lang="ts" setup>
import type { Map as MaplibreMap } from 'maplibre-gl'
import { inject, ref, shallowRef, watch, type ShallowRef, computed, nextTick } from 'vue'
import { throttle } from 'quasar'

import { MapSymbol } from './map-symbol'
import MapMarker from './map-marker.vue'
import { classToIcon } from './style/icon-mapping'

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

const recalculatePois = throttle(
  () =>
    requestIdleCallback(() => {
      if (!map?.value) return

      pois.value = map.value.queryRenderedFeatures(undefined, {
        layers: ['poi_z14', 'poi_z15', 'poi_z16'],
      })
    }),
  100
)

if (map)
  watch(map, (newMap) => {
    if (!newMap) return

    newMap.on('move', recalculatePois)
    newMap.on('zoom', recalculatePois)
  })

const points = computed<GeoJSON.Feature<GeoJSON.Point>[]>(
  () =>
    pois.value.filter(
      (poi) => poi?.geometry?.type === 'Point' && poi.geometry.coordinates
    ) as GeoJSON.Feature<GeoJSON.Point>[]
)
</script>

<template>
  <transition-group name="poi" tag="div">
    <map-marker
      v-for="poi in points"
      :key="poi.id"
      :coordinates="[poi.geometry.coordinates[0], poi.geometry.coordinates[1]]"
      :options="{ offset: [0, 0] }"
    >
      <q-icon v-if="poi.properties" :name="classToIcon[poi.properties.class]" color="primary" size="sm" />
      <q-icon v-else name="mdi-circle-medium" color="red" size="sm" />
    </map-marker>
  </transition-group>
</template>
