<script lang="ts" setup>
import type { Metadata } from '@project-maps/proto/metadata'
import { computed } from 'vue'

const props = defineProps<{
  metadata: ReturnType<Metadata.AreaMetadataItem['toObject']>[]
}>()

const textMetadata = computed(() => {
  const item = props.metadata.findLast((item) => 'metadata' in item && item.metadata?.name)

  if (!item || !item.metadata) return null

  return item.metadata
})
</script>

<template>
  <span>{{ textMetadata?.name }}</span>
</template>
