<script lang="ts" setup>
import type { MapGeoJSONFeature } from 'maplibre-gl'

import PanzoomTrackerPlugin from 'src/components/maplibre-gl/plugins/panzoom-tracker.vue'
import HoverTrackerPlugin from 'src/components/maplibre-gl/plugins/hover-tracker.vue'
import GlobeControlPlugin from 'src/components/maplibre-gl/plugins/globe-control.vue'
import GeolocateControlPlugin from 'src/components/maplibre-gl/plugins/geolocate-control.vue'
import NavigationControlPlugin from 'src/components/maplibre-gl/plugins/navigation-control.vue'
import ScaleControlPlugin from 'src/components/maplibre-gl/plugins/scale-control.vue'
import AttributionControlPlugin from 'src/components/maplibre-gl/plugins/attribution-control.vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()

const handlePoiClick = (poi: MapGeoJSONFeature | null) => {
  if (!poi || poi.geometry.type !== 'Point' || !poi.properties || !poi.properties.osm_id) {
    return
  }

  router.push({
    name: 'DetailsPage',
    params: {
      ...route.params,
      id: poi.properties.osm_id,
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
  <div class="q-pa-sm q-gutter-md">
    <attribution-control-plugin />
    <hover-tracker-plugin @poi-click="handlePoiClick" />
    <globe-control-plugin />
    <panzoom-tracker-plugin />
    <geolocate-control-plugin />
    <navigation-control-plugin />
    <scale-control-plugin />
  </div>
</template>
