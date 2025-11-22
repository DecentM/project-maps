<script lang="ts" setup>
import { computed } from 'vue'
import { DateTime } from 'luxon'

import type { NewsItem, MetadataItem } from '@project-maps/proto/metadata/web'

import AttributionNotice from 'src/shared/components/attribution-notice/attribution-notice.vue'

const props = defineProps<{
  metadata: MetadataItem[]
}>()

const newsItems = computed(() => {
  return props.metadata
    .filter(({ item }) => item.case === 'newsItem')
    .map(({ item, attribution }) => ({ ...(item.value as NewsItem), attribution }))
    .map((newsItem) => ({
      ...newsItem,
      attribution: newsItem.attribution,
      publishedAt: newsItem.publishedAt
        ? DateTime.fromMillis(Number(newsItem.publishedAt.value.value))
        : undefined,
    }))
})
</script>

<template>
  <div v-if="newsItems.length > 0" class="relative-position">
    <q-separator />

    <q-item-label header>News</q-item-label>

    <q-scroll-area class="scroller">
      <div class="row no-wrap">
        <q-card v-for="(item, index) in newsItems" :key="index" class="item">
          <q-img
            v-if="item.thumbnail"
            :src="item.thumbnail.src"
            :srcset="item.thumbnail.srcset"
            :alt="item.title"
            class="thumbnail"
          />

          <q-scroll-area class="readable">
            <q-card-section>
              <div class="text-subtitle2 title">{{item.title}}</div>
              <div v-if="item.publishedAt" class="text-subtitle2 text-grey">
                {{ item.publishedAt.toRelative() }}
              </div>
            </q-card-section>

            <q-card-section class="q-pt-none">
              {{ item.blurb }}
            </q-card-section>
          </q-scroll-area>

          <q-card-actions>
            <q-btn
              flat
              icon="mdi-open-in-new"
              label="Read"
              target="_blank"
              rel="noopener noreferrer"
              :href="item.url" />

            <attribution-notice
              v-if="item.attribution"
              :attribution="item.attribution"
              class="q-ml-auto" />
          </q-card-actions>
        </q-card>
      </div>
    </q-scroll-area>
  </div>
</template>

<style lang="scss" scoped>
.item {
  width: 200px;
  margin-right: 12px;
  height: 350px;
  text-overflow: ellipsis;
  overflow: hidden;

  &:first-of-type {
    margin-left: 12px;
  }
}

.scroller {
  padding-bottom: 16px;
  height: 370px;
}

.thumbnail {
  height: 100px;
}

.readable {
  height: 200px;
}

.title {
  // white-space: pre;
  overflow: hidden;
  // text-overflow: ellipsis;
}
</style>
