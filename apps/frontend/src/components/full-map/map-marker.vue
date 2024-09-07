<script lang="ts" setup>
withDefaults(
  defineProps<{
    location: { lng: number | string; lat: number | string }
    offset?: [number, number]
  }>(),
  {
    offset: () => [0, 0],
  }
)
</script>

<template>
  <mgl-marker :coordinates="location" :offset="[-12, -24]" />
</template>
