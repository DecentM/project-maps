<script lang="ts" setup>
import type { MapMouseEvent, Map as MaplibreGl } from 'maplibre-gl'
import { MapState, MapStateInput } from 'src/shared/lib/map-state-serialiser'
import { getQueryParam } from 'src/shared/lib/urls'
import { type ShallowRef, computed, inject, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const props = withDefaults(
  defineProps<{
    readonly?: boolean
  }>(),
  {
    readonly: false,
  }
)

const map = inject<ShallowRef<MaplibreGl>>('map')

const route = useRoute()
const router = useRouter()

const mapState = computed(() => MapState.fromString(getQueryParam(route.query.map)))

// const panzoom = computed<PanZoom>(() => {
//   return {
//     center: [
//       (Array.isArray(route.query.lng) ? route.query.lng[0] : route.query.lng) || '0',
//       (Array.isArray(route.query.lat) ? route.query.lat[0] : route.query.lat) || '0',
//     ],
//     zoom: (Array.isArray(route.query.zoom) ? route.query.zoom[0] : route.query.zoom) || '1',
//     pitch: (Array.isArray(route.query.pitch) ? route.query.pitch[0] : route.query.pitch) || '0',
//     bearing:
//       (Array.isArray(route.query.bearing) ? route.query.bearing[0] : route.query.bearing) || '0',
//   }
// })

const handleMapStateChange = async (newMapState: MapStateInput) => {
  if (props.readonly) return

  await router.push({
    name: route.name,
    query: {
      ...route.query,
      map: MapState.toString(newMapState),
    },
  })
}

const handleMoveEnd = async (event: MapMouseEvent) => {
  const newCenter = event.target.getCenter()
  const newZoom = event.target.getZoom()
  const newPitch = event.target.getPitch()
  const newBearing = event.target.getBearing()

  if (
    newCenter.lat === mapState.value?.coords.lat &&
    newCenter.lng === mapState.value?.coords.lng &&
    newZoom === mapState.value?.zoom &&
    newPitch === mapState.value?.pitch &&
    newBearing === mapState.value?.bearing
  )
    return

  await handleMapStateChange({
    coords: newCenter,
    zoom: newZoom,
    pitch: newPitch,
    bearing: newBearing,
  })
}

const initialised = ref(false)

const updateCursor = (cursor: string) => {
  if (!map?.value) return

  map.value.getCanvas().style.cursor = cursor
}

const handleDragend = (event: MapMouseEvent) => {
  updateCursor('default')
}

const handleDragstart = (event: MapMouseEvent) => {
  updateCursor('grabbing')
}

const init = (map: MaplibreGl) => {
  if (initialised.value || !mapState.value) return

  map.setZoom(mapState.value.zoom)
  map.setCenter(mapState.value.coords)
  map.setPitch(mapState.value.pitch)
  map.setBearing(mapState.value.bearing)

  map.on('dragstart', handleDragstart)
  map.on('dragend', handleDragend)
  map.on('moveend', handleMoveEnd)
  map.on('zoomend', handleMoveEnd)

  updateCursor('default')

  initialised.value = true
}

const dispose = () => {
  if (!map || !map.value) return

  map.value.off('dragend', handleDragend)
  map.value.off('dragstart', handleDragstart)
  map.value.off('moveend', handleMoveEnd)
  map.value.off('zoomend', handleMoveEnd)
}

if (map) {
  watch(map, (newMap) => {
    if (newMap) {
      init(newMap)
    }
  })

  onMounted(() => {
    if (map.value) {
      init(map.value)
    }
  })
}

onBeforeUnmount(() => dispose())
</script>

<template>
  <slot />
</template>
