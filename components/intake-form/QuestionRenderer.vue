<template>
  <FormStepLayout
    v-if="stepData"
    :stepData="stepData"
    :formAnswers="formAnswers"
    :isLoading="isLoading"
  />
</template>

<script setup lang="ts">
import type { FormStep, FormAnswers } from "~/types/intake-form/form";
import FormStepLayout from "./FormStepLayout.vue";

// --- PROPS ---
defineProps<{
  stepData: FormStep;
  formAnswers: FormAnswers;
  isLoading: boolean;
}>();
</script>
