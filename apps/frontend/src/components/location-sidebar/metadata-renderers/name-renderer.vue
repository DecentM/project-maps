<script lang="ts" setup>
import type { MetadataItem } from '@project-maps/proto/metadata/web'
import { computed } from 'vue'

const props = defineProps<{
  metadata: MetadataItem[]
}>()

const textMetadata = computed(() => {
  const result = props.metadata.findLast(({ item }) => item.case === 'metadata' && item.value?.name)

  if (!result) return null

  return { name: 'FIXME' }
})
</script>

<template>
  <span v-if="textMetadata?.name" class="font-noto-sans-display">{{ textMetadata.name }}</span>
</template>
