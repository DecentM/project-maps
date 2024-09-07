<script lang="ts" setup>
import type { LocationImages } from '@project-maps/proto/location-images'
import type { LngLat } from 'maplibre-gl'
import { useSocket } from 'src/lib/socketio'
import { onMounted, ref, watch } from 'vue'

const props = defineProps<{
  location: LngLat | null
}>()

const { socket } = useSocket()

const images = ref<LocationImages.LocationImage[]>([])

onMounted(() => {
  socket.on('LocationImages', (method, response) => {
    images.value = [...images.value, response]
    emit('show-image', response)
  })
})

const emit = defineEmits<{
  (event: 'show-image', image: LocationImages.LocationImage): void
  (event: 'reset-images'): void
}>()

watch(
  () => props.location,
  (newLocation) => {
    images.value = []
    emit('reset-images')

    if (!newLocation) {
      return
    }

    socket.emit('LocationImages', 'GetLocationImages', {
      coordinates: {
        lat: String(newLocation.lat ?? 0),
        lng: String(newLocation.lng ?? 0),
      },
    })
  }
)
</script>

<style lang="scss" scoped>
.location-sidebar {
  width: 400px;
  pointer-events: initial;
  overflow-y: auto;
  max-height: 90vh;
}
</style>

<template>
  <q-card class="location-sidebar">
    <q-card-section>
      <q-input
        :model-value="''"
        outlined
        placeholder="Search..."
        dense
      />
    </q-card-section>
    <q-card-section v-if="images.length">
      <q-img v-for="image in images" :key="image.url" :src="image.url" />
    </q-card-section>
  </q-card>
</template>
