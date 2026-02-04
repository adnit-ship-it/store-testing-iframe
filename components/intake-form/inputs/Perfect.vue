<template>
  <div class="text-center space-y-6">
    <!-- Main Heading -->
    <h2
      v-if="question.heading"
      class="text-2xl md:text-5xl font-bold text-accentColor1 leading-[32px] md:leading-[58px]"
    >
      {{ question.heading }}
    </h2>

    <!-- Dynamic Subtext -->
    <p
      v-if="question.dynamicSubtext"
      class="text-base md:text-xl text-bodyColor font-bold"
    >
      {{ question.dynamicSubtext }}
    </p>

    <!-- Static Subtext -->
    <p
      v-if="question.subtext"
      class="text-sm md:text-lg text-bodyColor font-medium"
    >
      {{ question.subtext }}
    </p>
  </div>
</template>

<script setup lang="ts">
// --- TYPE DEFINITIONS ---
interface PerfectQuestion {
  id: string;
  type: "PERFECT";
  required: boolean;
  heading?: string;
  dynamicSubtext?: string;
  subtext?: string;
}

// --- PROPS & EMITS ---
const props = defineProps<{
  question: PerfectQuestion;
  modelValue: any; // Not used for this component but required for consistency
}>();

const emit = defineEmits(["update:modelValue"]);

// This component doesn't need any form logic since it's just display
</script>
