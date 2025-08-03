<template>
  <slot />
</template>

<script lang="ts" setup>
import type { MapMouseEvent, Map as MaplibreGl } from 'maplibre-gl'
import { type ShallowRef, computed, inject, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export type PanZoom = {
  center: [string, string]
  zoom: string
  pitch: string
  bearing: string
}

const map = inject<ShallowRef<MaplibreGl>>('map')

const route = useRoute()
const router = useRouter()

const panzoom = computed<PanZoom>(() => {
  return {
    center: [
      (Array.isArray(route.query.lng) ? route.query.lng[0] : route.query.lng) || '0',
      (Array.isArray(route.query.lat) ? route.query.lat[0] : route.query.lat) || '0',
    ],
    zoom: (Array.isArray(route.query.zoom) ? route.query.zoom[0] : route.query.zoom) || '1',
    pitch: (Array.isArray(route.query.pitch) ? route.query.pitch[0] : route.query.pitch) || '0',
    bearing:
      (Array.isArray(route.query.bearing) ? route.query.bearing[0] : route.query.bearing) || '0',
  }
})

const handlePanzoomChange = async (newPanzoom: PanZoom) => {
  await router.push({
    name: route.name,
    query: {
      ...route.query,
      lng: newPanzoom.center[0],
      lat: newPanzoom.center[1],
      zoom: newPanzoom.zoom,
      pitch: newPanzoom.pitch,
      bearing: newPanzoom.bearing,
    },
  })
}

const ZOOM_ACCURACY = 4
const CENTER_ACCURACY = 5
const PITCH_ACCURACY = 2
const BEARING_ACCURACY = 0

const handleMoveEnd = async (event: MapMouseEvent) => {
  const newCenter = event.target.getCenter()
  const newZoom = event.target.getZoom()
  const newPitch = event.target.getPitch()
  const newBearing = event.target.getBearing()

  if (
    newCenter.lat.toFixed(CENTER_ACCURACY) === panzoom.value?.center[1] &&
    newCenter.lng.toFixed(CENTER_ACCURACY) === panzoom.value?.center[0] &&
    newZoom.toFixed(ZOOM_ACCURACY) === panzoom.value.zoom &&
    newPitch.toFixed(PITCH_ACCURACY) === panzoom.value.pitch &&
    newBearing.toFixed(BEARING_ACCURACY) === panzoom.value.bearing
  )
    return

  await handlePanzoomChange({
    center: [newCenter.lng.toFixed(CENTER_ACCURACY), newCenter.lat.toFixed(CENTER_ACCURACY)],
    zoom: newZoom.toFixed(ZOOM_ACCURACY),
    pitch: newPitch.toFixed(PITCH_ACCURACY),
    bearing: newBearing.toFixed(BEARING_ACCURACY),
  })
}

const initialised = ref(false)

const updateCursor = (cursor: string) => {
  if (!map?.value) return

  map.value.getCanvas().style.cursor = cursor
}

const handleDragend = (event: MapMouseEvent) => {
  updateCursor('default')
}

const handleDragstart = (event: MapMouseEvent) => {
  updateCursor('grabbing')
}

const init = (map: MaplibreGl) => {
  if (initialised.value) return

  map.setZoom(Number.parseFloat(panzoom.value.zoom))
  map.setCenter({
    lng: Number.parseFloat(panzoom.value.center[0]),
    lat: Number.parseFloat(panzoom.value.center[1]),
  })
  map.setPitch(Number.parseFloat(panzoom.value.pitch))
  map.setBearing(Number.parseFloat(panzoom.value.bearing))

  map.on('dragstart', handleDragstart)
  map.on('dragend', handleDragend)
  map.on('moveend', handleMoveEnd)
  map.on('zoomend', handleMoveEnd)

  updateCursor('default')

  initialised.value = true
}

const dispose = () => {
  if (!map || !map.value) return

  map.value.off('dragend', handleDragend)
  map.value.off('dragstart', handleDragstart)
  map.value.off('moveend', handleMoveEnd)
  map.value.off('zoomend', handleMoveEnd)
}

if (map) {
  watch(map, (newMap) => {
    if (newMap) {
      init(newMap)
    }
  })

  onMounted(() => {
    if (map.value) {
      init(map.value)
    }
  })
}

onBeforeUnmount(() => dispose())
</script>
