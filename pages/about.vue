<template>
  <div class="bg-backgroundColor py-24 md:py-32">
    <DynamicSection 
      v-for="section in pageSections"
      :key="section.name"
      :section="section"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { usePagesStore } from '~/stores/pagesStore'
import { useRoute } from 'vue-router'

const pagesStore = usePagesStore()
const route = useRoute()

// Get current page key from route
const pageKey = computed(() => {
  if (route.path === '/') return 'home'
  return route.path.slice(1) // Remove leading '/'
})

// Get ordered sections for this page
const pageSections = computed(() => {
  return pagesStore.getPageSections(pageKey.value)
})
</script>

<style scoped>
/* About page styles */
</style>
