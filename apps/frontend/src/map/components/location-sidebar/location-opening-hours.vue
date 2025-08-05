<script lang="ts" setup>
import { computed } from 'vue'

import type { MetadataItem, OpeningHours } from '@project-maps/proto/metadata/web'

import AttributionNotice from 'src/shared/components/attribution-notice/attribution-notice.vue'
import { DateTime } from 'luxon'

const props = defineProps<{
  metadata: MetadataItem[]
}>()

const openingHours = computed(() => {
  const result = props.metadata.findLast(({ item }) => item.case === 'openingHours' && item.value)
  const oh = result?.item.value as OpeningHours | undefined

  const nextChange =
    oh?.nextChange?.value?.case === 'millis' ? oh.nextChange.value.value : undefined

  return {
    fallback: oh?.fallback,
    tz: oh?.tz,
    isCurrentlyOpen: oh?.isCurrentlyOpen,
    isWeekStable: oh?.isWeekStable,
    nextChange: nextChange ? DateTime.fromMillis(Number(nextChange)).setZone(oh?.tz) : undefined,
    intervals: oh?.intervals.map((interval) => {
      const fromMillis =
        interval.from?.value?.case === 'millis' ? interval.from.value.value : undefined
      const toMillis = interval.to?.value?.case === 'millis' ? interval.to.value.value : undefined

      return {
        comment: interval.comment,
        uncertain: interval.uncertain,
        from: fromMillis ? DateTime.fromMillis(Number(fromMillis)).setZone(oh.tz) : undefined,
        to: toMillis ? DateTime.fromMillis(Number(toMillis)).setZone(oh.tz) : undefined,
      }
    }),
    attribution: result?.attribution,
    is247: oh?.is247,
  }
})
</script>

<template>
  <div v-if="openingHours.intervals || openingHours.fallback" class="relative-position">
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

          <q-item-label
            v-if="!openingHours.nextChange"
            caption
            :class="[{'text-positive': openingHours.isCurrentlyOpen, 'text-negative': !openingHours.isCurrentlyOpen}]"
          >
            <span v-if="openingHours.is247">
              Open 24/7
            </span>

            <span v-else>
              {{ openingHours.isCurrentlyOpen ? 'Open now' : 'Currently closed' }}
            </span>
          </q-item-label>

          <q-item-label
            v-else
            caption
            :class="[{'text-positive': openingHours.isCurrentlyOpen, 'text-negative': !openingHours.isCurrentlyOpen}]"
          >
            {{ openingHours.isCurrentlyOpen ? 'Open. Closes' : 'Closed. Opens' }}
            {{ openingHours.nextChange.toRelative({ unit: ['hours', 'minutes'] }) }}
          </q-item-label>

          <q-item v-if="!openingHours.intervals" dense class="q-px-none">
            <q-item-section>
              <q-item-label>
                {{ openingHours.fallback }}
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

    <q-item v-if="!openingHours.is247 && openingHours.intervals && openingHours.intervals.length > 0">
      <q-item-section side top>
        <q-icon name="mdi-information" color="grey" size="md" />
      </q-item-section>

      <q-item-section>
        <q-list>
          <q-item v-for="(interval, index) of openingHours.intervals" :key="index" dense class="q-px-none">
            <q-item-section>
              <q-item-label caption>
                {{ interval.from?.toFormat('EEEE') }}
              </q-item-label>

              <q-item-label>
                {{ interval.from?.toFormat('HH:mm') }} -
                {{ interval.to?.toFormat('HH:mm') }}
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-item-section>
    </q-item>
  </div>
</template>
