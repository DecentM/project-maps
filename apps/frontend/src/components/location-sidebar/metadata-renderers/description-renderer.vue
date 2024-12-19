<script lang="ts" setup>
import type { MetadataItem } from '@project-maps/proto/metadata'
import { computed } from 'vue'

const props = defineProps<{
  metadata: ReturnType<MetadataItem['toObject']>[]
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
