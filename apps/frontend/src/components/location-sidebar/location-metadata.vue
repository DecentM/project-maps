<script lang="ts" setup>
import type { LocationMetadataOverpass } from '@project-maps/proto/location-metadata/overpass'
import type { LngLat } from 'maplibre-gl'
import { onMounted, ref, watch } from 'vue'

import { useSocket } from 'src/lib/socketio'

const props = defineProps<{
  location: LngLat | null
  zoomLevel: number
  maxZoomLevel: number
}>()

const { socket } = useSocket()

const metadata = ref<ReturnType<
  LocationMetadataOverpass.GetLocationMetadataOutput['toObject']
> | null>(null)

onMounted(() => {
  socket.on('LocationMetadata', (method, response) => {
    if (method !== 'GetLocationMetadata') return

    metadata.value = response
  })
})

watch(
  () => props.location,
  (newLocation) => {
    metadata.value = null

    if (!newLocation) {
      return
    }

    socket.emit('LocationMetadata', 'GetLocationMetadata', {
      coordinates: {
        lat: String(newLocation.lat ?? 0),
        lng: String(newLocation.lng ?? 0),
      },
      radiusMeters: 10,
    })
  }
)
</script>

<template>
  <transition name="fade" mode="out-in">
    <div class="relative-position" v-if="metadata">
      {{ metadata }}
    </div>

    <q-card-section v-else>
      <slot />
    </q-card-section>
  </transition>
</template>
