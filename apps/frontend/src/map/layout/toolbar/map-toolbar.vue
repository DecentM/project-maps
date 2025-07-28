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
  <q-toolbar class="q-px-none">
    <q-card>
      <q-btn flat color="primary" icon="mdi-arrow-left" :to="backTo" label="Back" />
    </q-card>
  </q-toolbar>
</template>
