<script lang="ts" setup>
import { usePreferredReducedMotion } from '@vueuse/core'
import type { MapGeoJSONFeature } from 'maplibre-gl'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { getQueryParam } from 'src/shared/lib/urls'
import LocationSidebar from 'src/map/components/location-sidebar/location-sidebar.vue'

import HoverTrackerPlugin from 'src/shared/components/maplibre-gl/plugins/hover-tracker.vue'
import PanzoomTrackerPlugin from 'src/shared/components/maplibre-gl/plugins/panzoom-tracker.vue'

const router = useRouter()
const route = useRoute()

const coords = computed<{ lat: number; lng: number }>(() => {
  const lat = Number.parseFloat(getQueryParam(route.query.lat))
  const lng = Number.parseFloat(getQueryParam(route.query.lng))

  return { lat, lng }
})

const zoom = computed<number>(() => {
  return Number.parseFloat(getQueryParam(route.query.zoom))
})

const handlePoiClick = (poi?: MapGeoJSONFeature) => {
  if (poi?.geometry.type !== 'Point') return

  router.push({
    name: 'DetailsPage',
    query: {
      ...route.query,
      lat: poi.geometry.coordinates[1],
      lng: poi.geometry.coordinates[0],
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
      <div :key="String(coords.lat) + String(coords.lng)" class="q-pa-sm fit">
        <location-sidebar :coords="coords" :zoom="zoom" />
      </div>
    </transition>

    <div v-else class="row q-pa-sm">
      <location-sidebar :coords="coords" :zoom="zoom" />
    </div>

    <hover-tracker-plugin @poi-click="handlePoiClick" />
    <panzoom-tracker-plugin readonly />
  </q-drawer>
</template>
