<template>
  <UiSectionWrapper class="flex-col overflow-hidden py-20">
    <UiSectionContainer>
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
          'pb-[24px] text-[20px] md:text-[28px] lg:text-[32px] font-semibold text-center',
          headingColorClass
        ]"
      >
        {{ heading?.text || 'Trusted By' }}
      </h2>
    </UiSectionContainer>
    <div :class="[
      'relative overflow-hidden border-t h-[90px] md:h-[130px] border-b',
      borderColorClass
    ]">
      <NuxtMarquee 
        :speed="marqueeSpeed || 50" 
        :autoFill="true" 
        class="flex items-center justify-center h-full gap-8"
      >
        <div class="flex items-center gap-8 lg:gap-16 h-full px-4">
          <template v-for="(logo, index) in logos" :key="index">
            <img :src="logo.src" :alt="logo.alt" class="h-8 lg:h-10 w-auto object-contain" />
          </template>
          <!-- Duplicate for seamless loop -->
          <template v-for="(logo, index) in logos" :key="`duplicate-${index}`">
            <img :src="logo.src" :alt="logo.alt" class="h-8 lg:h-10 w-auto object-contain" />
          </template>
        </div>
      </NuxtMarquee>
    </div>
  </UiSectionWrapper>
</template>

<script setup>
import { computed } from 'vue'
import { resolveColorToken } from '~/utils/colorTokens'

// Define props
const props = defineProps({
  sectionData: {
    type: Object,
    default: null
  },
  center: {
    type: Boolean,
    default: false,
  },
})

// Extract data from sectionData (NO FALLBACKS - use sections.json only)
const heading = computed(() => props.sectionData?.heading)
const marqueeSpeed = computed(() => props.sectionData?.marqueeSpeed)
const logos = computed(() => props.sectionData?.logos || [])

// Resolve color classes using color utilities
const headingColorClass = computed(() => {
  if (!heading.value?.color) return 'text-bodyColor'
  return resolveColorToken(heading.value.color, 'text')
})

// Map hardcoded border color to base color
// border-[#D9D9D9] is a light gray, closest to bodyColor but lighter
// For now, using bodyColor as it's the closest base color
// TODO: Could add a new color token if needed, but starting with base colors
const borderColorClass = computed(() => {
  return resolveColorToken('#D9D9D9', 'border')
})
</script>
