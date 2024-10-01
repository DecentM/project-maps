<script lang="ts" setup>
import { computed, ref } from 'vue'
import type { Metadata } from '@project-maps/proto/metadata'
import type { LngLat } from 'maplibre-gl'

import LocationSidebar from 'src/components/location-sidebar/location-sidebar.vue'
import MaplibreGl from 'src/components/maplibre-gl/maplibre-gl.vue'
import MapDataLayer from 'src/components/maplibre-gl/map-data-layer.vue'
import { useRoute, useRouter } from 'vue-router'
import { classToIcon } from 'src/components/maplibre-gl/style/icon-mapping'

const selectedPoi = ref<GeoJSON.Feature<GeoJSON.Point, GeoJSON.GeoJsonProperties> | null>(null)

const handlePoiClick = (poi: GeoJSON.Feature<GeoJSON.Point, GeoJSON.GeoJsonProperties>) => {
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

const handleMoveEnd = (newCenter: LngLat) => {
  router.push({
    params: {
      zoom: zoom.value,
      lng: newCenter.lng.toFixed(6),
      lat: newCenter.lat.toFixed(6),
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

.poi {
  transform-origin: top center;
  max-width: 128px;

  &-avatar {
    outline: 1px solid lightgrey;
  }
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

    <maplibre-gl class="vh-100" @moveend="handleMoveEnd">
      <map-data-layer :layers="['data_z14', 'data_z15', 'data_z16']" :limit="50">
        <template #poi="{ poi }">
          <div class="poi column items-center text-center cursor-pointer" @click="handlePoiClick(poi)">
            <q-avatar
              v-if="poi.properties && poi.properties.class in classToIcon"
              :icon="classToIcon[poi.properties.class]"
              text-color="primary"
              size="sm"
              font-size="large"
              color="white"
              class="poi-avatar"
            />

            <q-avatar
              v-else
              icon="mdi-alert"
              text-color="white"
              size="sm"
              color="red"
              class="poi-avatar"
            />

            <span
              class="text-grey-9 font-noto-sans-display text-italic text-caption text-outline-white"
            >
              {{
                poi.properties?.["name_int"] ||
                poi.properties?.["name:latin"] ||
                poi.properties?.["name"]
              }}
            </span>
          </div>
        </template>
      </map-data-layer>
    </maplibre-gl>
  </q-page>
</template>
