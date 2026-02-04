<template>
  <div class="w-full">
    <!-- Weight Summary Display for personalInfo step - ABOVE the white container -->
    <WeightSummaryDisplay v-if="stepData.id === 'personalInfo'" :formAnswers="formAnswers" />

    <!-- This container handles the overall styling for the question area -->
    <div class="relative" :class="{ 
      'border-2 border-bodyColor rounded-2xl bg-white p-6': !isMarketingOrBoxSelect,
      'p-0': isMarketingOrBoxSelect 
    }">
      <h2 v-if="stepData.title" class="font-bold text-lg md:text-center text-left font-bodyFont md:font-headingFont md:text-[24px] text-bodyColor leading-[32px] md:leading-[36px] mb-2 md:mb-3"
          :class="{ 'text-center': isMarketingOrBoxSelect }">
        {{ stepData.title }}
      </h2>
      
      <p v-if="stepData.questionSubtext" class="text-sm md:text-base text-left md:text-center">
        {{ stepData.questionSubtext }}
      </p>

      <!-- This grid handles the layout for steps with multiple questions -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 md:gap-y-8 pb-6 pt-4">
        <div v-for="(question, index) in stepData.questions" :key="question.id"
            :class="{ 'md:col-span-2': isFullWidth(question, index) }">
          <!-- Vue's dynamic component magic happens here -->
          <component
              :is="getComponentForQuestion(question)" 
              :key="`${question.id}-${question.type}`"
              :question="question"
              :formAnswers="formAnswers"
              v-model="formAnswers[question.id]" 
          />
        </div>
      </div>

      <!-- Display calculated values (like BMI) -->
      <div v-if="displayValue" class="text-left">
        <p class="text-xl font-medium text-bodyColor">{{ displayValue }}</p>
      </div>

      <!-- Loading Overlay -->
      <div v-if="isLoading" class="absolute inset-0 bg-bodyColor bg-opacity-5 backdrop-blur-sm rounded-xl flex items-center justify-center z-10">
        <div class="flex flex-col items-center space-y-4">
          <!-- Spinner -->
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-accentColor1"></div>
          <!-- Loading text -->
          <p class="text-bodyColor font-medium text-lg">Processing...</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, type PropType } from 'vue'
import type { FormStep, FormQuestion, FormAnswers } from '~/types/intake-form/form'
import WeightSummaryDisplay from './WeightSummaryDisplay.vue'
import { getComponentForQuestion } from '~/utils/intake-form/componentMapper'

// --- PROPS ---
const props = defineProps({
  stepData: { type: Object as PropType<FormStep>, required: true },
  formAnswers: { type: Object as PropType<FormAnswers>, required: true },
  isLoading: { type: Boolean, default: false },
})

// --- COMPUTED & HELPERS ---
const stepQuestions = computed(() => props.stepData.questions || [])

const isMarketingOrBoxSelect = computed(() => {
  const q = stepQuestions.value[0]
  if (!q) return false
  if (q.type === 'MARKETING' || q.type === 'PERFECT' || q.type === 'BEFORE_AFTER') return true
  // return (q.type === 'SINGLESELECT' || q.type === 'MULTISELECT') && !q.displayAsRow
})

const isFullWidth = (question: FormQuestion, index: number) => {
  if (isMarketingOrBoxSelect.value || question.type === 'FILE_INPUT') return true
  return stepQuestions.value.length % 2 !== 0 && index === stepQuestions.value.length - 1
}

// Calculate and display computed values (like BMI)
const displayValue = computed(() => {
  if (!props.stepData.displayValue) return null
  
  const { condition, calculate, template } = props.stepData.displayValue
  
  // Check if condition is met
  if (!condition(props.formAnswers)) return null
  
  // Calculate the value
  const calculatedValue = calculate(props.formAnswers)
  
  // Replace {{value}} placeholder with calculated value
  return template.replace('{{value}}', calculatedValue.toString())
})
</script> 