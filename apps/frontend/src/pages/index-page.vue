<script lang="ts" setup>
import { computed, ref } from 'vue'
import type { Metadata } from '@project-maps/proto/metadata'
import type { LngLat } from 'maplibre-gl'

import type { Poi } from 'src/lib/poi'
import FullMap from 'src/components/full-map/full-map.vue'
import LocationSidebar from 'src/components/location-sidebar/location-sidebar.vue'
import MapMarker from 'src/components/full-map/map-marker.vue'
import { useRoute, useRouter } from 'vue-router'

const selectedPoi = ref<Poi | null>(null)

const handlePoiClick = (poi: Poi) => {
  selectedPoi.value = poi
}

const imageLocations = ref<Metadata.Image[]>([])

const addImageLocation = (location: Metadata.Image) => {
  imageLocations.value = [...imageLocations.value, location]
}

const resetImageLocations = () => {
  imageLocations.value = []
}

// TODO: This state isn't synced back to the map, only from map to url
const route = useRoute()
const router = useRouter()

const zoom = computed(() => {
  return route.params.zoom ? Number.parseFloat(route.params.zoom as string) : 0
})

const handleMoveEnd = (newZoom: number, newCenter: LngLat) => {
  router.push({
    params: {
      lng: newCenter.lng.toFixed(6),
      lat: newCenter.lat.toFixed(6),
      zoom: newZoom.toFixed(2),
    },
  })
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
        :poi="selectedPoi"
        :zoom-level="zoom"
        :max-zoom-level="19"
        @show-image="addImageLocation"
        @reset-images="resetImageLocations" />
    </div>

    <full-map @click:poi="handlePoiClick" @move:end="handleMoveEnd">
      <template v-for="location in imageLocations">
        <map-marker :location="location.coordinates" />
      </template>
    </full-map>
  </q-page>
</template>
