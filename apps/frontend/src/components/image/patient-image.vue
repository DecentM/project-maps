<script lang="ts" setup>
import { preloadImage } from 'src/lib/preload-image'
import { computed, ref, watch } from 'vue'

const props = defineProps<{
  src: string
  alt: string
  height: string
}>()

const shownImage = ref<string | null>(null)

const backgroundUrl = computed(() => {
  return `linear-gradient(rgba(255, 255, 255, 0.75) 0, rgba(255, 255, 255, 0.33) 80px, rgba(255, 255, 255, 0) 160px), url(${shownImage.value})`
})

const handleSrcChange = async () => {
  if (!props.src) {
    return
  }

  try {
    await preloadImage(props.src)
    shownImage.value = props.src
  } catch {
    // This will just mean the aniamtion isn't smooth
  }
}

watch(() => props.src, handleSrcChange, { immediate: true })
</script>

<style lang="scss" scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

.patient-image {
  width: 100%;
  height: v-bind(height);
  background-size: cover;
  background-position: center;
  background-image: v-bind(backgroundUrl);
}
</style>

<template>
  <div class="patient-image">
    <slot />
  </div>
</template>
