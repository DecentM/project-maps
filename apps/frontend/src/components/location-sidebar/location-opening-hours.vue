<script lang="ts" setup>
import type { MetadataItem } from '@project-maps/proto/metadata/web'
import { computed, ref } from 'vue'
import { DateTime } from 'luxon'

const props = defineProps<{
  metadata: MetadataItem[]
  coordinates: GeoJSON.Position
}>()

const openingHours = computed(() => {
  const result = props.metadata.findLast(({ item }) => item.case === 'openingHours' && item.value)

  if (!result || !result.item.value || result.item.value.$typeName !== 'Metadata.OpeningHours')
    return null

  return result.item.value
})

const ranges = computed(() => {
  return openingHours.value?.ranges?.filter(
    (range) =>
      range.start?.value.case === 'millis' &&
      range.start.value.value &&
      range.end?.value.case === 'millis' &&
      range.end.value.value
  )
})

const tz = ref('Etc/UTC')
</script>

<template>
  <div class="relative-position" v-if="openingHours && openingHours?.ranges?.length">
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
                {{ DateTime.fromMillis(Number(interval.start!.value.value)).setZone(tz).toLocaleString(DateTime.TIME_24_SIMPLE) }}
                -
                {{ DateTime.fromMillis(Number(interval.end!.value.value)).setZone(tz).toLocaleString(DateTime.TIME_24_SIMPLE) }}
              </q-item-label>
            </q-item-section>

            <q-item-section side>
              <q-item-label>
                {{ DateTime.fromMillis(Number(interval.start!.value.value)).setZone(tz).toFormat('EEEE') }}
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-item-section>
    </q-item>
  </div>
</template>
