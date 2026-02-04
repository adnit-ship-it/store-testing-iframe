<template>
  <UiSectionWrapper :class="[
    'py-20 md:py-32 relative',
    backgroundClass,
    bodyTextColorClass
  ]">
    <UiSectionContainer class="flex md:flex-row-reverse pb-8 md:pb-0">
      <div 
        v-if="media?.product?.src"
        class="absolute bottom-0 right-0 z-20 max-h-[320px] md:max-h-[384px] lg:max-h-[480px]" 
        :style="{ height: foregroundHeight }"
      >
        <img 
          :src="media?.product?.src" 
          :alt="media?.product?.alt"
          class="h-full max-h-full max-w-full w-full object-contain" 
        />
      </div>

      <div class="relative z-30 w-full h-full">
        <div class="flex flex-col h-full">
          <h2 
            v-if="heading?.show !== false"
            v-motion 
            :initial="{ opacity: 0, y: 32 }" 
            :visible-once="{
              opacity: 1,
              y: 0,
              transition: {
                duration: 400,
                type: 'ease-in',
                stiffness: 250,
                damping: 25,
                mass: 1,
                delay: 100,
              },
            }" 
            :class="[
              'font-semibold text-[20px] md:text-[28px] lg:text-[32px]',
              headingColorClass
            ]"
          >
            {{ heading?.text }}
          </h2>
          <p 
            v-if="subheading?.show !== false"
            v-motion 
            :initial="{ opacity: 0, y: 32 }" 
            :visible-once="{
              opacity: 1,
              y: 0,
              transition: {
                duration: 400,
                type: 'ease-in',
                stiffness: 250,
                damping: 25,
                mass: 1,
                delay: 150,
              },
            }" 
            :class="[
              'pt-5 text-[16px] md:text-[20px] lg:text-[28px] font-regular',
              subheadingColorClass
            ]"
          >
            {{ subheading?.text }}
          </p>

          <div class="flex flex-col lg:flex-row gap-2 lg:gap-7 pt-4 lg:pt-5">
            <UiButton 
              v-for="(button, index) in displayButtons"
              :key="index"
              v-if="button && button.show !== false"
              v-motion 
              :initial="{ opacity: 0, y: 32 }" 
              :visible-once="{
                opacity: 1,
                y: 0,
                transition: {
                  duration: 400,
                  type: 'ease-in',
                  stiffness: 250,
                  damping: 25,
                  mass: 1,
                  delay: 200 + (index * 50),
                },
              }" 
              ghost 
              decorative 
              :width="isMobile ? '145px' : '320px'" 
              :height="isMobile ? '24px' : '44px'"
              :font-size="isMobile ? '12' : '24'"
            >
              {{ button.text }}
            </UiButton>
          </div>

          <div class="pt-7 lg:pt-[50px] grid grid-cols-2 gap-x-4 lg:gap-x-10 gap-y-2 lg:gap-y-4 font-medium  lg:max-w-[66%]">
            <div v-for="(feature, index) in bulletPointsItems" :key="index" v-motion :initial="{ opacity: 0, y: 32 }" :visible-once="{
              opacity: 1,
              y: 0,
              transition: {
                duration: 400,
                type: 'ease-in',
                stiffness: 250,
                damping: 25,
                mass: 1,
                delay: 300 + (index * 50),
              },
            }" class="flex gap-1 items-center text-[12px] md:text-[20px] lg:text-[24px] font-medium">
              <UiIcon 
                :src="bulletPointIconSrc" 
                :icon-color="bulletPointIconColor"
                size="w-[18px] h-[18px] md:w-[24px] md:h-[24px] lg:w-[28px] lg:h-[28px]"
                alt="star icon"
              />
              <p>{{ feature }}</p>
            </div>
          </div>
        </div>
      </div>
    </UiSectionContainer>
  </UiSectionWrapper>


</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";
import { resolveColorToken, resolveIconColor } from '~/utils/colorTokens';

// Define props
const props = defineProps({
  sectionData: {
    type: Object,
    default: null
  }
})

// Extract data from sectionData (NO FALLBACKS - use sections.json only)
const heading = computed(() => props.sectionData?.heading)
const subheading = computed(() => props.sectionData?.subheading)
const buttons = computed(() => props.sectionData?.buttons)
const button1 = computed(() => props.sectionData?.button1) // Legacy support
const button2 = computed(() => props.sectionData?.button2) // Legacy support
const bulletPoints = computed(() => props.sectionData?.bulletPoints)
const media = computed(() => props.sectionData?.media)

// Combine buttons array (preferred) with legacy button1/button2 for backwards compatibility
const displayButtons = computed(() => {
  // Use new buttons array if available
  if (buttons.value && Array.isArray(buttons.value) && buttons.value.length > 0) {
    // Filter out any undefined/null buttons
    return buttons.value.filter(btn => btn && typeof btn === 'object')
  }
  
  // Fallback to legacy button1/button2 format
  const legacyButtons = []
  if (button1.value && typeof button1.value === 'object') legacyButtons.push(button1.value)
  if (button2.value && typeof button2.value === 'object') legacyButtons.push(button2.value)
  return legacyButtons
})

// Get icon color directly from bulletPoints config
const bulletPointIconColor = computed(() => {
  const iconColorToken = bulletPoints.value?.icon?.color
  if (!iconColorToken) return null
  return resolveIconColor(iconColorToken)
})

// Get icon path from bulletPoints config
const bulletPointIconSrc = computed(() => {
  return bulletPoints.value?.icon?.src || ''
})

// Bullet points items - now handled directly in template with grid layout
const bulletPointsItems = computed(() => {
  return bulletPoints.value?.items || []
})

// Responsive height for foreground image
const foregroundHeight = computed(() => {
  if (!media.value?.product) return '222px';
  if (isMobile.value) return '320px';
  return 'auto';
});

const isMobile = ref(false);
const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768;
};

onMounted(() => {
  checkMobile();
  window.addEventListener("resize", checkMobile);
});

onUnmounted(() => {
  window.removeEventListener("resize", checkMobile);
});

// Resolve color classes using color utilities
const headingColorClass = computed(() => {
  if (!heading.value?.color) return 'text-bodyColor'
  return resolveColorToken(heading.value.color, 'text')
})

const subheadingColorClass = computed(() => {
  if (!subheading.value?.color) return 'text-bodyColor'
  return resolveColorToken(subheading.value.color, 'text')
})

const bodyTextColorClass = computed(() => {
  return resolveColorToken('bodyColor', 'text')
})

// Map hardcoded background color bg-[#E3D5D4] to base color
// #E3D5D4 is a light pink/beige, closest to backgroundColor
// Using backgroundColor as the default section background
const backgroundClass = computed(() => {
  // Background is now handled by DynamicSection via backgroundClass
  // But if we need a specific background here, we can add it
  // For now, sections default to bg-backgroundColor from DynamicSection
  return ''
})
</script>

<style scoped>
/* Component styles can be added here */
</style>
