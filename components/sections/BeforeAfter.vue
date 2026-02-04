<template>
  <UiSectionWrapper class="py-20 md:py-32 flex flex-col bg-backgroundColor">
    <UiSectionContainer>
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
      }" :class="[
        'text-[20px] md:text-[28px] lg:text-[32px] font-semibold text-center mb-12',
        headingColorClass
      ]">
        {{ heading?.text || 'Our Customers Results' }}
      </h2>

    </UiSectionContainer>
    <UiTestimonialCarousel :items="testimonialData" />
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
const beforeAfter = computed(() => props.sectionData?.beforeAfter || [])

// Resolve color classes using color utilities
const headingColorClass = computed(() => {
  if (!heading.value?.color) return 'text-bodyColor'
  return resolveColorToken(heading.value.color, 'text')
})

// Transform beforeAfter data to testimonial format
const testimonialData = computed(() => {
  return beforeAfter.value.map((item) => ({
    image: item.image?.src || '',
    alt: item.image?.alt || "Before and after transformation",
    testimonial: item.image?.testimonial || '',
    name: item.image?.name || '',
    stars: item.image?.stars || 5,
    order: item.image?.order || 0
  })).sort((a, b) => a.order - b.order)
})
</script>
