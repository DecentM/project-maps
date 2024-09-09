<script lang="ts" setup>
import type { LngLat } from 'maplibre-gl'
import { onMounted, ref, watch } from 'vue'

import type { Metadata } from '@project-maps/proto/metadata'
import { useSocket } from 'src/lib/socketio'

import LocationImage from './location-image.vue'
import LocationMetadata from './location-metadata.vue'
import LocationComments from './location-comments.vue'

const props = defineProps<{
  location: LngLat | null
  zoomLevel: number
  maxZoomLevel: number
}>()

const { socket } = useSocket()

const metadata = ref<ReturnType<Metadata.AreaMetadataItem['toObject']>[]>([])

onMounted(() => {
  socket.on('Metadata', (method, response) => {
    if (method !== 'GetAreaMetadata') return

    metadata.value = [...metadata.value, response]
  })
})

watch(
  () => props.location,
  (newLocation) => {
    metadata.value = []

    if (!newLocation) {
      return
    }

    socket.emit('Metadata', 'GetAreaMetadata', {
      coordinates: {
        lat: String(newLocation.lat ?? 0),
        lng: String(newLocation.lng ?? 0),
      },
      radiusMeters: Math.ceil(Math.log(props.maxZoomLevel / props.zoomLevel) * 150 + 10),
    })
  }
)
</script>

<style lang="scss" scoped>
.location-sidebar {
  width: 400px;
  overflow-y: auto;
  max-height: calc(100vh - 32px);
}
</style>

<template>
  <q-card class="location-sidebar">
    <location-image
      :metadata="metadata"
    >
      <q-card>
        <q-input :model-value="''" outlined placeholder="Search..." dense />
      </q-card>
    </location-image>

    <location-metadata :metadata="metadata" />

    <location-comments :metadata="metadata" />
  </q-card>
</template>
