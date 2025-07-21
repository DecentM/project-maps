<template>
  <slot />
</template>

<script lang="ts" setup>
import type { Map as MaplibreGl, MapMouseEvent } from 'maplibre-gl'
import { onBeforeUnmount, onMounted } from 'vue'

export type PanZoom = {
  center: [string, string]
  zoom: string
  pitch: string
}

const props = defineProps<{
  map: MaplibreGl
  modelValue: PanZoom
}>()

const emit = defineEmits<(event: 'update:modelValue', value: PanZoom) => void>()

const ZOOM_ACCURACY = 4
const CENTER_ACCURACY = 5
const PITCH_ACCURACY = 2

const handleMoveEnd = (event: MapMouseEvent) => {
  const newCenter = event.target.getCenter()

  if (
    newCenter.lat.toFixed(CENTER_ACCURACY) === props.modelValue?.center[1] &&
    newCenter.lng.toFixed(CENTER_ACCURACY) === props.modelValue?.center[0]
  )
    return

  const newZoom = event.target.getZoom()

  if (newZoom.toFixed(ZOOM_ACCURACY) === props.modelValue.zoom) return

  const newPitch = event.target.getPitch()

  if (newPitch.toFixed(PITCH_ACCURACY) === props.modelValue.pitch) return

  emit('update:modelValue', {
    center: [newCenter.lng.toFixed(CENTER_ACCURACY), newCenter.lat.toFixed(CENTER_ACCURACY)],
    zoom: newZoom.toFixed(ZOOM_ACCURACY),
    pitch: newPitch.toFixed(PITCH_ACCURACY),
  })
}

onMounted(() => {
  props.map.setZoom(Number.parseFloat(props.modelValue.zoom))

  props.map.setCenter({
    lng: Number.parseFloat(props.modelValue.center[0]),
    lat: Number.parseFloat(props.modelValue.center[1]),
  })

  props.map.setPitch(Number.parseFloat(props.modelValue.pitch))

  props.map.on('moveend', handleMoveEnd)
  props.map.on('zoomend', handleMoveEnd)
})

onBeforeUnmount(() => {
  props.map.off('moveend', handleMoveEnd)
  props.map.off('zoomend', handleMoveEnd)
})
</script>
