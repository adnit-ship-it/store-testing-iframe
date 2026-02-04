import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { PagesData, PageConfig, PageSectionReference } from '~/types/pages'

// Section data structure from sections.json
export interface SectionData {
  name: string
  components: any[]
}

export const usePagesStore = defineStore('pages', () => {
  const pages = ref<PagesData | null>(null)
  const sections = ref<SectionData[] | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Load pages.json
  const loadPages = async (skipLoadingState = false) => {
    if (pages.value) return // Already loaded
    
    if (!skipLoadingState) {
      isLoading.value = true
      error.value = null
    }
    
    try {
      const data = await import('~/data/pages.json')
      pages.value = data.default
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load pages'
      if (!skipLoadingState) {
        error.value = errorMessage
      }
      console.error('Failed to load pages.json:', err)
      throw err
    } finally {
      if (!skipLoadingState) {
        isLoading.value = false
      }
    }
  }

  // Load sections.json
  const loadSections = async (skipLoadingState = false) => {
    if (sections.value) return // Already loaded
    
    if (!skipLoadingState) {
      isLoading.value = true
      error.value = null
    }
    
    try {
      const data = await import('~/data/sections.json')
      sections.value = data.default
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load sections'
      if (!skipLoadingState) {
        error.value = errorMessage
      }
      console.error('Failed to load sections.json:', err)
      throw err
    } finally {
      if (!skipLoadingState) {
        isLoading.value = false
      }
    }
  }

  // Load both pages and sections
  const loadAll = async () => {
    isLoading.value = true
    error.value = null
    
    try {
      await Promise.all([
        loadPages(true), // Skip individual loading state
        loadSections(true) // Skip individual loading state
      ])
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load pages/sections data'
      console.error('Failed to load pages/sections data:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Get pages for navigation (exclude home, filter by show, sort by order)
  const navigationPages = computed(() => {
    if (!pages.value) return []
    
    return Object.entries(pages.value)
      .filter(([key, page]) => key !== 'home' && page.show === true)
      .map(([key, page]) => ({
        key,
        ...page
      }))
      .sort((a, b) => a.order - b.order)
  })

  // Map page key to route
  const getPageRoute = (pageKey: string): string => {
    if (pageKey === 'home') return '/'
    return `/${pageKey}`
  }

  // Get page title
  const getPageTitle = (pageKey: string): string | null => {
    return pages.value?.[pageKey]?.title || null
  }

  // Get page config
  const getPageConfig = (pageKey: string): PageConfig | null => {
    return pages.value?.[pageKey] || null
  }

  // Get sections for a page (sorted by order, filtered by show)
  const getPageSections = (pageKey: string): PageSectionReference[] => {
    const page = pages.value?.[pageKey]
    if (!page) return []
    
    return page.sections
      .filter(section => section.show === true)
      .sort((a, b) => a.order - b.order)
  }

  // Get section data from sections.json by name
  const getSectionData = (sectionName: string): SectionData | null => {
    if (!sections.value) return null
    return sections.value.find(section => section.name === sectionName) || null
  }

  return {
    pages,
    sections,
    isLoading,
    error,
    loadPages,
    loadSections,
    loadAll,
    navigationPages,
    getPageRoute,
    getPageTitle,
    getPageConfig,
    getPageSections,
    getSectionData
  }
})
