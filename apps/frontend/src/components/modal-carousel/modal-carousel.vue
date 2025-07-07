<script lang="ts" setup>
import type { ImageUrl } from '@project-maps/proto/metadata/web'
import { getImageUrl } from 'src/lib/get-image-url'
import { ref } from 'vue'

const slide = ref(0)

defineProps<{
  modelValue: boolean
  urls: ImageUrl[]
}>()

defineEmits<(event: 'update:modelValue', value: boolean) => void>()
</script>

<style lang="scss" scoped>
.slide {
  background-size: contain;
  background-repeat: no-repeat;
  background-color: $dark;
}
</style>

<template>
  <q-dialog
    :model-value="modelValue"
    @update:model-value="(value) => $emit('update:modelValue', value)"
    full-width
    full-height
  >
    <q-carousel
      v-if="urls.length > 1"
      v-model="slide"
      swipeable
      animated
      thumbnails
      infinite
      arrows
      transition-prev="slide-right"
      transition-next="slide-left"
    >
      <q-carousel-slide
        v-for="(url, index) in urls"
        :name="index"
        :img-src="getImageUrl(url, 'canonical') ?? undefined"
        class="slide" />
    </q-carousel>

    <q-img
      v-else
      class="slide"
      :src="getImageUrl(urls[0], 'canonical') ?? undefined"
      fit="contain" />
  </q-dialog>
</template>
