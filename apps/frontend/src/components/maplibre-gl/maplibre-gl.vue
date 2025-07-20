<script lang="ts" setup>
import { onBeforeUnmount, onMounted, shallowRef } from 'vue'
import type { StyleConfig } from '@project-maps/map-style'

import { useMap } from './use-map'

withDefaults(defineProps<Partial<StyleConfig>>(), {
  variant: 'light',
})

const emit = defineEmits<(event: 'click') => void>()

const container = shallowRef<HTMLDivElement>()

const { map } = useMap(container, {
  variant: 'light',
})

const handleClick = () => emit('click')

onMounted(() => {
  map.value?.on('click', handleClick)
})

onBeforeUnmount(() => {
  map.value?.off('click', handleClick)
})
</script>

<template>
  <div class="position-relative">
    <div ref="container" class="fit absolute-top-left"></div>
    <div v-if="$slots.default" class="fit absolute-top-left no-pointer-events overflow-hidden">
      <slot :map="map" />
    </div>
  </div>
</template>
