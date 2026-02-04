<template>
  <div v-if="hasError" class="text-red-500 p-4 text-sm border border-red-300 rounded bg-red-50">
    <strong>Error rendering section "{{ section?.name }}":</strong> {{ errorMessage }}
    <div v-if="isDev" class="mt-2 text-xs text-gray-600">
      Component: {{ componentName }}<br>
      Props: {{ JSON.stringify(sectionProps, null, 2) }}
    </div>
  </div>
  <component 
    v-else-if="resolvedComponent"
    :is="resolvedComponent"
    v-bind="sectionProps"
    :class="backgroundClass"
    @error="handleComponentError"
  />
  <!-- Skip rendering if component is null -->
  <div v-else-if="componentName === null || componentName === 'null'" class="hidden">
    <!-- Section skipped: {{ section?.name }} -->
  </div>
  <div v-else-if="isDev" class="text-yellow-500 p-4 text-sm border border-yellow-300 rounded">
    ⚠️ Section "{{ section?.name }}" has no component defined (component: {{ componentName }})
  </div>
  <div v-else class="hidden">
    <!-- Production: silently skip missing components -->
  </div>
</template>

<script setup>
import { computed, ref, watch, onErrorCaptured } from 'vue'
import { getSectionComponent } from '~/utils/sectionComponents'
import { extractSectionData } from '~/utils/sectionDataExtractor'
import { resolveBackgroundColor } from '~/utils/colorTokens'
import { usePagesStore } from '~/stores/pagesStore'

const isDev = import.meta.dev
const pagesStore = usePagesStore()

const props = defineProps({
  section: {
    type: Object,
    required: true
  },
  // Additional props to merge with section props (for computed values from parent)
  additionalProps: {
    type: Object,
    default: () => ({})
  }
})

// Error handling state
const hasError = ref(false)
const errorMessage = ref('')

// Validate section structure
const isValidSection = computed(() => {
  if (!props.section) {
    errorMessage.value = 'Section object is missing'
    return false
  }
  if (!props.section.name) {
    errorMessage.value = 'Section name is missing'
    return false
  }
  return true
})

// Get component name from section reference
const componentName = computed(() => {
  if (!isValidSection.value) return null
  return props.section?.component || null
})

// Resolve component name to actual component reference using component registry
const resolvedComponent = computed(() => {
  if (!componentName.value || componentName.value === 'null' || componentName.value === null) {
    return null
  }
  
  const component = getSectionComponent(componentName.value)
  
  if (!component) {
    // Component not found in registry
    if (isDev) {
      console.warn(`Component "${componentName.value}" not found in registry for section "${props.section?.name}"`)
    }
    handleComponentError(new Error(`Component "${componentName.value}" not found`))
    return null
  }
  
  return component
})

// Fetch section data from sections.json
const sectionData = computed(() => {
  if (!isValidSection.value || !props.section?.name) {
    return null
  }
  return pagesStore.getSectionData(props.section.name)
})

// Extract complete data from sections.json
const extractedData = computed(() => {
  if (!sectionData.value) {
    if (isDev) {
      console.warn(
        `[DynamicSection] No section data found for "${props.section?.name}"`
      )
    }
    return null
  }
  return extractSectionData(sectionData.value)
})

// Get background color class for section wrapper
// Default to backgroundColor (base color) if no section background is defined
const backgroundClass = computed(() => {
  // If section has explicit background color, use it
  if (extractedData.value?.backgroundColor) {
    return resolveBackgroundColor(extractedData.value.backgroundColor)
  }
  // Default to backgroundColor (base color) for all sections
  return resolveBackgroundColor('backgroundColor')
})

// Get props from section reference and merge with additional props and sectionData
const sectionProps = computed(() => {
  if (!isValidSection.value) return {}
  const propsObj = props.section?.props || {}
  
  // Merge with additional props and extracted section data
  // Priority: additionalProps > extractedData > section props
  const mergedProps = {
    ...propsObj,
    sectionData: extractedData.value, // Pass complete extracted data
    ...props.additionalProps
  }
  
  return mergedProps
})

// Handle component errors
const handleComponentError = (error) => {
  hasError.value = true
  errorMessage.value = error?.message || 'Unknown error'
  if (isDev) {
    console.error(`Error in DynamicSection "${props.section?.name}":`, error)
  }
}

// Watch for section changes and reset error
watch(() => props.section, () => {
  hasError.value = false
  errorMessage.value = ''
}, { deep: true })

// Capture Vue component errors
onErrorCaptured((err) => {
  handleComponentError(err)
  return false // Prevent error from propagating
})

// Development warnings
if (isDev) {
  watch(componentName, (name) => {
    if (name && name !== 'null' && name !== null) {
      // Check if component might exist (basic validation)
      // Note: We can't actually check if component exists at runtime easily
      // This is just for development feedback
    }
  })
}
</script>

