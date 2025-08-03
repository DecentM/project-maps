<script lang="ts" setup>
import { usePreferredReducedMotion } from '@vueuse/core'
import type { MapGeoJSONFeature } from 'maplibre-gl'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import LocationSidebar from 'src/map/components/location-sidebar/location-sidebar.vue'

import GlobeControlPlugin from 'src/shared/components/maplibre-gl/plugins/globe-control.vue'
import HoverTrackerPlugin from 'src/shared/components/maplibre-gl/plugins/hover-tracker.vue'
import NavigationControlPlugin from 'src/shared/components/maplibre-gl/plugins/navigation-control.vue'
import PanzoomTrackerPlugin from 'src/shared/components/maplibre-gl/plugins/panzoom-tracker.vue'

const router = useRouter()
const route = useRoute()

const id = computed(() => {
  return route.params.id as string
})

const handlePoiClick = (poi: MapGeoJSONFeature | null) => {
  if (!poi || poi.geometry.type !== 'Point' || !poi.properties || !poi.properties.osm_id) {
    return
  }

  router.push({
    name: 'DetailsPage',
    query: route.query,
    params: {
      id: poi.properties.osm_id,
    },
  })
}

const reducedMotion = usePreferredReducedMotion()
</script>

<template>
  <q-drawer
    model-value
    behavior="desktop"
    side="left"
    :width="400"
  >
    <transition v-if="reducedMotion === 'no-preference'" name="fade-up" mode="out-in">
      <div :key="id" class="q-pa-sm fit">
        <location-sidebar :poi-osm-id="id" />
      </div>
    </transition>

    <div v-else class="row q-pa-sm">
      <location-sidebar :poi-osm-id="id" />
    </div>

    <hover-tracker-plugin @poi-click="handlePoiClick" />
    <globe-control-plugin />
    <panzoom-tracker-plugin />
    <navigation-control-plugin />
  </q-drawer>
</template>
