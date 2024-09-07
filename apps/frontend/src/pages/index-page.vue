<script lang="ts" setup>
import { type MglEvent, useMap, type MglMap, MglDefaults } from 'vue-maplibre-gl'
//import { Protocol } from 'pmtiles'
import { onBeforeMount, ref } from 'vue'
import { LngLat, type RequestParameters } from 'maplibre-gl'
import LocationSidebar from 'src/components/location-sidebar/location-sidebar.vue'

const { map } = useMap()
const loaded = ref(0)

const handleLoad = (event: MglEvent) => {
  loaded.value++
}

const center = ref<LngLat>(new LngLat(-0.1117343, 51.4876308))

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

const zoom = ref(16.25)

const handleZoom = (event: MglEvent) => {
  if (zoom.value === event.map.getZoom()) {
    return
  }

  zoom.value = event.map.getZoom()
}

const isZooming = ref(false)

onBeforeMount(() => {
  MglDefaults.style = `http://${window.location.hostname}:3000/styles/style/light.json`
  MglDefaults.center = [center.value.lng, center.value.lat]
  MglDefaults.zoom = zoom.value
})

const transformRequest = (url: string, resourceType: string): RequestParameters => {
  return {
    url: url
      .replace(/\{tileUrlBase\}/gu, `http://${window.location.hostname}:3000/tile`)
      .replace(/\{spritesUrlBase\}/gu, `http://${window.location.hostname}:3000/icons/sprites`)
      .replace(/\{fontsUrlBase\}/gu, `http://${window.location.hostname}:3000/fonts`),
  }
}

const selectedLocation = ref<LngLat | null>(null)

const handleClick = (event: MglEvent) => {
  selectedLocation.value = event.event.lngLat
}
</script>

<style lang="scss" scoped>
.sidebar {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  z-index: 1;
  pointer-events: none;
}
</style>

<template>
  <q-page class="vh-100">
    <div class="sidebar q-pa-md">
      <location-sidebar :location="selectedLocation" />
    </div>

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
      @map:click="handleClick"
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
