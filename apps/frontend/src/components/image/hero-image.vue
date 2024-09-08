<script lang="ts" setup>
import { computed } from 'vue'

const props = defineProps<{
  src: string
  alt: string
  height: number
}>()

const backgroundImage = computed(() => {
  return `linear-gradient(
    rgba(255, 255, 255, 0.75) 31px,
    rgba(255, 255, 255, 0) ${Math.max(props.height - 130, 72)}px
  )`
})

const height = computed(() => {
  return `${props.height}px`
})
</script>

<style lang="scss" scoped>
.hero-image {
  width: 100%;
  height: v-bind(height);
  position: relative;

  > .content {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    &.slot {
      background-image: v-bind(backgroundImage);
      padding: 16px;
    }
  }
}
</style>

<template>
  <div class="hero-image">
    <q-img
      no-spinner
      class="content"
      :src="props.src"
      :alt="props.alt" />

    <div class="content slot">
      <slot />
    </div>

  </div>
</template>
