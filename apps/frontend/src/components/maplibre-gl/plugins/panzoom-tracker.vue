<template>
  <slot />
</template>

<script lang="ts" setup>
import type { Map as MaplibreGl, MapMouseEvent } from 'maplibre-gl'
import { computed, onBeforeUnmount, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export type PanZoom = {
  center: [string, string]
  zoom: string
  pitch: string
  bearing: string
}

const props = defineProps<{
  map: MaplibreGl
}>()

const route = useRoute()
const router = useRouter()

const panzoom = computed<PanZoom>(() => {
  return {
    center: [
      (Array.isArray(route.params.lng) ? route.params.lng[0] : route.params.lng) || '0',
      (Array.isArray(route.params.lat) ? route.params.lat[0] : route.params.lat) || '0',
    ],
    zoom: (Array.isArray(route.params.zoom) ? route.params.zoom[0] : route.params.zoom) || '1',
    pitch: (Array.isArray(route.params.pitch) ? route.params.pitch[0] : route.params.pitch) || '0',
    bearing:
      (Array.isArray(route.params.bearing) ? route.params.bearing[0] : route.params.bearing) || '0',
  }
})

const handlePanzoomChange = async (newPanzoom: PanZoom) => {
  await router.push({
    name: route.name,
    params: {
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

onMounted(() => {
  props.map.setZoom(Number.parseFloat(panzoom.value.zoom))

  props.map.setCenter({
    lng: Number.parseFloat(panzoom.value.center[0]),
    lat: Number.parseFloat(panzoom.value.center[1]),
  })

  props.map.setPitch(Number.parseFloat(panzoom.value.pitch))

  props.map.setBearing(Number.parseFloat(panzoom.value.bearing))

  props.map.on('moveend', handleMoveEnd)
  props.map.on('zoomend', handleMoveEnd)
})

onBeforeUnmount(() => {
  props.map.off('moveend', handleMoveEnd)
  props.map.off('zoomend', handleMoveEnd)
})
</script>
