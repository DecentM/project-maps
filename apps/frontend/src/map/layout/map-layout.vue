<script lang="ts" setup>
import { usePreferredReducedMotion } from '@vueuse/core'
import MaplibreGl from 'src/shared/components/maplibre-gl/maplibre-gl.vue'

const reducedMotion = usePreferredReducedMotion()
</script>

<style lang="scss">
.q-drawer {
  background-color: transparent;
}
</style>

<template>
  <maplibre-gl
    class="vh-100"
    :min-pitch="0"
    :max-pitch="80"
  >
    <q-layout view="lHh lpR fFf">
      <q-header class="transparent">
        <router-view v-if="reducedMotion === 'no-preference'" v-slot="{ Component }" name="Toolbar">
          <transition name="fade-up" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>

        <router-view v-else name="Toolbar" />
      </q-header>

      <router-view v-if="reducedMotion === 'no-preference'" v-slot="{ Component }" name="Sidebar">
        <transition name="fade-up" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>

      <router-view v-else name="Sidebar" />

      <router-view v-slot="{ Component }">
        <q-page-container :class="{'vh-100 vw-100': !!Component}" class="q-pb-sm q-pr-sm">
          <q-page>
            <transition v-if="reducedMotion === 'no-preference'" name="fade-up" mode="out-in">
              <component :is="Component" />
            </transition>

            <component :is="Component" v-else />
          </q-page>
        </q-page-container>
      </router-view>

      <q-footer bordered>
        <router-view v-if="reducedMotion === 'no-preference'" v-slot="{ Component }" name="Footer">
          <transition name="fade-up" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>

        <router-view v-else name="Footer" />
      </q-footer>
    </q-layout>
  </maplibre-gl>
</template>
