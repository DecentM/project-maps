<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import LocationSidebar from 'src/components/location-sidebar/location-sidebar.vue'
import MaplibreGl from 'src/components/maplibre-gl/maplibre-gl.vue'
import MapAttribution from 'src/components/maplibre-gl/map-attribution.vue'

import MapHoverTrackerPlugin from 'src/components/maplibre-gl/plugins/hover-tracker.vue'
import MapPanzoomTrackerPlugin, {
  type PanZoom,
} from 'src/components/maplibre-gl/plugins/panzoom-tracker.vue'

const hoveredPoi = ref<GeoJSON.Feature<GeoJSON.Point, GeoJSON.GeoJsonProperties> | null>(null)
const selectedPoi = ref<GeoJSON.Feature<GeoJSON.Point, GeoJSON.GeoJsonProperties> | null>(null)

const route = useRoute()
const router = useRouter()

const panzoom = computed<PanZoom>(() => {
  return {
    center: [
      Array.isArray(route.params.lng) ? route.params.lng[0] : route.params.lng,
      Array.isArray(route.params.lat) ? route.params.lat[0] : route.params.lat,
    ],
    zoom: Array.isArray(route.params.zoom) ? route.params.zoom[0] : route.params.zoom,
  }
})

const handlePanzoomChange = (newPanzoom: PanZoom) => {
  router.push({
    name: route.name,
    params: {
      lng: newPanzoom.center[0],
      lat: newPanzoom.center[1],
      zoom: newPanzoom.zoom,
    },
  })
}

const handleMapClick = () => {
  selectedPoi.value = hoveredPoi.value
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
      />
    </div>

    <maplibre-gl
      class="vh-100"
      @click="handleMapClick"
    >
      <template v-slot="{ map }">
        <map-attribution />
        <map-hover-tracker-plugin v-if="map" :map="map" v-model="hoveredPoi" />
        <map-panzoom-tracker-plugin
          v-if="map"
          :map="map"
          :model-value="panzoom"
          @update:model-value="handlePanzoomChange" />
      </template>
    </maplibre-gl>
  </q-page>
</template>
