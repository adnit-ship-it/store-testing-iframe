<template>
  <div class="flex items-center bg-backgroundColor justify-center min-h-[96vh] pt-[83px] lg:pt-[68px]">
    <div class="max-w-lg w-full bg-white shadow-lg p-8 text-center rounded-2xl">
      <div class="mb-6">
        <div
          class="w-16 h-16 bg-backgroundColor rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <svg
            class="w-8 h-8 text-accentColor1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7"
            ></path>
          </svg>
        </div>
        <h1 class="text-2xl font-bold text-accentColor1 mb-2">Welcome!</h1>
        <p class="text-bodyColor text-[18px]">
          Your payment has been successfully processed.
        </p>
      </div>

      <div class="space-y-4">
        <p class="text-bodyColor">
          Thank you for completing your medical intake form. We'll be in touch soon with next steps.
        </p>

        <!-- Reference Information -->
        <div
          v-if="$route.query.caseId || $route.query.formResponseId"
          class="bg-gray-50 p-4 text-left"
        >
          <h3 class="text-sm font-medium text-gray-700 mb-2">
            Reference Information
          </h3>
          <div class="space-y-1 text-xs text-gray-600">
            <div v-if="$route.query.caseId">
              <span class="font-medium">Case ID:</span>
              {{ $route.query.caseId }}
            </div>
            <div v-if="$route.query.formResponseId">
              <span class="font-medium">Form Response ID:</span>
              {{ $route.query.formResponseId }}
            </div>
          </div>
        </div>

        <UiButton
          @click="goHome"
          background-color="accentColor1"
          text-color="white"
          width="full"
          height="48px"
          font-size="16"
        >
          Return to Home
        </UiButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { usePagesStore } from '~/stores/pagesStore'

definePageMeta({
  layout: "default",
});

const router = useRouter();
const pagesStore = usePagesStore();
const common = computed(() => pagesStore.pages?.common);

const goHome = () => {
  router.push("/");
};
</script>
