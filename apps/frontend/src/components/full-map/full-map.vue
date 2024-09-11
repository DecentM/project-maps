<script lang="ts" setup>
import { center } from '@turf/turf'
import {
  LngLat,
  type Map as MglMap,
  type MapGeoJSONFeature,
  type RequestParameters,
  type MapMouseEvent,
} from 'maplibre-gl'
import type { Poi } from 'src/lib/poi'
import { computed, onBeforeMount, onMounted, ref } from 'vue'
import { type MglEvent, MglDefaults } from 'vue-maplibre-gl'

const map = ref<MglMap>()
const loaded = ref(0)

const hoveringPois = ref<unknown[]>([])

const updateCanvasStyle = () => {
  const canvas = map.value?.getCanvas()
  if (!canvas) return

  canvas.style.cursor = hoveringPois.value.length ? 'pointer' : 'grab'
}

const handlePoiClick = (
  event: MapMouseEvent & {
    features?: MapGeoJSONFeature[]
  }
) => {
  let id = event.features?.[0]?.id

  if (!id) id = 0
  if (typeof id === 'string') id = Number.parseInt(id, 10)

  const featureCenter = center(event.features![0]).geometry.coordinates

  emit('click:poi', {
    id,
    coordinates: {
      lng: featureCenter[0],
      lat: featureCenter[1],
    },
    name:
      event.features![0].properties?.name || event.features![0].properties?.['name:latin'] || '',
  })
}

const handleLoad = (event: MglEvent) => {
  loaded.value++

  map.value = event.map

  map.value.on('mouseenter', 'poi_z16', (mouseoverEvent) => {
    if (!mouseoverEvent.features?.[0]) return
    hoveringPois.value = [...hoveringPois.value, mouseoverEvent.features[0]]
    updateCanvasStyle()
  })

  map.value.on('mouseleave', 'poi_z16', () => {
    hoveringPois.value = (hoveringPois.value as MapGeoJSONFeature[]).slice(0, -1)
    updateCanvasStyle()
  })

  map.value.on('click', 'poi_z16', (clickEvent) => {
    handlePoiClick(clickEvent)
  })

  map.value.on('mouseenter', 'poi_z15', (mouseoverEvent) => {
    if (!mouseoverEvent.features?.[0]) return
    hoveringPois.value = [...hoveringPois.value, mouseoverEvent.features[0]]
    updateCanvasStyle()
  })

  map.value.on('mouseleave', 'poi_z15', () => {
    hoveringPois.value = (hoveringPois.value as MapGeoJSONFeature[]).slice(0, -1)
    updateCanvasStyle()
  })

  map.value.on('click', 'poi_z15', (clickEvent) => {
    handlePoiClick(clickEvent)
  })

  map.value.on('mouseenter', 'poi_z14', (mouseoverEvent) => {
    if (!mouseoverEvent.features?.[0]) return
    hoveringPois.value = [...hoveringPois.value, mouseoverEvent.features[0]]
    updateCanvasStyle()
  })

  map.value.on('mouseleave', 'poi_z14', () => {
    hoveringPois.value = (hoveringPois.value as MapGeoJSONFeature[]).slice(0, -1)
    updateCanvasStyle()
  })

  map.value.on('click', 'poi_z14', (clickEvent) => {
    handlePoiClick(clickEvent)
  })
}

const mapCenter = ref<LngLat>(new LngLat(-0.159481, 51.522132))

const handleMove = (event: MglEvent) => {
  const newCenter = event.map.getCenter()
  mapCenter.value = newCenter
}

const zoom = ref(16.25)

const handleZoom = (event: MglEvent) => {
  if (zoom.value === event.map.getZoom()) {
    return
  }

  zoom.value = event.map.getZoom()
}

onBeforeMount(() => {
  MglDefaults.style = `http://${window.location.hostname}:3000/styles/style/light.json`
  MglDefaults.center = [mapCenter.value.lng, mapCenter.value.lat]
  MglDefaults.zoom = zoom.value
})

onMounted(() => {
  emit('move:end', zoom.value, mapCenter.value)
})

const transformRequest = (url: string, resourceType: string): RequestParameters => {
  return {
    url: url
      .replace(/\{tileUrlBase\}/gu, `http://${window.location.hostname}:3000/tile`)
      .replace(/\{spritesUrlBase\}/gu, `http://${window.location.hostname}:3000/icons/sprites`)
      .replace(/\{fontsUrlBase\}/gu, `http://${window.location.hostname}:3000/fonts`),
  }
}

const emit = defineEmits<{
  (event: 'click:poi', poi: Poi): void
  (event: 'move:end', zoom: number, location: LngLat): void
}>()

const isDev = process.env.NODE_ENV === 'development'

const mapStyle = computed(() => {
  return hoveringPois.value.length
    ? {
        cursor: 'pointer',
      }
    : {}
})
</script>

<template>
  <mgl-map
    :attribution-control="true"
    :max-zoom="19"
    :transform-request="transformRequest"
    :style="mapStyle"
    :fade-duration="300"
    @map:load="handleLoad"
    @map:move="handleMove"
    @map:zoom="handleZoom"
    @map:moveend="() => emit('move:end', zoom, mapCenter)"
  >
    <mgl-frame-rate-control v-if="isDev" />
    <mgl-fullscreen-control />
    <mgl-attribution-control />
    <mgl-navigation-control />
    <mgl-scale-control />
    <mgl-geolocation-control />

    <slot />
  </mgl-map>
</template>
