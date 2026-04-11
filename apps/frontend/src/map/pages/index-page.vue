<script lang="ts" setup>
import type { MapGeoJSONFeature } from 'maplibre-gl'
import { useRoute, useRouter } from 'vue-router'

import { MapState } from 'src/shared/lib/map-state-serialiser'
import { getQueryParam } from 'src/shared/lib/urls'

import GeolocateControlPlugin from 'src/shared/components/maplibre-gl/plugins/geolocate-control.vue'
import GlobeControlPlugin from 'src/shared/components/maplibre-gl/plugins/globe-control.vue'
import HoverTrackerPlugin from 'src/shared/components/maplibre-gl/plugins/hover-tracker.vue'
import NavigationControlPlugin from 'src/shared/components/maplibre-gl/plugins/navigation-control.vue'
import PanzoomTrackerPlugin from 'src/shared/components/maplibre-gl/plugins/panzoom-tracker.vue'

const router = useRouter()
const route = useRoute()

const handlePoiClick = (poi?: MapGeoJSONFeature) => {
  if (poi?.geometry.type !== 'Point') return

  const oldMapState = MapState.fromString(getQueryParam(route.query.map))

  router.push({
    name: 'DetailsPage',
    query: {
      map: MapState.toString({
        ...oldMapState,
        coords: {
          lat: poi.geometry.coordinates[1],
          lng: poi.geometry.coordinates[0],
        },
      }),
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
