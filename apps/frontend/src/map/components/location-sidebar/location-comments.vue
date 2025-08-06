<script lang="ts" setup>
import { computed } from 'vue'

import type { Comment, MetadataItem } from '@project-maps/proto/metadata/web'

const props = defineProps<{
  metadata: MetadataItem[]
}>()

const commentItems = computed<Comment[]>(() => {
  return props.metadata
    .filter(({ item }) => item.case === 'comment' && item.value)
    .map(({ item }) => item.value as Comment)
})
</script>

<template>
  <div v-if="commentItems.length > 0" class="relative-position">
    <q-separator />

    <q-item-label header>Comments</q-item-label>

    <q-expansion-item
      v-for="(item, index) in commentItems"
      :key="index"
      group="location-comments"
      expand-icon="mdi-menu-down"
      :default-opened="index === 0"
    >
      <template #header>
        <q-item-section v-if="item?.author?.avatarUrl" avatar>
          <q-avatar>
            <img :src="item.author.avatarUrl">
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label>{{ item?.author?.name }}</q-item-label>
          <q-item-label caption lines="1">{{ item?.createdAt?.value.value }}</q-item-label>
        </q-item-section>
      </template>

      <q-separator />

      <q-card-section>
        {{ item?.text }}
      </q-card-section>
    </q-expansion-item>
  </div>
</template>
