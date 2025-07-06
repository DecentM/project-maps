<script lang="ts" setup>
import type { MetadataItem } from '@project-maps/proto/metadata/web'
import { computed } from 'vue'

const props = defineProps<{
  metadata: MetadataItem[]
}>()

const descriptionItem = computed(() => {
  const result =
    props.metadata.findLast(({ item }) => item.case === 'description' && item.value) ?? null

  if (!result || !result.item.value || result.item.value.$typeName !== 'Metadata.Description')
    return null

  return result.item.value
})
</script>

<template>
  <span class="font-noto-sans-display">
    {{ descriptionItem?.text?.slice(0, 1).toLocaleUpperCase() }}{{ descriptionItem?.text?.slice(1) }}
  </span>
</template>
