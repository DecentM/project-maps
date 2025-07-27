<script lang="ts" setup>
import type { MetadataItem, TextMetadata } from '@project-maps/proto/metadata/web'
import { computed } from 'vue'

const props = defineProps<{
  metadata: MetadataItem[]
}>()

const textMetadata = computed(() => {
  const result = props.metadata.findLast(({ item }) => item.case === 'metadata' && item.value?.name)

  if (!result) return null

  return result.item.value as TextMetadata
})
</script>

<template>
  <span v-if="textMetadata?.name">{{ textMetadata.name }}</span>
</template>
