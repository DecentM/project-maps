<script lang="ts" setup>
import type { MetadataItem } from '@project-maps/proto/metadata/web'
import { computed } from 'vue'

const props = defineProps<{
  metadata: MetadataItem[]
}>()

const openingHours = computed(() => {
  const result = props.metadata.findLast(({ item }) => item.case === 'openingHours' && item.value)

  return result?.item.value
})
</script>

<template>
  <div class="relative-position" v-if="openingHours">
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
                {{ openingHours }}
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-item-section>
    </q-item>
  </div>
</template>
