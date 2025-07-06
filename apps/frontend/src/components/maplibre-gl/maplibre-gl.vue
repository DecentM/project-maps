<script lang="ts" setup>
import { onBeforeUnmount, onMounted, provide, ref, shallowRef, watch } from 'vue'
import { LngLat, type MapLibreEvent } from 'maplibre-gl'
import type { StyleConfig } from '@project-maps/map-style'

import { useMap } from './use-map'
import { MapSymbol } from './map-symbol'

const props = withDefaults(defineProps<StyleConfig>(), {
  center: () => new LngLat(0, 0),
  zoom: 16.25,
})

const emit = defineEmits<{
  (event: 'load'): void
  (event: 'moveend', lngLat: LngLat): void
  (event: 'zoomend', zoomLevel: number): void
  (event: 'click'): void
  (event: 'hover', id: GeoJSON.Feature<GeoJSON.Point, GeoJSON.GeoJsonProperties> | null): void
}>()

const container = shallowRef<HTMLDivElement>()

const { map } = useMap(container, {
  center: props.center,
  zoom: props.zoom,
})

watch(map, (newMap) => {
  if (!newMap) return

  newMap.once('load', (event) => {
    event.target.setCenter(props.center)
    event.target.setZoom(props.zoom)
  })
})

const handleLoad = () => emit('load')
const handleMoveEnd = (event: MapLibreEvent) => emit('moveend', event.target.getCenter())
const handleZoomEnd = (event: MapLibreEvent) => emit('zoomend', event.target.getZoom())
const handleClick = () => emit('click')

const hoveredPoi = ref<GeoJSON.Feature<GeoJSON.Point, GeoJSON.GeoJsonProperties> | null>(null)

onMounted(() => {
  map.value?.on('load', handleLoad)
  map.value?.on('moveend', handleMoveEnd)
  map.value?.on('zoomend', handleZoomEnd)
  map.value?.on('click', handleClick)

  map.value?.on('mousemove', 'poi_z16', (event) => {
    if (!event.features?.length) {
      if (hoveredPoi.value) {
        hoveredPoi.value = null
        emit('hover', hoveredPoi.value)
      }

      return
    }

    const feature = event.features[0]

    if (hoveredPoi.value?.id === String(feature.id)) return

    hoveredPoi.value = feature.toJSON()
    emit('hover', hoveredPoi.value)
  })
})

onBeforeUnmount(() => {
  map.value?.off('load', handleLoad)
  map.value?.off('moveend', handleMoveEnd)
  map.value?.off('zoomend', handleZoomEnd)
  map.value?.off('click', handleClick)
})

watch(
  () => props.center,
  (center) => map.value?.setCenter(center)
)

watch(
  () => props.zoom,
  (zoom) => map.value?.setZoom(zoom)
)

provide(MapSymbol, map)
</script>

<template>
  <div class="position-relative">
    <div ref="container" class="fit absolute-top-left"></div>
    <div v-if="$slots.default" class="fit absolute-top-left no-pointer-events overflow-hidden">
      <slot :map="map"></slot>
    </div>
  </div>
</template>
