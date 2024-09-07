<script lang="ts" setup>
import { LngLat, type RequestParameters } from 'maplibre-gl'
import { onBeforeMount, onMounted, ref } from 'vue'
import { type MglEvent, useMap, MglDefaults } from 'vue-maplibre-gl'

const { map } = useMap()
const loaded = ref(0)

const handleLoad = (event: MglEvent) => {
  loaded.value++
}

const center = ref<LngLat>(new LngLat(-0.1117343, 51.4876308))

const handleMove = (event: MglEvent) => {
  const newCenter = event.map.getCenter()
  center.value = newCenter
}

const zoom = ref(16.25)

const handleZoom = (event: MglEvent) => {
  if (zoom.value === event.map.getZoom()) {
    return
  }

  zoom.value = event.map.getZoom()
}

onBeforeMount(() => {
  MglDefaults.style = `http://${window.location.hostname}:3000/styles/style/light.json`
  MglDefaults.center = [center.value.lng, center.value.lat]
  MglDefaults.zoom = zoom.value
})

onMounted(() => {
  emit('zoom:end', zoom.value)
})

const transformRequest = (url: string, resourceType: string): RequestParameters => {
  return {
    url: url
      .replace(/\{tileUrlBase\}/gu, `http://${window.location.hostname}:3000/tile`)
      .replace(/\{spritesUrlBase\}/gu, `http://${window.location.hostname}:3000/icons/sprites`)
      .replace(/\{fontsUrlBase\}/gu, `http://${window.location.hostname}:3000/fonts`),
  }
}

const emit = defineEmits<{
  (event: 'click:location', location: LngLat): void
  (event: 'move:end', location: LngLat): void
  (event: 'zoom:end', zoom: number): void
}>()

const handleClick = (event: MglEvent) => {
  emit('click:location', event.event.lngLat)
}

const isDev = !!import.meta.env.DEV
</script>

<template>
  <mgl-map
    ref="map"
    :attribution-control="true"
    :max-zoom="19"
    :transform-request="transformRequest"
    @map:load="handleLoad"
    @map:move="handleMove"
    @map:zoom="handleZoom"
    @map:click="handleClick"
    @map:moveend="() => emit('move:end', center)"
    @map:zoomend="() => emit('zoom:end', zoom)"
  >
    <mgl-frame-rate-control v-if="isDev" />
    <mgl-fullscreen-control />
    <mgl-attribution-control />
    <mgl-navigation-control />
    <mgl-scale-control />
    <mgl-geolocation-control />

    <slot />
  </mgl-map>
</template>
