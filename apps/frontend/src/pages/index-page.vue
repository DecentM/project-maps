<script lang="ts" setup>
import { type MglEvent, useMap, type MglMap, MglDefaults } from 'vue-maplibre-gl'
//import { Protocol } from 'pmtiles'
import { onBeforeMount, ref } from 'vue'

const { map } = useMap()
const loaded = ref(0)

const handleLoad = (event: MglEvent) => {
  console.log('handleLoad', event)

  loaded.value++

  event.map.addLayer({
    id: 'background',
    type: 'background',
    paint: {
      'background-color': '#ee3333',
    },
  })

  event.map.addSource('pmtiles', {
    type: 'vector',
    tiles: ['http://localhost:3000/pbfs/{z}/{x}/{y}.pbf'],
    minzoom: 0,
    maxzoom: 14,
    attribution:
      '© <a href="https://www.openmaptiles.org/" target="_blank">OpenMapTiles</a> © <a href="http://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>',
  })

  event.map.addLayer({
    id: 'pmtiles',
    type: 'raster',
    source: 'pmtiles',
  })
}

const center = [10.288107, 49.405078]

const zoom = 3

const isZooming = ref(false)

onBeforeMount(() => {
  MglDefaults.style = '/map-styles/bright-v9.json'
})
</script>

<template>
  <q-page class="vh-100">
    <mgl-map
      ref="map"
      :center="center"
      :zoom="zoom"
      :attribution-control="true"
      @map:load="handleLoad"
      @map:zoomstart="isZooming = true"
      @map:zoomend="isZooming = false"
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
