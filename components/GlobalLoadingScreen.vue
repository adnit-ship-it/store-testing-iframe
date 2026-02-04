<template>
  <Transition enter-active-class="transition-all duration-400 ease-in-out" enter-from-class="translate-y-full opacity-0"
    enter-to-class="translate-y-0 opacity-100" leave-active-class="transition-all duration-500 ease-in-out"
    leave-from-class="opacity-100" leave-to-class="opacity-0">
    <div v-if="isVisible" class="fixed inset-0 z-[9999] bg-backgroundColor flex flex-col items-center justify-center"
      :class="{ 'pointer-events-none': isFadingOut }">
      <img v-motion :initial="{ opacity: 0, y: 32 }" :visible-once="{
        opacity: 1,
        y: 0,
        transition: {
          duration: 400,
          type: 'ease-in',
          stiffness: 250,
          damping: 25,
          mass: 1,
        },
      }" :src="loadingLogoSrc" :alt="loadingLogoAlt" class="mb-6" :style="{ height: loadingLogoHeight, width: loadingLogoWidth }" />
      <p class="text-lg text-gray-600 font-medium">{{ loadingText }}</p>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { usePagesStore } from '~/stores/pagesStore'
import { getLogoSize } from '~/utils/branding'

interface Props {
  isVisible: boolean
  isFadingOut: boolean
}

defineProps<Props>()

const pagesStore = usePagesStore()

const loadingScreenConfig = computed(() => pagesStore.pages?.loadingScreen)
const loadingScreenLogo = computed(() => loadingScreenConfig.value?.logo)
const loadingLogoSrc = computed(() => loadingScreenLogo.value?.src || '/assets/images/brand/logo-alt.svg')
const loadingLogoAlt = computed(() => loadingScreenLogo.value?.alt || pagesStore.pages?.common?.accessibility?.brandLogo || 'Brand logo')
const loadingText = computed(() => loadingScreenConfig.value?.text || 'Loading...')

const isMobile = ref(false)
const updateIsMobile = () => {
  if (!process.client) return
  isMobile.value = window.innerWidth <= 768
}

const loadingLogoHeight = computed(() => getLogoSize('loadingScreen', 'height', isMobile.value))
const loadingLogoWidth = computed(() => getLogoSize('loadingScreen', 'width', isMobile.value))

onMounted(() => {
  updateIsMobile()
  window.addEventListener('resize', updateIsMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateIsMobile)
})
</script>

<style scoped>
/* Ensure the loading screen covers everything */
.fixed {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
</style>