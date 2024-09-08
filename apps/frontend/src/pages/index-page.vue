<script lang="ts" setup>
import { ref } from 'vue'
import type { LocationMetadataImages } from '@project-maps/proto/location-metadata/images'
import type { LngLat } from 'maplibre-gl'

import FullMap from 'src/components/full-map/full-map.vue'
import LocationSidebar from 'src/components/location-sidebar/location-sidebar.vue'
import MapMarker from 'src/components/full-map/map-marker.vue'

const selectedLocation = ref<LngLat | null>(null)

const handleLocationClick = (location: LngLat) => {
  selectedLocation.value = location
}

const imageLocations = ref<LocationMetadataImages.LocationImage[]>([])

const addImageLocation = (location: LocationMetadataImages.LocationImage) => {
  imageLocations.value = [...imageLocations.value, location]
}

const resetImageLocations = () => {
  imageLocations.value = []
}

const zoom = ref(0)

const handleZoomEnd = (newZoom: number) => {
  zoom.value = newZoom
}
</script>

<style lang="scss" scoped>
.sidebar {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
}
</style>

<template>
  <q-page class="vh-100">
    <div class="sidebar q-pa-md">
      <location-sidebar
        :location="selectedLocation"
        :zoom-level="zoom"
        :max-zoom-level="19"
        @show-image="addImageLocation"
        @reset-images="resetImageLocations" />
    </div>

    <full-map @click:location="handleLocationClick" @zoom:end="handleZoomEnd">
      <template v-for="location in imageLocations">
        <map-marker :location="location.coordinates" />
      </template>
    </full-map>
  </q-page>
</template>
