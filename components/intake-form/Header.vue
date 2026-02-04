<template>
  <div class="text-center pt-8">
    <!-- Renders the dynamic headings for the current step's data -->
    <h2 v-if="stepData?.heading1 || stepData?.heading2"
      class="text-2xl md:text-[32px] font-extrabold leading-[24px] md:leading-[34px] font-headingFont">
      <span v-if="stepData.heading1">{{ stepData.heading1 }}</span>
      <br v-if="stepData.heading1 && stepData.heading2 && !stepData.headingsInline">
      <span v-if="stepData.heading2" class="font-headingAlt">{{ stepData.heading2 }}</span>
    </h2>

  </div>
</template>

<script setup lang="ts">
// This component accepts a single prop, 'stepData', which contains
// all the information for the current step, including the headings.
defineProps({
  stepData: {
    type: Object,
    default: () => ({}) // Provide a default empty object to prevent errors on initial render
  }
});
</script>