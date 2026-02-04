<template>
  <div>
    <label
      :for="question.id"
      class="block text-base font-medium text-bodyColor mb-2"
    >
      {{ question.question }}
      <span v-if="question.required && question.question" class="text-red-500"
        >*</span
      >
    </label>
    <div class="relative">
      <input
        :id="question.id"
        :type="question.type"
        :value="modelValue"
        @input="updateValue"
        @blur="handleBlur"
        class="form-input"
        :style="question.icon ? 'padding-left: 36px;' : ''"
        :class="{
          'border-red-500 focus:ring-red-500': hasError,
        }"
        :placeholder="question.placeholder"
        :aria-describedby="`${question.id}-error`"
        :aria-invalid="hasError"
      />

      <!-- Icon (if provided) -->
      <div
        v-if="question.icon"
        class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
      >
        <img
          :src="question.icon"
          :alt="`${question.question} icon`"
          class="h-5 w-5 text-bodyColor"
        />
      </div>
    </div>
    <div
      v-if="hasError"
      :id="`${question.id}-error`"
      class="text-red-500 text-sm mt-1"
    >
      {{ errorMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { validateFieldWithRules, validateAnswer } from "~/utils/intake-form/validation";
import type { ValidationRule, Question } from "~/types/intake-form/form";

// --- TYPE DEFINITIONS ---
// We define the shape of the question object this component expects.
interface InputQuestion {
  id: string;
  question: string;
  type: "text" | "number" | "email" | "tel";
  placeholder?: string;
  required: boolean;
  validation?: ValidationRule[];
  icon?: string;
}

// --- PROPS & EMITS ---
const props = defineProps<{
  question: InputQuestion;
  modelValue: string | number | null; // This is the value from the formAnswers object
  formAnswers?: any; // Add formAnswers for cross-field validation
}>();

const emit = defineEmits(["update:modelValue"]);

// --- REACTIVE STATE ---
const hasError = ref(false);
const errorMessage = ref("");
const touched = ref(false);

// --- COMPUTED ---
const validationRules = computed(() => {
  const rules: ValidationRule[] = [];

  // Add required validation if the field is required
  if (props.question.required) {
    rules.push({ type: "required", message: "This field is required" });
  }

  // Add custom validation rules if provided (legacy format)
  if (props.question.validation && Array.isArray(props.question.validation) && typeof props.question.validation[0] !== 'string') {
    rules.push(...(props.question.validation as ValidationRule[]));
  }

  return rules;
});

// Check if question uses new validation format (string array from Supabase)
const usesNewValidation = computed(() => {
  return props.question.validation && 
         Array.isArray(props.question.validation) && 
         props.question.validation.length > 0 && 
         typeof props.question.validation[0] === 'string';
});

// --- METHODS ---
// This function handles updating the value in the parent component.
// It also correctly handles casting the value to a number if needed.
const updateValue = (event: Event) => {
  const target = event.target as HTMLInputElement;
  let value: string | number = target.value;
  if (props.question.type === "number") {
    value = target.valueAsNumber;
  }
  emit("update:modelValue", value);

  // Set touched on first interaction
  if (!touched.value) {
    touched.value = true;
  }

  // Validate when user starts typing
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

  // Fall back to legacy validation system
  if (validationRules.value.length === 0) {
    hasError.value = false;
    errorMessage.value = "";
    return;
  }

  const result = validateFieldWithRules(
    props.modelValue,
    validationRules.value,
    props.formAnswers,
  );
  hasError.value = !result.isValid;
  errorMessage.value = result.message || "";
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

// Validate when formAnswers change (important for cross-field validation)
watch(
  () => props.formAnswers,
  () => {
    if (touched.value) {
      validateField();
    }
  },
  { deep: true },
);

// Validate on blur for better UX
const handleBlur = () => {
  touched.value = true;
  validateField();
};
</script>

<style scoped>
.form-input {
  @apply block rounded-[10px] w-full border border-gray-200 bg-gray-50 px-2 md:px-4 h-10 md:h-12 text-sm md:text-lg appearance-none focus:outline-none focus:ring-2 focus:ring-accentColor1 transition-colors duration-200;
}

/* Hide number input spinners */
.form-input::-webkit-outer-spin-button,
.form-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}
</style>
