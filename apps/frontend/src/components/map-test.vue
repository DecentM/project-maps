<template>
    <div id="map">
      <l-map
        ref="map"
        :zoom="zoom"
        :center="center"
        @update:center="center = $event"
        @update:zoom="zoom = $event"
        :use-global-leaflet="false"
        @click="handleClick"
      >
        <l-tile-layer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" layer-type="base" name="OpenStreetMap">
        </l-tile-layer>
      </l-map>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { LMap, LTileLayer } from '@vue-leaflet/vue-leaflet'
import { LatLng } from 'leaflet'

const map = ref(null)
const center = ref<LatLng>(new LatLng(51.506579, -0.107889))
const zoom = ref(14)

const handleClick = (event: { latlng: { lat: number; lng: number } }) => {
  console.log(event.latlng)
}
</script>

<style scoped>
#map {
  width: 100vw;
  height: 100vh;
  background-color: grey;
}
</style>
