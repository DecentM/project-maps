<script lang="ts" setup>
import { computed } from 'vue'

import { Access, Indoor } from '@project-maps/proto/lib/openstreetmap/web'
import type { Defibrillator, MetadataItem } from '@project-maps/proto/metadata/web'

import AttributionNotice from 'src/shared/components/attribution-notice/attribution-notice.vue'

const props = defineProps<{
  metadata: MetadataItem[]
}>()

const defibrillator = computed(() => {
  const data = props.metadata.findLast(
    ({ item }) => item.case === 'defibrillator' && item.value.$typeName === 'Metadata.Defibrillator'
  )

  return {
    data: data?.item.value as Defibrillator | undefined,
    attribution: data?.attribution,
  }
})

const lineCount = computed(() => {
  return Math.max(Object.keys(defibrillator.value || {}).length - 2, 0)
})

const access = computed(() => {
  switch (defibrillator.value?.data?.access) {
    case Access.PUBLIC:
      return 'Public'
    case Access.PRIVATE:
      return 'Private'
    case Access.PERMISSIVE:
      return 'Semi-public'
    default:
      return 'Unknown'
  }
})

const indoor = computed(() => {
  switch (defibrillator.value?.data?.indoor) {
    case Indoor.YES:
      return 'Indoors'
    case Indoor.NO:
      return 'Outdoors'
    case Indoor.AREA:
      return 'In an area without walls'
    case Indoor.ROOM:
      return 'In a regular room with walls'
    case Indoor.COLUMN:
      return 'On a column that is part of the structure of the building'
    case Indoor.CORRIDOR:
      return 'In a corridor with walls'
    case Indoor.WALL:
      return 'On a wall'
    case Indoor.DOOR:
      return 'On or near an interior door'
    default:
      return 'Unknown'
  }
})

const locked = computed(() => {
  if (!defibrillator.value?.data?.locked) return 'Unknown'

  if (defibrillator.value.data.locked.value) return 'Locked'

  if (defibrillator.value.data.locked.conditional) {
    return `Locked sometimes: ${defibrillator.value.data?.locked.conditional}`
  }

  return 'Unlocked'
})
</script>

<template>
  <q-list v-if="defibrillator.data">
    <q-separator />

    <q-item>
      <q-item-section side top>
        <q-icon name="mdi-heart-flash" color="secondary" size="md" />
      </q-item-section>

      <q-item-section>
        <q-item-label overline class="text-secondary text-bold">Defibrillator</q-item-label>
        <q-item-label v-if="defibrillator.data?.description" class="text-black" caption>{{ defibrillator.data?.description }}</q-item-label>
        <q-item-label v-if="defibrillator.data?.location" class="text-black" caption>{{ defibrillator.data?.location }}</q-item-label>
      </q-item-section>
    </q-item>

    <q-item
      v-if="defibrillator.data?.access
        || defibrillator.data?.level
        || defibrillator.data?.indoor
        || defibrillator.data?.cabinet
        || defibrillator.data?.manufacturer
        || defibrillator.data?.model
        || defibrillator.data?.phone"
      >
      <q-item-section side top>
        <q-icon name="mdi-information" color="tertiary" size="md" />
      </q-item-section>

      <q-item-section>
        <q-item-label :lines="lineCount">
          <template v-if="defibrillator.data?.access">
            <span>Access: </span>
            <span class="text-bold">{{ access }}, {{ locked }}</span>
            <span v-if="defibrillator.data.code"> (code: {{ defibrillator.data.code }})</span>
            <br />
          </template>

          <template v-if="defibrillator.data?.level">
            <span>Level: </span>
            <span class="text-bold">{{ defibrillator.data.level }}</span>
            <br />
          </template>

          <template v-if="defibrillator.data?.indoor">
            <span>Location: </span>
            <span class="text-bold">{{ indoor }}</span>
            <br />
          </template>

          <template v-if="defibrillator.data?.cabinet">
            <span>Cabinet: </span>
            <span class="text-bold">{{ defibrillator.data.cabinet }}</span>
            <br />
          </template>

          <template v-if="defibrillator.data?.manufacturer || defibrillator.data?.model">
            <span>Device: </span>
            <span class="text-bold">{{ defibrillator.data.manufacturer }} {{ defibrillator.data.model }}</span>
            <br />
          </template>

          <template v-if="defibrillator.data?.phone">
            <span>Phone: </span>
            <span class="text-bold">{{ defibrillator.data.phone }}</span>
            <br />
          </template>
        </q-item-label>
      </q-item-section>

      <q-item-section side>
        <q-item-label v-if="defibrillator.attribution">
          <attribution-notice :attribution="defibrillator.attribution" />
        </q-item-label>
      </q-item-section>
    </q-item>
  </q-list>
</template>
