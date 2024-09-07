<script lang="ts" setup>
import type { LngLat } from 'maplibre-gl'
import { useSocket } from 'src/lib/socketio'
import { onMounted, ref, watch } from 'vue'

const props = defineProps<{
  location: LngLat | null
}>()

const { socket } = useSocket()

const images = ref<string[]>([])

onMounted(() => {
  socket.on('LocationImages', (method, response) => {
    images.value = [...images.value, response.url]
  })
})

watch(
  () => props.location,
  (newLocation) => {
    images.value = []

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
      <q-img v-for="image in images" :key="image" :src="image" />
    </q-card-section>
  </q-card>
</template>
