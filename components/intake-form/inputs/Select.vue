<template>
  <div>
    <label
      :for="question.id"
      class="block text-base font-medium text-bodyColor mb-2"
      :class="{ 'text-center': true }"
      >{{ question.question }}</label
    >

    <!-- Renders the options as simple rows -->
    <div
      v-if="true"
      class="w-full flex flex-col gap-2 text-sm md:text-base"
    >
      <label
        v-for="option in question.options"
        :key="option"
        class="row-select-label"
      >
        <input
          :type="question.type === 'SINGLESELECT' ? 'radio' : 'checkbox'"
          :name="question.id"
          :value="option"
          :checked="isChecked(option)"
          @change="handleChange(option)"
          class="sr-only"
        />
        <div
          class="custom-radio-like-indicator mr-1.5 md:mr-3 flex-shrink-0"
        ></div>

        <!-- Option Image (if available) -->
        <div
          v-if="
            question.optionImages &&
            question.optionImages[getOptionIndex(option)]
          "
          class="flex items-center justify-center mr-3"
        >
          <img
            :src="question.optionImages[getOptionIndex(option)]"
            :alt="option"
            class="max-w-[24px] md:max-w-[42px] max-h-[24px] md:max-h-[42px] object-contain"
          />
        </div>

        <span class="text-bodyColor">{{ option }}</span>
      </label>
    </div>

    <!-- Renders the options as clickable boxes -->
    <div v-else class="mt-2 flex flex-col items-center gap-4">
      <div
        v-for="(row, rowIndex) in chunkArray(question.options, 3)"
        :key="rowIndex"
        class="flex justify-center flex-wrap gap-6"
      >
        <label
          v-for="(option, optionIndex) in row"
          :key="option"
          class="box-select-label"
        >
          <input
            :type="question.type === 'SINGLESELECT' ? 'radio' : 'checkbox'"
            :name="question.id"
            :value="option"
            :checked="isChecked(option)"
            @change="handleChange(option)"
            class="sr-only"
          />
          <div
            class="absolute top-3 right-3 w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center"
          >
            <div class="w-2.5 h-2.5 rounded-full"></div>
          </div>

          <!-- Option Image (if available) -->
          <div
            v-if="
              question?.optionImages &&
              question?.optionImages[getOptionIndex(option)]
            "
            class="flex-1 flex items-center justify-center mb-2"
          >
            <img
              :src="question?.optionImages[getOptionIndex(option)]"
              :alt="option"
              class="max-w-[32px] md:max-w-[56px] max-h-[32px] md:max-h-[56px] object-contain"
            />
          </div>

          <span
            class="text-center font-semibold text-bodyColor text-sm md:text-xl"
            >{{ option }}</span
          >
        </label>
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
interface SelectQuestion {
  id: string;
  question?: string;
  type: "SINGLESELECT" | "MULTISELECT";
  options: string[];
  displayAsRow?: boolean;
  optionImages?: string[];
  required?: boolean;
  validation?: string[]; // Only supports string array format for selects
}

// --- PROPS & EMITS ---
const props = defineProps<{
  question: SelectQuestion;
  modelValue: string | string[] | null;
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
// Checks if a given option should be marked as checked
const isChecked = (option: string) => {
  if (props.question.type === "SINGLESELECT") {
    return props.modelValue === option;
  }
  // For MULTISELECT, check if the option is in the array
  return Array.isArray(props.modelValue) && props.modelValue.includes(option);
};

// Handles changes for both radio and checkbox inputs
const handleChange = (option: string) => {
  if (props.question.type === "SINGLESELECT") {
    emit("update:modelValue", option);
  } else {
    // Handle MULTISELECT logic
    const currentValue = props.modelValue
      ? [...(props.modelValue as string[])]
      : [];
    const index = currentValue.indexOf(option);

    if (index > -1) {
      currentValue.splice(index, 1); // Uncheck: remove from array
    } else {
      currentValue.push(option); // Check: add to array
    }
    emit("update:modelValue", currentValue);
  }

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
    const isEmpty = props.modelValue === null || 
                   props.modelValue === undefined || 
                   props.modelValue === '' || 
                   (Array.isArray(props.modelValue) && props.modelValue.length === 0);
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

// --- HELPERS ---
const chunkArray = (array: any[], size: number) => {
  const chunkedArr = [];
  for (let i = 0; i < array.length; i += size) {
    chunkedArr.push(array.slice(i, i + size));
  }
  return chunkedArr;
};

// Get the index of an option in the options array
const getOptionIndex = (option: string) => {
  return props.question.options.indexOf(option);
};
</script>

<style scoped>
/* Box select styles */
.box-select-label {
  @apply relative bg-white rounded-xl p-4 pb-4 md:pb-10 flex flex-col justify-end items-center h-28 md:h-48 w-28 md:w-48 cursor-pointer border-2 border-transparent transition-colors hover:border-accentColor1-50 has-[:checked]:border-accentColor1;
}

.box-select-label:has(:checked) .absolute > div {
  @apply bg-accentColor1;
}

.box-select-label:has(:checked) .absolute {
  @apply border-accentColor1;
}

/* Row select styles */
.row-select-label {
  @apply relative bg-gray-50 rounded-xl p-2 flex items-center w-full cursor-pointer border-2 border-gray-200 transition-colors hover:border-accentColor1-50 has-[:checked]:border-accentColor1;
}

.row-select-label:has(:checked) .custom-radio-like-indicator {
  @apply border-accentColor1;
}

.row-select-label:has(:checked) .custom-radio-like-indicator::after {
  @apply bg-accentColor1;
}

.custom-radio-like-indicator {
  @apply w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center;
}

.custom-radio-like-indicator::after {
  content: "";
  @apply w-2.5 h-2.5 rounded-full;
}
</style>
