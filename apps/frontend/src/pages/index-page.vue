<script lang="ts" setup>
import { ref } from 'vue'
import type { MapGeoJSONFeature } from 'maplibre-gl'

import LocationSidebar from 'src/components/location-sidebar/location-sidebar.vue'

import PanzoomTrackerPlugin from 'src/components/maplibre-gl/plugins/panzoom-tracker.vue'
import HoverTrackerPlugin from 'src/components/maplibre-gl/plugins/hover-tracker.vue'
import GlobeControlPlugin from 'src/components/maplibre-gl/plugins/globe-control.vue'
import GeolocateControlPlugin from 'src/components/maplibre-gl/plugins/geolocate-control.vue'
import NavigationControlPlugin from 'src/components/maplibre-gl/plugins/navigation-control.vue'
import ScaleControlPlugin from 'src/components/maplibre-gl/plugins/scale-control.vue'
import AttributionControlPlugin from 'src/components/maplibre-gl/plugins/attribution-control.vue'

const selectedPoi = ref<GeoJSON.Feature<GeoJSON.Point, GeoJSON.GeoJsonProperties> | null>(null)

const handlePoiClick = (poi: MapGeoJSONFeature | null) => {
  if (!poi || poi.geometry.type !== 'Point') {
    selectedPoi.value = null
    return
  }

  selectedPoi.value = poi as GeoJSON.Feature<GeoJSON.Point, GeoJSON.GeoJsonProperties>
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
  <div class="q-pa-sm q-gutter-md">
    <location-sidebar
      :poi="selectedPoi"
    />

    <attribution-control-plugin />
    <hover-tracker-plugin @poi-click="handlePoiClick" />
    <globe-control-plugin />
    <panzoom-tracker-plugin />
    <geolocate-control-plugin />
    <navigation-control-plugin />
    <scale-control-plugin />
  </div>
</template>
