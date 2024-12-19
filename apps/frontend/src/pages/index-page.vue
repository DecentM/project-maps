<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue'
import type { Image } from '@project-maps/proto/metadata'
import { LngLat } from 'maplibre-gl'

import LocationSidebar from 'src/components/location-sidebar/location-sidebar.vue'
import MaplibreGl from 'src/components/maplibre-gl/maplibre-gl.vue'
import MapAttribution from 'src/components/maplibre-gl/map-attribution.vue'
import { useRoute, useRouter } from 'vue-router'
// import { classToIcon } from '@project-maps/map-style'

const selectedPoi = ref<GeoJSON.Feature<GeoJSON.Point, GeoJSON.GeoJsonProperties> | null>(null)

// const handlePoiClick = (poi: GeoJSON.Feature<GeoJSON.Point, GeoJSON.GeoJsonProperties>) => {
//   selectedPoi.value = poi
// }

const imageLocations = ref<Image[]>([])

const addImageLocation = (location: Image) => {
  imageLocations.value = [...imageLocations.value, location]
}

const resetImageLocations = () => {
  imageLocations.value = []
}

// TODO: This state isn't synced back to the map, only from map to url
const route = useRoute()
const router = useRouter()

const defaultZoom = computed(() => {
  return Number.parseFloat(
    (Array.isArray(route.params.zoom) ? route.params.zoom[0] : route.params.zoom) || '16.25'
  )
})

const defaultCenter = computed<LngLat>(() => {
  return new LngLat(
    Number.parseFloat(
      Array.isArray(route.params.lng) ? route.params.lng[0] : route.params.lng || '53.23258'
    ),
    Number.parseFloat(
      (Array.isArray(route.params.lat) ? route.params.lat[0] : route.params.lat) || '-1.41866'
    )
  )
})

const zoom = ref(0)
const center = ref<LngLat | null>(null)

onMounted(() => {
  zoom.value = defaultZoom.value
  center.value = defaultCenter.value
})

const ZOOM_ACCURACY = 3
const LATLNG_ACCURACY = 6

const handleMoveEnd = (newCenter: LngLat) => {
  if (
    !newCenter ||
    (newCenter.lat.toFixed(LATLNG_ACCURACY) === center.value?.lat.toFixed(LATLNG_ACCURACY) &&
      newCenter.lng.toFixed(LATLNG_ACCURACY) === center.value?.lng.toFixed(LATLNG_ACCURACY))
  )
    return

  center.value = newCenter
}

const handleZoomEnd = (newZoom: number) => {
  if (newZoom.toFixed(ZOOM_ACCURACY) === zoom.value.toFixed(ZOOM_ACCURACY)) return

  zoom.value = newZoom
}

watch(zoom, (newZoom) => {
  if (!center.value) return

  router.push({
    params: {
      zoom: encodeURIComponent(newZoom.toFixed(ZOOM_ACCURACY)),
      lat: encodeURIComponent(center.value.lat.toFixed(LATLNG_ACCURACY)),
      lng: encodeURIComponent(center.value.lng.toFixed(LATLNG_ACCURACY)),
    },
  })
})

watch(center, (newCenter) => {
  if (!newCenter) return

  router.push({
    params: {
      zoom: encodeURIComponent(zoom.value.toFixed(ZOOM_ACCURACY)),
      lat: encodeURIComponent(newCenter.lat.toFixed(LATLNG_ACCURACY)),
      lng: encodeURIComponent(newCenter.lng.toFixed(LATLNG_ACCURACY)),
    },
  })
})

const handleMapClick = () => {
  selectedPoi.value = null
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
        @reset-images="resetImageLocations"
      />
    </div>

    <maplibre-gl
      v-if="center && zoom"
      class="vh-100"
      @moveend="handleMoveEnd"
      @zoomend="handleZoomEnd"
      @click="handleMapClick"
      :center="center"
      :zoom="zoom"
    >
      <map-attribution />
    </maplibre-gl>
  </q-page>
</template>
