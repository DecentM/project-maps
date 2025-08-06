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

const type = computed(() => {
  return route.params.type as 'node' | 'way' | 'relation'
})

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
        <location-sidebar :poi-osm-id="id" :poi-osm-type="type" />
      </div>
    </transition>

    <div v-else class="row q-pa-sm">
      <location-sidebar :poi-osm-id="id" :poi-osm-type="type" />
    </div>

    <hover-tracker-plugin @poi-click="handlePoiClick" />
    <globe-control-plugin />
    <panzoom-tracker-plugin />
    <navigation-control-plugin />
  </q-drawer>
</template>
