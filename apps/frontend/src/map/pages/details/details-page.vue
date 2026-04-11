<script lang="ts" setup>
import { usePreferredReducedMotion } from '@vueuse/core'
import type { MapGeoJSONFeature } from 'maplibre-gl'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { getQueryParam } from 'src/shared/lib/urls'
import { MapState } from 'src/shared/lib/map-state-serialiser'

import LocationSidebar from 'src/map/components/location-sidebar/location-sidebar.vue'

import GeolocateControlPlugin from 'src/shared/components/maplibre-gl/plugins/geolocate-control.vue'
import GlobeControlPlugin from 'src/shared/components/maplibre-gl/plugins/globe-control.vue'
import HoverTrackerPlugin from 'src/shared/components/maplibre-gl/plugins/hover-tracker.vue'
import NavigationControlPlugin from 'src/shared/components/maplibre-gl/plugins/navigation-control.vue'
import PanzoomTrackerPlugin from 'src/shared/components/maplibre-gl/plugins/panzoom-tracker.vue'

const router = useRouter()
const route = useRoute()

const mapState = computed(() => MapState.fromString(getQueryParam(route.query.map)))

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

const reducedMotion = usePreferredReducedMotion()
</script>

<template>
  <q-drawer
    v-if="mapState"
    model-value
    behavior="desktop"
    side="left"
    :width="400"
  >
    <transition v-if="reducedMotion === 'no-preference'" name="fade-up" mode="out-in">
      <div :key="String(mapState.coords.lat) + String(mapState.coords.lng)" class="q-pa-sm fit">
        <location-sidebar :coords="mapState.coords" :zoom="mapState.zoom" />
      </div>
    </transition>

    <div v-else class="row q-pa-sm">
      <location-sidebar :coords="mapState.coords" :zoom="mapState.zoom" />
    </div>

    <hover-tracker-plugin @poi-click="handlePoiClick" />
    <globe-control-plugin />
    <panzoom-tracker-plugin />
    <geolocate-control-plugin />
    <navigation-control-plugin />
  </q-drawer>
</template>
