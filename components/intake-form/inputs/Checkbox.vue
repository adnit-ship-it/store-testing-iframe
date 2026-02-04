<template>
    <div>
        <label v-if="displayText" :for="question.id" class="block text-base font-medium text-bodyColor mb-2">
            {{ displayText }}
        </label>

        <!-- Single checkbox option -->
        <div class="flex items-center gap-3" v-if="firstOption">
            <label class="checkbox-label cursor-pointer flex items-start gap-3">
                <input type="checkbox" :name="question.id"
                    :value="firstOption" :checked="isChecked(firstOption)" 
                    @change="handleChange(firstOption)" class="sr-only">
                <div class="custom-checkbox-indicator"></div>
                <span class="text-bodyColor text-sm pr-0 md:pr-8">{{ firstOption }}</span>
            </label>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
// --- TYPE DEFINITIONS ---
interface CheckboxQuestion {
    id: string;
    question?: string;
    displayQuestion?: string;
    type: 'CHECKBOX';
    options: string[];
    displayAsRow?: boolean;
    optionImages?: string[];
}

// --- PROPS & EMITS ---
const props = defineProps<{
    question: CheckboxQuestion;
    modelValue: string | string[] | null;
}>();

const emit = defineEmits(['update:modelValue']);

// --- COMPUTED ---
const displayText = computed(() => {
    return props.question.displayQuestion || props.question.question;
});

const firstOption = computed(() => {
    return props.question.options?.[0] || '';
});

// --- METHODS ---
// Checks if the option should be marked as checked
const isChecked = (option: string) => {
    return props.modelValue === option;
};

// Handles checkbox changes (single selection)
const handleChange = (option: string) => {
    // If the clicked option is already selected, deselect it
    if (props.modelValue === option) {
        emit('update:modelValue', null);
    } else {
        // Otherwise, select the option
        emit('update:modelValue', option);
    }
};
</script>

<style scoped>
.checkbox-label {
    @apply relative;
}

.custom-checkbox-indicator {
    @apply min-w-5 min-h-5 border-2 border-bodyColor rounded-full flex items-center justify-center transition-all duration-200;
}

.checkbox-label:has(:checked) .custom-checkbox-indicator {
    @apply border-accentColor1;
}

.checkbox-label:has(:checked) .custom-checkbox-indicator::after {
    content: '';
    @apply w-2.5 h-2.5 bg-accentColor1 rounded-full;
}

.checkbox-label:hover .custom-checkbox-indicator {
    @apply border-accentColor1;
}
</style> 