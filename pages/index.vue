<template>
  <div class="pt-[83px] lg:pt-[68px] bg-backgroundColor">

    
    <DynamicSection 
      v-for="section in pageSections"
      :key="section.name"
      :section="section"
    />
  </div>
</template>

<script setup lang="ts">
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
  const sections = pagesStore.getPageSections(pageKey.value)
  return sections
})
</script>

<style scoped>
/* Custom styles if needed */
</style>
