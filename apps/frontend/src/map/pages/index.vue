<script lang="ts" setup>
import type { MapGeoJSONFeature } from 'maplibre-gl'
import { useRoute, useRouter } from 'vue-router'

import GeolocateControlPlugin from 'src/shared/components/maplibre-gl/plugins/geolocate-control.vue'
import GlobeControlPlugin from 'src/shared/components/maplibre-gl/plugins/globe-control.vue'
import HoverTrackerPlugin from 'src/shared/components/maplibre-gl/plugins/hover-tracker.vue'
import NavigationControlPlugin from 'src/shared/components/maplibre-gl/plugins/navigation-control.vue'
import PanzoomTrackerPlugin from 'src/shared/components/maplibre-gl/plugins/panzoom-tracker.vue'

const router = useRouter()
const route = useRoute()

const handlePoiClick = (poi: MapGeoJSONFeature | null) => {
  if (!poi?.properties?.osm_id || !poi?.properties?.osm_type) {
    return
  }

  router.push({
    name: 'DetailsPage',
    query: route.query,
    params: {
      id: poi.properties.osm_id,
      type: poi.properties.osm_type,
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
  <div>
    <hover-tracker-plugin @poi-click="handlePoiClick" />
    <globe-control-plugin />
    <panzoom-tracker-plugin />
    <geolocate-control-plugin />
    <navigation-control-plugin />
  </div>
</template>
