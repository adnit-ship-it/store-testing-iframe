<template>
  <UiSectionWrapper class="py-20 md:py-32 bg-backgroundColor">
    <UiSectionContainer class="text-center">
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
        'font-semibold text-[28px] md:text-[32px] lg:text-[36px] mb-12',
        headingColorClass
      ]">
        {{ heading?.text || 'Frequently Asked Questions' }}
      </h2>

      <div class="w-full space-y-4">
        <div 
          v-for="(faqItem, index) in faqs" 
          :key="index"
          :class="['border-b', borderColorClass]"
        >
          <button
            @click="toggleFAQ(index)"
            class="w-full flex items-center justify-between py-6 text-left transition-colors duration-200"
          >
            <span :class="[
              'font-medium text-[16px] md:text-[18px] pr-4',
              bodyTextColorClass
            ]">
              {{ faqItem.question }}
            </span>
            <div class="flex-shrink-0">
              <svg 
                :class="[
                  'w-5 h-5 text-gray-500 transition-transform duration-300',
                  faqItem.isOpen ? 'rotate-45' : ''
                ]"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
            </div>
          </button>
          
          <div 
            :class="[
              'overflow-hidden',
              faqItem.isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
            ]"
            :style="{
              transition: 'max-height 500ms cubic-bezier(0.4, 0, 0.2, 1), opacity 400ms ease-out'
            }"
          >
            <div class="pb-6 pr-4">
              <p class="text-[14px] text-left md:text-[16px] text-gray-600 leading-relaxed">
                {{ faqItem.answer }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </UiSectionContainer>
  </UiSectionWrapper>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
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
const faq = computed(() => props.sectionData?.faq || [])

const openIndex = ref<number | null>(null)

const faqs = computed(() => {
  return faq.value.map((faqItem: any, index: number) => ({
    question: faqItem.question,
    answer: faqItem.answer,
    isOpen: openIndex.value === index,
    order: faqItem.order || index
  })).sort((a: any, b: any) => a.order - b.order)
})

const toggleFAQ = (index: number) => {
  // Accordion behavior: if clicking the same item, close it; otherwise open the new one
  openIndex.value = openIndex.value === index ? null : index
}

// Resolve color classes using color utilities
const headingColorClass = computed(() => {
  if (!heading.value?.color) return 'text-bodyColor'
  return resolveColorToken(heading.value.color, 'text')
})

const bodyTextColorClass = computed(() => {
  return resolveColorToken('bodyColor', 'text')
})

const borderColorClass = computed(() => {
  return resolveColorToken('bodyColor', 'border')
})
</script> 