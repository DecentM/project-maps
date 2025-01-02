<script lang="ts" setup>
import type { MetadataItem } from '@project-maps/proto/metadata/web'
import { getImageUrl } from 'src/lib/get-image-url'
import { computed } from 'vue'

const props = defineProps<{
  metadata: MetadataItem.AsObject[]
}>()

const logo = computed(() => {
  const item = props.metadata.findLast((item) => 'logo' in item)

  if (!item || !item.logo) return null

  return getImageUrl(item.logo, 'small')
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
