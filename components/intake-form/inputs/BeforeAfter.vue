<template>
  <div
    class="text-center w-full bg-white flex flex-col items-center gap-8 mt-12 pb-4 md:pb-14 px-4 rounded-[16px] md:rounded-[32px]"
  >
    <div
      class="bg-accentColor1 w-[68px] md:w-[88px] h-[68px] md:h-[88px] rounded-full flex items-center justify-center -mt-[34px] md:-mt-[44px]"
    >
      <img
        src="/assets/images/intake-form/icons/Quotation.svg"
        alt="Quote"
        class="w-[36px] md:w-[48px] h-[36px] md:h-[48px]"
      />
    </div>
    <!-- Quote Display -->
    <div v-if="question.quote" class="mb-2 max-w-[986px] mx-auto">
      <p
        class="text-[20px] md:text-[24px] text-bodyColor font-bold text-center"
      >
        "{{ question.quote }}"
      </p>
    </div>

    <!-- Before/After Images Container -->
    <div class="flex flex-row justify-center items-center gap-6">
      <!-- Before Image -->
      <div class="flex flex-col items-center">
        <img
          v-if="question.beforeImage"
          :src="question.beforeImage"
          alt="Before"
          class="rounded-lg h-[300px] md:h-[420px] object-cover"
        />
      </div>

      <!-- After Image -->
      <div class="flex flex-col items-center">
        <img
          v-if="question.afterImage"
          :src="question.afterImage"
          alt="After"
          class="rounded-lg h-[300px] md:h-[420px] object-cover"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// --- TYPE DEFINITIONS ---
interface BeforeAfterQuestion {
  beforeImage?: string;
  afterImage?: string;
  quote?: string;
}

// --- PROPS ---
defineProps<{
  question: BeforeAfterQuestion;
}>();
</script>
