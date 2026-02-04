<template>
  <!-- Global Loading Screen -->
  <GlobalLoadingScreen :is-visible="showLoadingScreen" :is-fading-out="isFadingOut" />

  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { usePagesStore } from '~/stores/pagesStore'

const pagesStore = usePagesStore();

// Get page title from common
const common = computed(() => pagesStore.pages?.common);
const pageTitle = computed(() => common.value?.pageTitle || 'Serenova');
const pageDescription = computed(() => common.value?.pageDescription || 'Serenova is a company that provides a service to help people lose weight.');

// Set page title
useHead({
  title: pageTitle,
  meta: [
         { name: 'description', content: pageDescription }
       ]
});

// Loading screen state
const showLoadingScreen = ref(true)
const isFadingOut = ref(false)
const minLoadingTime = 500 // 0.5 seconds in milliseconds

onMounted(async () => {
  // Pages are now loaded in plugin (runs before render)
  // Only load if not already loaded (fallback)
  if (!pagesStore.pages) {
    await pagesStore.loadAll()
  }
  // Disable scrolling when loading screen is visible
  document.body.style.overflow = 'hidden'

  // Start timer for minimum loading time
  const startTime = Date.now()

  try {
    // Calculate elapsed time
    const elapsedTime = Date.now() - startTime
    const remainingTime = Math.max(0, minLoadingTime - elapsedTime)

    // Wait for minimum loading time if needed
    if (remainingTime > 0) {
      await new Promise(resolve => setTimeout(resolve, remainingTime))
    }

    // Start fade out
    isFadingOut.value = true

    // Wait for fade out animation to complete
    await new Promise(resolve => setTimeout(resolve, 500)) // Match the leave duration

    // Hide loading screen and re-enable scrolling
    showLoadingScreen.value = false
    document.body.style.overflow = ''

  } catch (error) {
    console.error('Error during initialization:', error)

    // Even if there's an error, still show loading screen for minimum time
    const elapsedTime = Date.now() - startTime
    const remainingTime = Math.max(0, minLoadingTime - elapsedTime)

    if (remainingTime > 0) {
      await new Promise(resolve => setTimeout(resolve, remainingTime))
    }

    // Start fade out
    isFadingOut.value = true

    // Wait for fade out animation to complete
    await new Promise(resolve => setTimeout(resolve, 500))

    // Hide loading screen and re-enable scrolling
    showLoadingScreen.value = false
    document.body.style.overflow = ''
  }
})
</script>

<style scoped>
/* Custom styles if needed */
</style>
