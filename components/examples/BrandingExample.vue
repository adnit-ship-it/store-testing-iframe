<template>
  <div class="branding-example">
    <!-- Example of using dynamic logos -->
    <div v-if="isBrandingLoaded" class="logo-section">
      <img 
        :src="logoUrl" 
        :alt="`${organizationName} Logo`"
        class="h-12 w-auto"
      />
      <img 
        :src="altLogoUrl" 
        :alt="`${organizationName} Alt Logo`"
        class="h-12 w-auto"
      />
    </div>
    
    <!-- Example of using dynamic colors -->
    <div 
      class="color-example"
      :style="{
        backgroundColor: brandColors.accentColor2,
        color: brandColors.bodyColor,
        borderColor: brandColors.accentColor1
      }"
    >
      <h3 :style="{ color: brandColors.accentColor1 }">
        Dynamic Brand Colors
      </h3>
      <p>Background: {{ brandColors.backgroundColor }}</p>
      <p>Accent 1: {{ brandColors.accentColor1 }}</p>
      <p>Accent 2: {{ brandColors.accentColor2 }}</p>
    </div>
    
    <!-- Example button using dynamic colors -->
    <button 
      class="dynamic-button"
      :style="{
        backgroundColor: brandColors.accentColor1,
        color: '#FFFFFF'
      }"
    >
      Dynamic Button
    </button>
  </div>
</template>

<script setup lang="ts">
import { useBrandColors, useBrandLogos } from '~/utils/branding'

const { getBrandColors, isBrandingLoaded } = useBrandColors()
const { logoUrl, altLogoUrl, organizationName } = useBrandLogos()

const brandColors = computed(() => getBrandColors())
</script>

<style scoped>
.branding-example {
  @apply p-6 space-y-4;
}

.logo-section {
  @apply flex gap-4 items-center;
}

.color-example {
  @apply p-4 rounded-lg border-2;
}

.dynamic-button {
  @apply px-6 py-3 rounded-lg font-medium transition-colors hover:opacity-90;
}
</style>