<script lang="ts" setup>
import type { MetadataItem } from '@project-maps/proto/metadata/web'
import { computed } from 'vue'

const props = defineProps<{
  metadata: MetadataItem.AsObject[]
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
