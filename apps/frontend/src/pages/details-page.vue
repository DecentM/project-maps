<script lang="ts" setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { MapGeoJSONFeature } from 'maplibre-gl'

import LocationSidebar from 'src/components/location-sidebar/location-sidebar.vue'

import ScaleControlPlugin from 'src/components/maplibre-gl/plugins/scale-control.vue'
import AttributionControlPlugin from 'src/components/maplibre-gl/plugins/attribution-control.vue'
import HoverTrackerPlugin from 'src/components/maplibre-gl/plugins/hover-tracker.vue'
import PanzoomTrackerPlugin from 'src/components/maplibre-gl/plugins/panzoom-tracker.vue'

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
    params: {
      ...route.params,
      id: poi.properties.osm_id,
    },
  })
}
</script>

<template>
  <div class="q-pa-sm q-gutter-md">
    <location-sidebar :poi-osm-id="id" />

    <attribution-control-plugin />
    <scale-control-plugin />
    <hover-tracker-plugin @poi-click="handlePoiClick" />
    <panzoom-tracker-plugin />
  </div>
</template>
