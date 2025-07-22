<script lang="ts" setup>
import { ref } from 'vue'

import LocationSidebar from 'src/components/location-sidebar/location-sidebar.vue'
import MaplibreGl from 'src/components/maplibre-gl/maplibre-gl.vue'

import PanzoomTrackerPlugin from 'src/components/maplibre-gl/plugins/panzoom-tracker.vue'
import HoverTrackerPlugin from 'src/components/maplibre-gl/plugins/hover-tracker.vue'
import GlobeControlPlugin from 'src/components/maplibre-gl/plugins/globe-control.vue'
import GeolocateControlPlugin from 'src/components/maplibre-gl/plugins/geolocate-control.vue'
import NavigationControlPlugin from 'src/components/maplibre-gl/plugins/navigation-control.vue'
import ScaleControlPlugin from 'src/components/maplibre-gl/plugins/scale-control.vue'
import AttributionControlPlugin from 'src/components/maplibre-gl/plugins/attribution-control.vue'

const hoveredPoi = ref<GeoJSON.Feature<GeoJSON.Point, GeoJSON.GeoJsonProperties> | null>(null)
const selectedPoi = ref<GeoJSON.Feature<GeoJSON.Point, GeoJSON.GeoJsonProperties> | null>(null)

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
      :min-pitch="0"
      :max-pitch="80"
    >
      <template v-slot="{ map }">
        <attribution-control-plugin v-if="map" :map="map" />
        <hover-tracker-plugin v-if="map" :map="map" v-model="hoveredPoi" />
        <globe-control-plugin v-if="map" :map="map" />
        <panzoom-tracker-plugin v-if="map" :map="map" />
        <geolocate-control-plugin v-if="map" :map="map" />
        <navigation-control-plugin v-if="map" :map="map" />
        <scale-control-plugin v-if="map" :map="map" />
      </template>
    </maplibre-gl>
  </q-page>
</template>
