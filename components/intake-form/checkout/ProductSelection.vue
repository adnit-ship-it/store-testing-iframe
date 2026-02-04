<template>
  <div>
    <!-- Header -->
    <div class="text-center mb-8 md:mb-16">
      <h1 class="text-[24px] md:text-[48px] font-bold text-accentColor1 font-bodyFont leading-[28px] md:leading-[56px]">
        You are almost done! <br />
        <span class="text-bodyColor">Choose your treatment:</span>
      </h1>
    </div>

    <div :class="products.length === 1 ? 'flex flex-col lg:flex-row gap-6' : 'flex flex-col gap-6'">
    <!-- Product Selection Cards -->

      <div>
        <div :class="products.length === 1 ? 'flex justify-center' : 'grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'">
        <div v-for="product in products" :key="product.id" @click="!isSubmitting && selectProduct(product)"
          class="relative bg-white p-4 pt-8 md:p-8 mb-6 cursor-pointer border-2 rounded-xl transition-all duration-200 hover:border-accentColor1 max-h-[600px]"
          :class="[
            products.length === 1 ? 'w-[352px]' : 'w-full',
            selectedProduct?.id === product.id
              ? 'border-accentColor1 shadow-lg'
              : 'border-bodyColor',
            isSubmitting ? 'opacity-50 cursor-not-allowed' : '',
          ]">
          <!-- Radio Button -->
          <div class="absolute top-4 md:top-4 right-4">
            <div class="w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200" :class="selectedProduct?.id === product.id
                ? 'border-accentColor1'
                : 'border-bodyColor'
              ">
              <div v-if="selectedProduct?.id === product.id" class="w-3 h-3 rounded-full bg-accentColor1"></div>
            </div>
          </div>
  
          <!-- Product Info -->
          <div class="flex-1 flex flex-col text-bodyColor font-bodyFont">
            <h3 class="text-2xl md:text-[32px] mb-2 font-bold text-bodyColor font-bodyFont text-center">
              {{ product.name }}
            </h3>
            <p class="text-bodyColor text-sm flex-1 text-center">
              {{ product.description }}
            </p>
  
            <!-- Pricing -->
            <div class="my-4 py-2 md:py-4 border-t border-b">
              <div class="text-4xl md:text-[36px] font-bold text-bodyColor font-headingFont flex flex-col items-center gap-2 justify-center">
                <p>${{ product.prices.monthly }}</p>
              </div>
            </div>
            <!-- Product Image -->
            <div class="w-full h-[264px] rounded-xl flex-shrink-0 overflow-hidden">
              <img :src="product.img" :alt="product.name" class="w-full h-full object-contain" />
            </div>
          </div>
        </div>
      </div>
      </div>
  
      <!-- Step 2 Content -->
      <div v-if="selectedProduct" class="space-y-8">
        <!-- Info Box with Plan Selection -->
        <div class="bg-white rounded-xl p-6 mb-8">
          <h3 class="text-xl font-bold text-accentColor1 font-bodyFont mb-4">
            Choose your plan
          </h3>

          <!-- Plan Selection -->
          <div class="bg-[#FAFAFF] rounded-xl p-9">
            <h3 class="text-xl font-bold text-accentColor1 font-bodyFont mb-6">
              Select billing cycle
            </h3>
  
            <!-- Plan Buttons -->
            <div class="flex flex-col md:flex-row gap-4 mb-8">
              <!-- Monthly Button -->
              <label class="plan-button" :class="{ selected: selectedPlan === 'monthly' }" @click="selectPlan('monthly')">
                <input type="radio" name="plan" value="monthly" class="sr-only" />
                <div class="radio-indicator">
                  <div class="radio-dot"></div>
                </div>
                <div class="flex flex-col">
                  <span class="button-text font-bold">Monthly</span>
                  <span class="text-sm text-bodyColor">${{ selectedProduct?.prices.monthly || 0 }}/mo</span>
                </div>
              </label>
  
              <!-- Semiannual Button -->
              <label class="plan-button" :class="{ selected: selectedPlan === 'semiannually' }"
                @click="selectPlan('semiannually')">
                <input type="radio" name="plan" value="semiannually" class="sr-only" />
                <div class="radio-indicator">
                  <div class="radio-dot"></div>
                </div>
                <div class="flex flex-col">
                  <span class="button-text font-bold">Semiannual</span>
                  <span class="text-sm text-bodyColor">${{ selectedProduct?.prices.semiannually || 0 }}/mo</span>
                  <span class="text-xs text-accentColor1 font-bold">Save $50/month</span>
                </div>
              </label>
            </div>
  
            <!-- Overview Section -->
            <div class="mb-8">
              <h3 class="text-xl font-bold text-accentColor1 font-bodyFont mb-4">
                Here's what's included
              </h3>
              <ul class="space-y-2 text-bodyColor">
                <li class="flex items-start">
                  <img src="/assets/images/checkmark.svg" alt="Check" class="w-5 h-5 mt-0.5 mr-3 flex-shrink-0" />
                  <span>Pre-paid monthly or semiannual billing</span>
                </li>
                <li class="flex items-start">
                  <img src="/assets/images/checkmark.svg" alt="Check" class="w-5 h-5 mt-0.5 mr-3 flex-shrink-0" />
                  <span>Weekly self-administered subcutaneous injections</span>
                </li>
                <li class="flex items-start">
                  <img src="/assets/images/checkmark.svg" alt="Check" class="w-5 h-5 mt-0.5 mr-3 flex-shrink-0" />
                  <span>Price includes consult, medication, supplies, shipping, and
                    support</span>
                </li>
                <li class="flex items-start">
                  <img src="/assets/images/checkmark.svg" alt="Check" class="w-5 h-5 mt-0.5 mr-3 flex-shrink-0" />
                  <span>Cancel or change plans anytime</span>
                </li>
              </ul>
            </div>
  
            <!-- Total Section -->
            <div class="flex justify-between items-center border-t border-b py-4 mb-4">
              <p class="text-lg font-bold text-accentColor1">
                Total if prescribed
              </p>
              <div class="flex items-center gap-2">
                <p class="line-through text-bodyColor text-sm">
                  ${{ selectedProduct?.prices[selectedPlan] || 0 }}
                </p>
                <p class="text-2xl font-bold text-accentColor1">
                  ${{ (selectedProduct?.prices[selectedPlan] || 0) - 100 }}
                </p>
              </div>
            </div>
  
            <!-- Disclaimer -->
            <div class="text-sm md:text-lg text-bodyColor">
              <p class="italic mb-4 -mt-2 text-accentColor1">*Please note: a promo code must be used on the next step for
                the
                discount to be applied.</p>
              <p>
                After checkout, a provider will review your information to
                determine if treatment is right for you.
              </p>
              <p>Prescription is not guaranteed.</p>
            </div>
          </div>
        </div>
  
        <p class="text-center text-bodyColor font-bodyFont text-sm pb-8">
          Important: By clicking 'Continue' below, I agree to the Terms &
          Conditions and Privacy Policies. I understand that if I don't qualify
          based on my provider interaction, I may not be prescribed medication.
          There is an $80 TeleHealth visit cost regardless of whether I receive
          medication.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Product } from "~/types/intake-form/checkout";

interface Props {
  selectedProduct: Product | null;
  selectedPlan: "monthly" | "semiannually";
  isSubmitting?: boolean;
  formAnswers?: any;
  products: Product[];
}

interface Emits {
  (e: "select-product", product: Product): void;
  (e: "select-plan", plan: "monthly" | "semiannually"): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const selectProduct = (product: Product) => {
  emit("select-product", product);
};

const selectPlan = (plan: "monthly" | "semiannually") => {
  emit("select-plan", plan);
};
</script>

<style scoped>
.plan-button {
  @apply flex items-center gap-3 px-4 py-3 bg-white border border-gray-200 rounded-[10px] cursor-pointer transition-all duration-200 hover:border-accentColor1-50 flex-1 relative;
}

.plan-button.selected {
  @apply border-accentColor1 bg-white shadow-lg;
}

.radio-indicator {
  @apply w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center flex-shrink-0;
}

.plan-button.selected .radio-indicator {
  @apply border-accentColor1;
}

.radio-dot {
  @apply w-2.5 h-2.5 rounded-full;
}

.plan-button.selected .radio-dot {
  @apply bg-accentColor1;
}

.button-text {
  @apply text-accentColor1;
}
</style>
