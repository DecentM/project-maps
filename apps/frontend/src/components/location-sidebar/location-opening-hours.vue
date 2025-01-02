<script lang="ts" setup>
import type { MetadataItem } from '@project-maps/proto/metadata/web'
import { computed, ref } from 'vue'
import { DateTime } from 'luxon'

const props = defineProps<{
  metadata: MetadataItem.AsObject[]
  coordinates: GeoJSON.Position
}>()

const openingHours = computed(() => {
  return props.metadata.findLast((item) => 'openinghours' in item)
})

const ranges = computed(() => {
  return openingHours.value?.openinghours?.rangesList?.filter(
    (range) => range.start?.millis && range.end?.millis
  )
})

const tz = ref('Etc/UTC')
</script>

<template>
  <div class="relative-position" v-if="openingHours && openingHours.openinghours?.rangesList">
    <q-item>
      <q-item-section side top>
        <q-icon name="mdi-clock" color="primary" size="md" />
      </q-item-section>

      <q-item-section>
        <q-list>
          <q-item-label caption>
            Opening hours
          </q-item-label>

          <q-item v-for="(interval, index) of ranges" :key="index" dense class="q-px-none">
            <q-item-section>
              <q-item-label>
                {{ DateTime.fromMillis(interval.start!.millis!).setZone(tz).toLocaleString(DateTime.TIME_24_SIMPLE) }}
                -
                {{ DateTime.fromMillis(interval.end!.millis!).setZone(tz).toLocaleString(DateTime.TIME_24_SIMPLE) }}
              </q-item-label>
            </q-item-section>

            <q-item-section side>
              <q-item-label>
                {{ DateTime.fromMillis(interval.start!.millis!).setZone(tz).toFormat('EEEE') }}
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-item-section>
    </q-item>
  </div>
</template>
