<script lang="ts" setup>
import MaplibreGl from 'src/shared/components/maplibre-gl/maplibre-gl.vue'
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
        <router-view name="Toolbar" v-slot="{ Component }">
          <transition name="fade-up" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </q-header>

      <router-view name="Sidebar" v-slot="{ Component }">
        <transition name="fade-up" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>

      <router-view v-slot="{ Component }">
        <q-page-container :class="{'vh-100 vw-100': !!Component}" class="q-pb-sm q-pr-sm">
          <q-page>
            <transition name="fade-up" mode="out-in">
              <component :is="Component" />
            </transition>
          </q-page>
        </q-page-container>
      </router-view>

      <q-footer bordered>
        <router-view name="Footer" v-slot="{ Component }">
          <transition name="fade-up" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </q-footer>
    </q-layout>
  </maplibre-gl>
</template>
