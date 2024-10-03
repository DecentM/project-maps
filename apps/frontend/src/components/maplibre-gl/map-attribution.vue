<script setup lang="ts">
import { ref } from 'vue'

const morphState = ref('btn')
</script>

<style lang="scss" scoped>
.map-attribution {
  bottom: 0;
  right: 0;
  z-index: 1;
}
</style>

<template>
  <q-btn
    flat
    size="sm"
    round
    icon="mdi-information"
    class="absolute map-attribution all-pointer-events q-ma-md bg-white"
    v-morph:btn:attribution:300.resize="morphState"
    @mouseover="morphState = 'card'"
  />

  <q-card
    class="absolute map-attribution all-pointer-events font-noto-sans-display q-ma-md"
    v-morph:card:attribution:300.tween="morphState"
    @mouseleave="morphState = 'btn'"
  >
    <q-card-section class="text-right q-pa-sm">
      © MapLibre, © OpenStreetMap contributors
    </q-card-section>
  </q-card>
</template>
