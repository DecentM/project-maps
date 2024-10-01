<script lang="ts" setup>
import MaplibreGl from 'src/components/maplibre-gl/maplibre-gl.vue'
import MapMarker from 'src/components/maplibre-gl/map-marker.vue'
import MapPoiLayer from 'src/components/maplibre-gl/map-poi-layer.vue'
</script>

<template>
  <maplibre-gl class="vh-100">
    <map-marker
      :coordinates="[-1.422504, 53.235409]"
      :options="{ offset: [0, 0] }"
    >
      <template #default="{ map }">
        <q-btn
          flat
          dense
          round
          @click="
            () =>
              console.log(
                map?.queryRenderedFeatures(undefined, {
                  layers: ['poi_z14', 'poi_z15', 'poi_z16'],
                }).map((feature) => feature.geometry)
              )
          "
        >
          <q-icon color="primary" size="xl" name="mdi-map-marker" />
        </q-btn>
      </template>
    </map-marker>

    <map-poi-layer />
  </maplibre-gl>
</template>
