<template>
  <div>
    <label
      :for="question.id"
      class="block text-base font-medium text-bodyColor mb-2"
      >{{ question.question }}</label
    >
    <div class="relative">
      <select
        :id="question.id"
        :value="modelValue"
        @change="updateValue"
        @blur="handleBlur"
        class="form-input"
        :class="{ 
          'border-red-500 focus:ring-red-500': hasError
        }"
        :aria-describedby="`${question.id}-error`"
        :aria-invalid="hasError"
      >
        <!-- The value here now correctly matches the initial state -->
        <option value="">Select...</option>
        <option
          v-for="(option, index) in question.options"
          :key="option"
          :value="option"
        >
          {{
            question.optionLabels && question.optionLabels[index]
              ? question.optionLabels[index]
              : option
          }}
        </option>
      </select>
      <div
        class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4"
      >
        <svg
          class="h-5 w-5 text-gray-400"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="2"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M19.5 8.25l-7.5 7.5-7.5-7.5"
          />
        </svg>
      </div>
    </div>
    <div v-if="hasError" :id="`${question.id}-error`" class="text-red-500 text-sm mt-1">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { validateAnswer } from "~/utils/intake-form/validation";
import type { Question } from "~/types/intake-form/form";

// --- TYPE DEFINITIONS ---
interface DropdownQuestion {
  id: string;
  question: string;
  options: (string | number)[];
  optionLabels?: string[];
  required?: boolean;
  validation?: string[]; // Only supports string array format for dropdowns
}

// --- PROPS & EMITS ---
const props = defineProps<{
  question: DropdownQuestion;
  modelValue: string | number | null;
}>();

const emit = defineEmits(["update:modelValue"]);

// --- REACTIVE STATE ---
const hasError = ref(false);
const errorMessage = ref("");
const touched = ref(false);

// Check if question uses new validation format (string array from Supabase)
const usesNewValidation = computed(() => {
  return props.question.validation && 
         Array.isArray(props.question.validation) && 
         props.question.validation.length > 0 && 
         typeof props.question.validation[0] === 'string';
});

// --- METHODS ---
// This function ensures the emitted value is correctly typed.
const updateValue = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  // Check if the option should be a number
  const selectedOption = props.question.options.find(
    (opt) => opt.toString() === target.value,
  );
  const value =
    typeof selectedOption === "number"
      ? parseFloat(target.value)
      : target.value;
  emit("update:modelValue", value);

  // Set touched on first interaction
  if (!touched.value) {
    touched.value = true;
  }

  // Validate when user makes a selection
  validateField();
};

const validateField = () => {
  // Use new validation system if available
  if (usesNewValidation.value) {
    const questionForValidation: Question = {
      id: props.question.id,
      validation: props.question.validation as string[]
    };
    
    const validationError = validateAnswer(questionForValidation, props.modelValue);
    hasError.value = validationError !== null;
    errorMessage.value = validationError || "";
    return;
  }

  // Fall back to basic required validation
  if (props.question.required) {
    const isEmpty = props.modelValue === null || props.modelValue === undefined || props.modelValue === '';
    hasError.value = isEmpty;
    errorMessage.value = isEmpty ? 'This field is required' : '';
  } else {
    hasError.value = false;
    errorMessage.value = "";
  }
};

// --- WATCHERS ---
// Validate when the value changes (but don't show errors until touched)
watch(
  () => props.modelValue,
  () => {
    if (touched.value) {
      validateField();
    }
  },
  { immediate: false },
);

// Validate on blur for better UX
const handleBlur = () => {
  touched.value = true;
  validateField();
};
</script>

<style scoped>
.form-input {
  @apply block rounded-[10px] w-full border border-gray-200 bg-gray-50 px-2 md:px-4 h-10 md:h-12 text-sm md:text-lg appearance-none focus:outline-none focus:ring-2 focus:ring-accentColor1;
}
</style>
