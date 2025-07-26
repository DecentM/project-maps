<script lang="ts" setup>
import { computed } from 'vue'
import type { Defibrillator, MetadataItem } from '@project-maps/proto/metadata/web'
import { Access, Indoor } from '@project-maps/proto/lib/openstreetmap/web'

const props = defineProps<{
  metadata: MetadataItem[]
}>()

const defibrillator = computed<Defibrillator | undefined>(() => {
  return props.metadata.findLast(
    ({ item }) => item.case === 'defibrillator' && item.value.$typeName === 'Metadata.Defibrillator'
  )?.item.value as Defibrillator | undefined
})

const lineCount = computed(() => {
  return Math.max(Object.keys(defibrillator.value || {}).length - 2, 0)
})

const access = computed(() => {
  switch (defibrillator.value?.access) {
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
  switch (defibrillator.value?.indoor) {
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
  if (!defibrillator.value?.locked) return 'Unknown'

  if (defibrillator.value.locked.value) return 'Locked'

  if (defibrillator.value.locked.conditional) {
    return `Locked sometimes: ${defibrillator.value.locked.conditional}`
  }

  return 'Unlocked'
})
</script>

<template>
  <q-list v-if="defibrillator">
    <q-item>
      <q-item-section side top>
        <q-icon name="mdi-heart-flash" color="secondary" size="md" />
      </q-item-section>

      <q-item-section class="font-noto-sans-display">
        <q-item-label overline class="text-secondary text-bold">Defibrillator</q-item-label>
        <q-item-label v-if="defibrillator.description" class="text-black" caption>{{ defibrillator.description }}</q-item-label>
        <q-item-label v-if="defibrillator.location" class="text-black" caption>{{ defibrillator.location }}</q-item-label>
      </q-item-section>
    </q-item>

    <q-item>
      <q-item-section side top>
        <q-icon name="mdi-information" color="tertiary" size="md" />
      </q-item-section>

      <q-item-section class="font-noto-sans-display">
        <q-item-label :lines="lineCount">
          <template v-if="defibrillator.access">
            <span>Access: </span>
            <span class="text-bold">{{ access }}, {{ locked }}</span>
            <span v-if="defibrillator.code"> (code: {{ defibrillator.code }})</span>
            <br />
          </template>

          <template v-if="defibrillator.level">
            <span>Level: </span>
            <span class="text-bold">{{ defibrillator.level }}</span>
            <br />
          </template>

          <template v-if="defibrillator.indoor">
            <span>Location: </span>
            <span class="text-bold">{{ indoor }}</span>
            <br />
          </template>

          <template v-if="defibrillator.cabinet">
            <span>Cabinet: </span>
            <span class="text-bold">{{ defibrillator.cabinet }}</span>
            <br />
          </template>

          <template v-if="defibrillator.manufacturer || defibrillator.model">
            <span>Device: </span>
            <span class="text-bold">{{ defibrillator.manufacturer }} {{ defibrillator.model }}</span>
            <br />
          </template>

          <template v-if="defibrillator.phone">
            <span>Phone: </span>
            <span class="text-bold">{{ defibrillator.phone }}</span>
            <br />
          </template>
        </q-item-label>
        <q-item-label caption>Address</q-item-label>
      </q-item-section>
    </q-item>
  </q-list>
</template>
