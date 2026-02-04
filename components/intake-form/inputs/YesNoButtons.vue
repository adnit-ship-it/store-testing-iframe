<template>
  <div>
    <!-- Image (if provided) -->
    <div v-if="question.image" class="mb-8">
      <img
        :src="question.image"
        :alt="question.question || 'Question image'"
        class="w-full max-w-md mx-auto rounded-xl"
      />
    </div>

    <label
      :for="question.id"
      class="block text-base font-medium text-bodyColor mb-2"
    >
      {{ question.question }}
      <span v-if="question.required && question.question" class="text-red-500"
        >*</span
      >
    </label>

    <div class="flex gap-4">
      <!-- Yes Button -->
      <label class="yes-no-button" :class="{ selected: isChecked('Yes') }">
        <input
          type="radio"
          :name="question.id"
          value="Yes"
          :checked="isChecked('Yes')"
          @change="handleChange('Yes')"
          class="sr-only"
        />
        <div class="radio-indicator">
          <div class="radio-dot"></div>
        </div>
        <span class="button-text">Yes</span>
      </label>

      <!-- No Button -->
      <label class="yes-no-button" :class="{ selected: isChecked('No') }">
        <input
          type="radio"
          :name="question.id"
          value="No"
          :checked="isChecked('No')"
          @change="handleChange('No')"
          class="sr-only"
        />
        <div class="radio-indicator">
          <div class="radio-dot"></div>
        </div>
        <span class="button-text">No</span>
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
// --- TYPE DEFINITIONS ---
interface YesNoQuestion {
  id: string;
  question: string;
  type: "SINGLESELECT";
  required?: boolean;
  image?: string; // Optional image to display above the question
}

// --- PROPS & EMITS ---
const props = defineProps<{
  question: YesNoQuestion;
  modelValue: string | null;
}>();

const emit = defineEmits(["update:modelValue"]);

// --- METHODS ---
const isChecked = (option: string) => {
  return props.modelValue === option;
};

const handleChange = (option: string) => {
  emit("update:modelValue", option);
};
</script>

<style scoped>
.yes-no-button {
  @apply flex items-center gap-3 px-2 md:px-4 h-10 md:h-12 bg-gray-50 border border-gray-200 rounded-[10px] cursor-pointer transition-all duration-200 hover:border-accentColor1-50 flex-1;
}

.yes-no-button.selected {
  @apply border-accentColor1 bg-white;
}

.radio-indicator {
  @apply w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center flex-shrink-0;
}

.yes-no-button.selected .radio-indicator {
  @apply border-accentColor1;
}

.radio-dot {
  @apply w-2.5 h-2.5 rounded-full;
}

.yes-no-button.selected .radio-dot {
  @apply bg-accentColor1;
}

.button-text {
  @apply text-sm md:text-lg font-medium text-bodyColor;
}
</style>
