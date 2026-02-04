<template>
  <div class="mb-8">
    <div class="flex flex-col gap-4">
      <div class="text-bodyColor"><b>BMI:</b> {{ bmi }}</div>
      <div class="text-bodyColor">
        <b>Current Weight:</b> {{ currentWeight }} lbs
      </div>
      <div class="text-bodyColor">
        <b>Goal Weight:</b> {{ goalWeight }} lbs
        <span class="uppercase underline">within {{ nrOfWeeks }} weeks</span>
      </div>
      <hr />
      <p class="text-bodyColor">
        You are a
        <span class="font-bold text-bodyColor">strong candidate</span> for
        medical weight loss with a
        <span class="font-bold text-bodyColor">94% chance</span> chance of
        successful treatment if qualified.
      </p>
      <hr />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import type { FormAnswers } from "~/types/intake-form/form";
import { calculatePaceValues } from "~/utils/intake-form/calculations";

// --- PROPS ---
const props = defineProps<{
  formAnswers: FormAnswers;
}>();

// --- COMPUTED PROPERTIES ---
const currentWeight = computed(() => {
  return props.formAnswers.weight || "--";
});

const goalWeight = computed(() => {
  return props.formAnswers.goalWeight || "--";
});

const bmi = computed(() => {
  const feet = props.formAnswers.feet;
  const inches = props.formAnswers.inches;
  const weight = props.formAnswers.weight;

  if (!feet || !inches || !weight) return "--";

  // Convert height from feet/inches to inches
  const heightInInches = feet * 12 + inches;
  const heightInMeters = heightInInches * 0.0254;
  const weightInKg = weight * 0.453592; // Convert lbs to kg

  // Calculate BMI: weight (kg) / height (m)²
  const bmiValue = weightInKg / (heightInMeters * heightInMeters);

  return bmiValue.toFixed(1);
});

const nrOfWeeks = ref("--");

watch(
  () => [props.formAnswers.weight, props.formAnswers.goalWeight],
  ([currentWeight, goalWeight]) => {
    try {
      if (!currentWeight || !goalWeight) {
        nrOfWeeks.value = "--";
        return;
      }

      const paceValues = calculatePaceValues(currentWeight, goalWeight);
      nrOfWeeks.value = paceValues.timeToGoal || "--";
    } catch (error) {
      console.error("Error calculating nrOfWeeks:", error);
      nrOfWeeks.value = "--";
    }
  },
  { immediate: true },
);
</script>
