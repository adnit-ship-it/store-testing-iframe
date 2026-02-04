<template>
  <UiSectionWrapper :class="[
    'py-20',
    backgroundClass
  ]">
    <UiSectionContainer class="flex flex-col gap-12">
      <h2 v-motion :initial="{ opacity: 0, y: 32 }" :visible-once="{
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
          'w-full max-w-[1168px] font-defaultSerif text-[20px] md:text-[28px] lg:text-[32px] font-semibold md:text-left',
          headingColorClass
        ]">
        {{ heading?.text || 'Clinically Proven To Help You Lose Weight' }}
      </h2>
      <div class="flex gap-12">
        <div class="flex flex-col w-full gap-8">
          <div v-motion :initial="{ opacity: 0, y: 32 }" :visible-once="{
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
            class="w-full md:w-[420px] h-[108px] bg-backgroundColor border-2 border-accentColor1 rounded-[12px] flex items-center justify-center flex-col shadow-xl">
            <h3 class="text-[28px] md:text-[36px] leading-[32px] md:leading-[38px] font-semibold">{{ statisticsCards[0]?.value || '14.9%' }}</h3>
            <p class="text-[20px] text-center leading-[24px]" v-html="statisticsCards[0]?.description || 'Average reduction in body weight'"></p>
          </div>
          <div v-motion :initial="{ opacity: 0, y: 32 }" :visible-once="{
            opacity: 1,
            y: 0,
            transition: {
              duration: 400,
              type: 'ease-in',
              stiffness: 250,
              damping: 25,
              mass: 1,
              delay: 200,
            },
          }" :class="[
            'w-full md:w-[420px] h-[108px] rounded-[12px] flex items-center justify-center flex-col shadow-xl',
            cardBackgroundClass,
            cardBorderClass
          ]">
            <h3 class="text-[28px] md:text-[36px] leading-[32px] md:leading-[38px] font-semibold">{{ statisticsCards[1]?.value || '6x' }}</h3>
            <p class="text-[20px] text-center leading-[24px]" v-html="statisticsCards[1]?.description || 'More weight loss than diet<br>and exercise alone'"></p>
          </div>
          <div v-motion :initial="{ opacity: 0, y: 32 }" :visible-once="{
            opacity: 1,
            y: 0,
            transition: {
              duration: 400,
              type: 'ease-in',
              stiffness: 250,
              damping: 25,
              mass: 1,
              delay: 250,
            },
          }" :class="[
            'w-full md:w-[420px] h-[108px] rounded-[12px] flex items-center justify-center flex-col shadow-xl',
            cardBackgroundClass,
            cardBorderClass
          ]">
            <h3 class="text-[28px] md:text-[36px] leading-[32px] md:leading-[38px] font-semibold">{{ statisticsCards[2]?.value || '100%' }}</h3>
            <p class="text-[20px] text-center leading-[24px]">{{ statisticsCards[2]?.description || 'Online Personalized Support' }}</p>
          </div>
        </div>
        <img 
          v-if="media?.graph?.src"
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
          :src="media?.graph?.src" 
          :alt="media?.graph?.alt || 'weight loss graph'" 
          class="hidden lg:block h-[388px] object-contain"
        >
      </div>
    </UiSectionContainer>
  </UiSectionWrapper>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { resolveColorToken } from '~/utils/colorTokens'

// Define props
const props = defineProps({
  sectionData: {
    type: Object,
    default: null
  }
})

// Extract data from sectionData (NO FALLBACKS - use sections.json only)
const heading = computed(() => props.sectionData?.heading)
const media = computed(() => props.sectionData?.media)

// Note: Statistics section doesn't have cards in sections.json yet
// For now, using fallback values, but structure is ready for sections.json data
const statisticsCards = computed(() => {
  // If sections.json has cards data in the future, use it here
  return [
    { value: '14.9%', description: 'Average reduction in body weight' },
    { value: '6x', description: 'More weight loss than diet<br>and exercise alone' },
    { value: '100%', description: 'Online Personalized Support' }
  ]
})

// Resolve color classes using color utilities
const headingColorClass = computed(() => {
  if (!heading.value?.color) return 'text-black'
  return resolveColorToken(heading.value.color, 'text')
})

// Background class - default to accentColor2 (as it was before)
const backgroundClass = computed(() => {
  return resolveColorToken('accentColor2', 'bg')
})

// Card styling classes
const cardBackgroundClass = computed(() => {
  return resolveColorToken('backgroundColor', 'bg')
})

const cardBorderClass = computed(() => {
  return resolveColorToken('accentColor1', 'border') + ' border-2'
})
</script>