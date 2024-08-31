<template>
  <div id="map">
    <l-map
      ref="map"
      :zoom="zoom"
      :center="[center.lat, center.lng]"
      @update:center="center = $event"
      @update:zoom="zoom = $event"
      :use-global-leaflet="false"
      @click="handleClick"
    >
      <l-tile-layer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" layer-type="base" name="OpenStreetMap">
      </l-tile-layer>
    </l-map>
  </div>

  <div class="preview">
    <div v-for="image in images" :key="image" class="image"
    :style="{backgroundImage: `url(${image})`}"></div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { LMap, LTileLayer } from '@vue-leaflet/vue-leaflet'
import { LatLng } from 'leaflet'

const map = ref(null)
const center = ref<LatLng>(new LatLng(51.506579, -0.107889))
const zoom = ref(14)

const clickLocation = ref({ lat: 0, lng: 0 })

const handleClick = (event: { latlng: { lat: number; lng: number } }) => {
  clickLocation.value = event.latlng
}

const apiUrl = computed(() => {
  return `http://localhost:3000/api/v1/location-image?lat=${clickLocation.value.lat}&lng=${clickLocation.value.lng}`
})

const images = ref<string[]>([])

watch(apiUrl, async (newUrl) => {
  const response = await fetch(newUrl)
  const data = await response.json()
  images.value = data.images.map(({ image }: { image: string }) => image)
})
</script>

<style scoped>
#map {
  width: 100vw;
  height: 100vh;
  background-color: grey;
  z-index: 1;
  position: relative;
}

.preview {
  position: absolute;
  top: 0;
  right: 0;
  width: 300px;
  height: 100vh;
  background-color: white;
  border: 1px solid black;
  z-index: 2;
  overflow-y: scroll;
}

.image {
  width: 100%;
  height: 200px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
</style>
