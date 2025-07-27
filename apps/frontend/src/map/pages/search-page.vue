<script lang="ts" setup>
import PanzoomTrackerPlugin from 'src/shared/components/maplibre-gl/plugins/panzoom-tracker.vue'
import GlobeControlPlugin from 'src/shared/components/maplibre-gl/plugins/globe-control.vue'
import NavigationControlPlugin from 'src/shared/components/maplibre-gl/plugins/navigation-control.vue'
import ScaleControlPlugin from 'src/shared/components/maplibre-gl/plugins/scale-control.vue'
import AttributionControlPlugin from 'src/shared/components/maplibre-gl/plugins/attribution-control.vue'
</script>

<template>
  <attribution-control-plugin />
  <globe-control-plugin />
  <panzoom-tracker-plugin />
  <navigation-control-plugin />
  <scale-control-plugin />
</template>
