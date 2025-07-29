<script lang="ts" setup>
import { computed } from 'vue'

import type { MetadataItem } from '@project-maps/proto/metadata/web'

import AttributionNotice from 'src/shared/components/attribution-notice/attribution-notice.vue'

const props = defineProps<{
  metadata: MetadataItem[]
}>()

const openingHours = computed(() => {
  const result = props.metadata.findLast(({ item }) => item.case === 'openingHours' && item.value)

  return {
    data: result?.item.value,
    attribution: result?.attribution,
  }
})
</script>

<template>
  <div class="relative-position" v-if="openingHours.data">
    <q-separator />

    <q-item>
      <q-item-section side top>
        <q-icon name="mdi-clock" color="primary" size="md" />
      </q-item-section>

      <q-item-section>
        <q-list>
          <q-item-label caption>
            Opening hours
          </q-item-label>

          <q-item dense class="q-px-none">
            <q-item-section>
              <q-item-label>
                {{ openingHours.data }}
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-item-section>

      <q-item-section side>
        <q-item-label v-if="openingHours.attribution">
          <attribution-notice :attribution="openingHours.attribution" />
        </q-item-label>
      </q-item-section>
    </q-item>
  </div>
</template>
