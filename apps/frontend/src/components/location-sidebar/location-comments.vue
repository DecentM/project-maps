<script lang="ts" setup>
import type { Metadata } from '@project-maps/proto/metadata'
import { computed } from 'vue'

import AttributionNotice from '../attribution-notice/attribution-notice.vue'

const props = defineProps<{
  metadata: ReturnType<Metadata.AreaMetadataItem['toObject']>[]
}>()

const commentItems = computed(() => {
  return props.metadata.filter((item) => 'comment' in item)
})
</script>

<template>
  <q-separator v-if="commentItems.length > 0" />

  <div v-if="commentItems.length > 0" class="relative-position">
    <q-item-label header>Comments</q-item-label>

    <q-expansion-item
      v-for="(item, index) in commentItems"
      :key="index"
      group="location-comments"
      expand-icon="mdi-menu-down"
      :default-opened="index === 0"
    >
      <template #header>
        <q-item-section avatar v-if="item.comment?.author?.avatarUrl">
          <q-avatar>
            <img :src="item.comment.author.avatarUrl">
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label>{{ item.comment?.author?.name }}</q-item-label>
          <q-item-label caption lines="1">{{ item.comment?.createdAt?.seconds }}</q-item-label>
        </q-item-section>
      </template>

      <q-separator />

      <q-card-section>
        {{ item.comment?.text }}
      </q-card-section>

      <template v-if="item.attribution">
        <attribution-notice :attribution="item.attribution" />
        <q-separator />
      </template>
    </q-expansion-item>
  </div>
</template>
