<script lang="ts" setup>
import { splitUrl } from 'src/lib/urls'
import { computed } from 'vue'

const props = defineProps<{
  url: string
}>()

const parts = computed(() => {
  return splitUrl(props.url)
})
</script>

<template>
  <template v-if="parts.length === 2">
    <span class="text-grey-7">{{ parts[0] }}</span><span class="text-subtitle2">{{ parts[1] }}</span>
  </template>

  <template v-else>
    <span>{{ props.url }}</span>
  </template>
</template>
