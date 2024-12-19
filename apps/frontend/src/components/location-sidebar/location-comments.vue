<script lang="ts" setup>
import type { MetadataItem } from '@project-maps/proto/metadata'
import { computed } from 'vue'

const props = defineProps<{
  metadata: ReturnType<MetadataItem['toObject']>[]
}>()

const commentItems = computed(() => {
  return props.metadata.filter((item) => 'comment' in item)
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
        <q-item-section avatar v-if="item.comment?.author?.avatarUrl">
          <q-avatar>
            <img :src="item.comment.author.avatarUrl">
          </q-avatar>
        </q-item-section>

        <q-item-section class="font-noto-sans-display">
          <q-item-label>{{ item.comment?.author?.name }}</q-item-label>
          <q-item-label caption lines="1">{{ item.comment?.createdAt?.seconds }}</q-item-label>
        </q-item-section>
      </template>

      <q-separator />

      <q-card-section class="font-noto-sans-display">
        {{ item.comment?.text }}
      </q-card-section>
    </q-expansion-item>
  </div>
</template>
