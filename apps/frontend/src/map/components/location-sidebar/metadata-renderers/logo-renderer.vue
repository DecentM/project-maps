<script lang="ts" setup>
import { computed } from 'vue'

import type { MetadataItem } from '@project-maps/proto/metadata/web'

import { getImageUrl } from 'src/shared/lib/get-image-url'

const props = defineProps<{
  metadata: MetadataItem[]
}>()

const logo = computed(() => {
  const result = props.metadata.findLast(({ item }) => item.case === 'logo' && item.value)

  if (!result || !result.item.value || result.item.case !== 'logo') return null

  return getImageUrl(result.item.value, 'small')
})
</script>

<style lang="scss" scoped>
.logo {
  max-width: 48px;
  max-height: 48px;
}
</style>

<template>
  <q-img
    v-if="logo"
    no-spinner
    :src="logo"
    fit="contain"
    position="center center"
    class="logo q-ma-xs"
  />
</template>
