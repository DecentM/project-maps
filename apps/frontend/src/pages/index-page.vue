<script lang="ts" setup>
import type { LocationImages } from '@project-maps/proto/location-images'
import type { LngLat } from 'maplibre-gl'
import FullMap from 'src/components/full-map/full-map.vue'
import LocationSidebar from 'src/components/location-sidebar/location-sidebar.vue'
import { ref } from 'vue'

const selectedLocation = ref<LngLat | null>(null)

const handleLocationClick = (location: LngLat) => {
  selectedLocation.value = location
}

const imageLocations = ref<LocationImages.LocationImage[]>([])

const addImageLocation = (location: LocationImages.LocationImage) => {
  imageLocations.value = [...imageLocations.value, location]
}

const resetImageLocations = () => {
  imageLocations.value = []
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
      <location-sidebar
        :location="selectedLocation"
        @show-image="addImageLocation"
        @reset-images="resetImageLocations" />
    </div>

    <full-map @click:location="handleLocationClick" />
  </q-page>
</template>
