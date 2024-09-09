<script lang="ts" setup>
import type { Metadata } from '@project-maps/proto/metadata'
import { computed } from 'vue'

import HeroImage from '../image/hero-image.vue'
import AttributionNotice from '../attribution-notice/attribution-notice.vue'

const props = defineProps<{
  metadata: ReturnType<Metadata.AreaMetadataItem['toObject']>[]
}>()

const firstItem = computed(() => {
  const item = props.metadata.find((item) => 'image' in item)

  if (!item || !item.image) return null

  return item
})
</script>

<template>
  <transition name="fade" mode="out-in">
    <div class="relative-position" v-if="firstItem && firstItem.image?.url?.canonical">
      <hero-image
        :height="250"
        :src="firstItem.image.url.canonical"
        alt="Street Photo"
        class="q-pa-md"
      >
        <slot />
      </hero-image>

      <attribution-notice v-if="firstItem.attribution" :attribution="firstItem.attribution" />
    </div>

    <q-card-section v-else>
      <slot />
    </q-card-section>
  </transition>
</template>
