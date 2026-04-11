<script lang="ts" setup>
import { useMemoize, usePreferredReducedMotion } from '@vueuse/core'
import type { MapGeoJSONFeature } from 'maplibre-gl'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { getQueryParam } from 'src/shared/lib/urls'
import { SelectionState } from 'src/shared/lib/map-selection-serialiser'

import LocationSidebar from 'src/map/components/location-sidebar/location-sidebar.vue'

import GeolocateControlPlugin from 'src/shared/components/maplibre-gl/plugins/geolocate-control.vue'
import GlobeControlPlugin from 'src/shared/components/maplibre-gl/plugins/globe-control.vue'
import HoverTrackerPlugin from 'src/shared/components/maplibre-gl/plugins/hover-tracker.vue'
import NavigationControlPlugin from 'src/shared/components/maplibre-gl/plugins/navigation-control.vue'
import PanzoomTrackerPlugin from 'src/shared/components/maplibre-gl/plugins/panzoom-tracker.vue'

const router = useRouter()
const route = useRoute()

const getSelectionState = useMemoize((selection: string) => SelectionState.fromString(selection))

const selectionState = computed(() => getSelectionState(getQueryParam(route.query.selection)))

const handlePoiClick = (poi?: MapGeoJSONFeature) => {
  if (poi?.geometry.type !== 'Point') return

  const oldSelectionState = SelectionState.fromString(getQueryParam(route.query.selection))

  router.push({
    name: 'DetailsPage',
    query: {
      ...route.query,
      selection: SelectionState.toString({
        ...oldSelectionState,
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
    v-if="selectionState"
    model-value
    behavior="desktop"
    side="left"
    :width="400"
  >
    <transition v-if="reducedMotion !== 'reduce'" name="fade-up" mode="out-in">
      <div :key="`${selectionState.coords.lat}${selectionState.coords.lng}`" class="q-pa-sm fit">
        <location-sidebar :coords="selectionState.coords" :zoom="selectionState.zoom" />
      </div>
    </transition>

    <div v-else class="row q-pa-sm">
      <location-sidebar :key="`${selectionState.coords.lat}${selectionState.coords.lng}`" :coords="selectionState.coords" :zoom="selectionState.zoom" />
    </div>

    <hover-tracker-plugin @poi-click="handlePoiClick" />
    <globe-control-plugin />
    <panzoom-tracker-plugin />
    <geolocate-control-plugin />
    <navigation-control-plugin />
  </q-drawer>
</template>
