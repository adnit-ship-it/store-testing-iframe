<template>
  <div class="text-center w-full">
    <img
      v-if="question.image"
      :src="question.image"
      alt="Marketing"
      class="mx-auto mb-4 rounded-lg max-h-[480px] max-w-full object-cover"
    />

    <!-- Statistics Display -->
    <div v-if="question.displayStatistics" class="mt-8 hidden md:block">
      <div class="flex gap-8">
        <!-- Week 1-4 -->
        <div class="flex-1 p-4 justify-start bg-white rounded-lg shadow-sm">
          <div
            class="w-[94px] font-bold text-white uppercase bg-bodyColor flex justify-center items-center rounded-full mb-2"
          >
            WEEK 1-4
          </div>
          <div class="text-bodyColor text-left text-2xl font-medium">
            Your body gets acclimated to GLP-1 medication
          </div>
        </div>

        <!-- Week 4-8 -->
        <div class="flex-1 p-4 justify-start bg-white rounded-lg shadow-sm">
          <div
            class="w-[94px] font-bold text-white uppercase bg-bodyColor flex justify-center items-center rounded-full mb-2"
          >
            WEEK 4-8
          </div>
          <div class="text-bodyColor text-left text-2xl font-medium">
            Weight loss is increasing more and more
          </div>
        </div>

        <!-- Week 9+ -->
        <div class="flex-1 p-4 justify-start bg-white rounded-lg shadow-sm">
          <div
            class="w-[94px] font-bold text-white uppercase bg-bodyColor flex justify-center items-center rounded-full mb-2"
          >
            WEEK 9+
          </div>
          <div class="text-bodyColor text-left text-2xl font-medium">
            Your body has become a fat burning machine
          </div>
        </div>
      </div>
      <p class="w-full text-center text-xl text-bodyColor mt-10">
        We identify the
        <span class="font-bold text-bodyColor">root causes</span> of your
        metabolic issues, so you get a long-term solution,
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
// --- TYPE DEFINITIONS ---
interface MarketingQuestion {
  image?: string;
  question?: string;
  displayStatistics?: boolean;
}

// --- PROPS ---
defineProps<{
  question: MarketingQuestion;
}>();
</script>
