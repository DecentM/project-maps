<script lang="ts" setup>
import { type MglEvent, useMap, type MglMap, MglDefaults } from 'vue-maplibre-gl'
//import { Protocol } from 'pmtiles'
import { onBeforeMount, ref } from 'vue'
import { LngLat, type RequestParameters } from 'maplibre-gl'

const { map } = useMap()
const loaded = ref(0)

const handleLoad = (event: MglEvent) => {
  loaded.value++
}

const center = ref<LngLat>(new LngLat(10.288107, 49.405078))

const sameMoves = ref(0)

const handleMove = (event: MglEvent) => {
  const newCenter = event.map.getCenter()

  if (center.value.lng === newCenter.lng && center.value.lat === newCenter.lat) {
    sameMoves.value++

    if (sameMoves.value > 10) {
      return
    }
  } else {
    sameMoves.value = 0
  }

  center.value = newCenter
}

const zoom = ref(10.25)

const handleZoom = (event: MglEvent) => {
  if (zoom.value === event.map.getZoom()) {
    return
  }

  zoom.value = event.map.getZoom()
}

const isZooming = ref(false)

onBeforeMount(() => {
  MglDefaults.style = `${window.location.origin}/map-style/style/light.json`
  MglDefaults.center = [-0.1117343, 51.4876308]
  MglDefaults.zoom = 10.25
})

const transformRequest = (url: string, resourceType: string): RequestParameters => {
  return {
    url: url
      .replace(/\{tileUrlBase\}/gu, `${window.location.origin}/map-tiles`)
      .replace(/\{spritesUrlBase\}/gu, `${window.location.origin}/map-style/sprites`)
      .replace(/\{fontsUrlBase\}/gu, `${window.location.origin}/map-fonts`),
  }
}
</script>

<style lang="scss" scoped>
.debug-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  overflow: auto;
  width: 300px;
  height: fit-content;
}
</style>

<template>
  <q-page class="vh-100">
    <q-card class="debug-overlay">
      <q-card-section>
        <div class="text-subitle1">Zoom: {{ zoom.toFixed(2) }}</div>
        <div class="text-subitle1">Coords: {{ center.lat.toFixed(7) }}, {{ center.lng.toFixed(7) }}</div>
      </q-card-section>
    </q-card>
    <mgl-map
      ref="map"
      :attribution-control="true"
      :max-zoom="19"
      :transform-request="transformRequest"
      @map:load="handleLoad"
      @map:zoomstart="isZooming = true"
      @map:zoomend="isZooming = false"
      @map:move="handleMove"
      @map:zoom="handleZoom"
    >
      <mgl-frame-rate-control/>
      <mgl-fullscreen-control/>
      <mgl-attribution-control/>
      <mgl-navigation-control/>
      <mgl-scale-control/>
      <mgl-geolocation-control/>
    </mgl-map>
  </q-page>
</template>
