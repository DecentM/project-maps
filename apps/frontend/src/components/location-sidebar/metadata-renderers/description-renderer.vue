<script lang="ts" setup>
import type { Metadata } from '@project-maps/proto/metadata'
import { computed } from 'vue'

const props = defineProps<{
  metadata: ReturnType<Metadata.MetadataItem['toObject']>[]
}>()

const descriptionItem = computed(() => {
  return props.metadata.findLast((item) => 'description' in item)
})
</script>

<template>
  <span class="font-noto-sans-display">
    {{ descriptionItem?.description?.text?.slice(0, 1).toLocaleUpperCase() }}{{ descriptionItem?.description?.text?.slice(1) }}
  </span>
</template>
