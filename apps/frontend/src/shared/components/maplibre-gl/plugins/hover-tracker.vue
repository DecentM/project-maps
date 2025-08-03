<template>
  <slot />
</template>

<script lang="ts" setup>
import type { MapGeoJSONFeature, MapMouseEvent, Map as MaplibreGl } from 'maplibre-gl'
import { useOsmCache } from 'src/shared/lib/osm-cache'
import { type ShallowRef, inject, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const map = inject<ShallowRef<MaplibreGl>>('map')

const emit = defineEmits<(event: 'poi-click', poi: MapGeoJSONFeature | null) => void>()

const CLICKABLE_LAYERS = [
  'poi-amenity',
  'poi-emergency',
  'poi-historic',
  'poi-leisure',
  'poi-man_made',
  'poi-office',
  'poi-shop',
  'poi-tourism',
] as const

const osmCache = useOsmCache()

const handlePoiClick = async (event: MapMouseEvent) => {
  const features =
    map?.value?.queryRenderedFeatures(event.point, {
      layers: [...CLICKABLE_LAYERS],
    }) ?? []

  if (!features.length) {
    emit('poi-click', null)
    return
  }

  emit('poi-click', features[0])
}

const updateCursor = (hovered: boolean) => {
  if (!map?.value) return

  if (hovered) {
    map.value.getCanvas().style.cursor = 'pointer'
  } else {
    map.value.getCanvas().style.cursor = 'default'
  }
}

const handlePoiHover = async (event: MapMouseEvent) => {
  updateCursor(true)

  const features =
    map?.value?.queryRenderedFeatures(event.point, {
      layers: [...CLICKABLE_LAYERS],
    }) ?? []

  for (const feature of features) {
    osmCache.set(feature)
  }
}

const handlePoiUnhover = () => {
  updateCursor(false)
}

const initialised = ref(false)

const init = (newMap: MaplibreGl) => {
  if (initialised.value) return

  for (const layer of CLICKABLE_LAYERS) {
    newMap.on('mouseenter', layer, handlePoiHover)
    newMap.on('mouseleave', layer, handlePoiUnhover)
    newMap.on('click', layer, handlePoiClick)
  }

  initialised.value = true
}

const dispose = () => {
  if (!map || !map.value) return

  for (const layer of CLICKABLE_LAYERS) {
    map.value.off('mouseenter', layer, handlePoiHover)
    map.value.off('mouseleave', layer, handlePoiUnhover)
    map.value.off('click', layer, handlePoiClick)
  }

  updateCursor(false)
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
