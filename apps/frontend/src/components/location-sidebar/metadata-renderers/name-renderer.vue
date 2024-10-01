<script lang="ts" setup>
import type { Metadata } from '@project-maps/proto/metadata'
import { computed } from 'vue'

const props = defineProps<{
  metadata: ReturnType<Metadata.MetadataItem['toObject']>[]
}>()

const textMetadata = computed(() => {
  const item = props.metadata.findLast((item) => 'metadata' in item && item.metadata?.name)

  if (!item || !item.metadata) return null

  return item.metadata
})
</script>

<template>
  <span v-if="textMetadata?.name" class="font-noto-sans-display">{{ textMetadata.name }}</span>
</template>
