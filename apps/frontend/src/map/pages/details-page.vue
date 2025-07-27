<script lang="ts" setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { MapGeoJSONFeature } from 'maplibre-gl'

import LocationSidebar from 'src/map/components/location-sidebar/location-sidebar.vue'

import PanzoomTrackerPlugin from 'src/shared/components/maplibre-gl/plugins/panzoom-tracker.vue'
import HoverTrackerPlugin from 'src/shared/components/maplibre-gl/plugins/hover-tracker.vue'
import GlobeControlPlugin from 'src/shared/components/maplibre-gl/plugins/globe-control.vue'
import NavigationControlPlugin from 'src/shared/components/maplibre-gl/plugins/navigation-control.vue'
import ScaleControlPlugin from 'src/shared/components/maplibre-gl/plugins/scale-control.vue'
import AttributionControlPlugin from 'src/shared/components/maplibre-gl/plugins/attribution-control.vue'

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
</script>

<template>
  <div class="q-pa-sm q-gutter-md">
    <transition name="fade-up" mode="out-in">
      <div :key="id">
        <location-sidebar :poi-osm-id="id" />
      </div>
    </transition>

    <attribution-control-plugin />
    <hover-tracker-plugin @poi-click="handlePoiClick" />
    <globe-control-plugin />
    <panzoom-tracker-plugin />
    <navigation-control-plugin />
    <scale-control-plugin />
  </div>
</template>
