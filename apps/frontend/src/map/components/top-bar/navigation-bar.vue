<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const props = withDefaults(
  defineProps<{
    toName?: string
  }>(),
  {
    toName: 'IndexPage',
  }
)

const route = useRoute()

const backTo = computed(() => {
  return {
    name: props.toName,
    query: route.query,
  }
})
</script>

<template>
  <div class="q-px-sm q-mt-sm">
    <q-toolbar class="bg-primary text-white rounded-borders full-width">
      <q-btn flat round dense icon="mdi-arrow-left" :to="backTo" />
      <q-toolbar-title class="text-subtitle1">
        Back
      </q-toolbar-title>
    </q-toolbar>
  </div>
</template>
