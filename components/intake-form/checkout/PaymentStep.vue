<template>
  <div class="relative">
    <!-- Processing Overlay -->
    <div
      v-if="props.isSubmitting"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-xl p-4 md:p-8 max-w-md mx-4 text-center">
        <div
          class="animate-spin rounded-full h-12 w-12 border-b-2 border-accentColor1 mx-auto mb-4"
        ></div>
        <h3 class="text-xl font-bold text-accentColor1 mb-2">
          Processing Payment
        </h3>
        <p class="text-bodyColor">
          Please wait while we process your payment...
        </p>
      </div>
    </div>

    <!-- Header -->
    <div class="text-center mb-8 md:mb-16">
      <h1
        class="text-[24px] md:text-[48px] font-bold text-accentColor1 font-bodyFont leading-[28px] md:leading-[56px]"
      >
        If prescribed <br />
        <span class="text-bodyColor"
          >where would you like us to send <br class="hidden md:block" />
          your treatment {{ firstName }}?</span
        >
      </h1>
    </div>

    <!-- Payment Form -->
    <div class="bg-white rounded-[16px] p-4 md:p-8 mb-8">
      <StripePayment
        ref="stripePaymentRef"
        v-if="isStripeLoaded"
        :question="{ id: 'stripePayment', required: true }"
        :model-value="paymentData"
        :form-answers="formAnswers"
        @update:model-value="handlePaymentUpdate"
      />
      <div v-else class="text-center py-8">
        <div class="text-gray-500">Loading payment form...</div>
      </div>
    </div>

    <!-- Contact Information -->
    <div class="bg-white rounded-[16px] p-8 mb-8 font-bodyFont">
      <h3 class="text-2xl font-bold text-accentColor1 mb-6">
        Promo Code
      </h3>
      
      <!-- Promo Code Input -->
      <div>
        <label
          for="promoCode"
          class="block text-sm font-medium text-bodyColor mb-2"
        >
          Promo Code (Optional)
        </label>
        <input
          id="promoCode"
          type="text"
          :value="promoCode"
          @input="updatePromoCode"
          :disabled="props.isSubmitting"
          class="w-full px-4 py-3 border border-gray-300 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          placeholder="Enter promo code if you have one"
        />
      </div>
    </div>

    <div class="bg-white rounded-[16px] p-8 mb-8 font-bodyFont flex gap-2">
      <div class="flex-1">
        <h3 class="text-2xl font-bold text-accentColor1 mb-6">
          Powered by Care Validate
        </h3>
        <p>
          To ensure the highest level of care, we've partnered with Care
          Validate for certain aspects of your experience. You may see their
          name on payment statements or portals, but rest assured,
          OnlineSemaglutide remains your primary service provider.
        </p>
      </div>
      <img src="/assets/images/carevalidate.png" alt="Care Validate" class="h-[36px]" />
    </div>
    <p class="text-center">
      Important: By clicking 'Submit to provider' you agree that:
    </p>
    <p class="text-sm md:text-base text-center mt-4 mb-8">
      By providing your card information, you allow CAREVALIDATE to charge your
      card for future payments in accordance with their terms. To ensure
      continuity of treatment your subscription will renew and you will be
      charged approximately 4 weeks after each shipment until you cancel. Your
      monthly charge may fluctuate with medication and/or dosing changes. Your
      subscription will auto renew unless you cancel at least 3 days before the
      next renewal date. You may cancel your subscription by contacting customer
      support at Support@NewBodyRx.com. Any cancellation will take effect at the
      end of the current subscription period. You will not be able to cancel
      your first shipment. You will be charged $80 for your initial TeleHealth
      visit if you do not qualify for medication and no subscription will apply.
      If you select a semiannual plan your subscription is for renewing terms of
      90 days.
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from "vue";
import type { Product } from "~/types/intake-form/checkout";
import StripePayment from "~/components/intake-form/inputs/StripePayment.vue";

interface AddressInfo {
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

interface Props {
  selectedProduct: Product | null;
  selectedPlan: "monthly" | "semiannually";
  paymentData:
    | { stripeSetupId: string | null; shippingAddress: AddressInfo | null }
    | undefined;
  isStripeLoaded: boolean;
  formAnswers: any;
  isSubmitting?: boolean;
}

interface Emits {
  (
    e: "payment-update",
    data:
      | { stripeSetupId: string | null; shippingAddress: AddressInfo | null }
      | null
      | undefined,
  ): void;
  (
    e: "contact-update",
    data: { promoCode: string },
  ): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const stripePaymentRef = ref();

// Promo code state
const promoCode = ref("");

// Computed property to get the dynamic price based on selected product and plan
const dynamicPrice = computed(() => {
  if (!props.selectedProduct) return 0;

  return (
    props.selectedProduct.prices[props.selectedPlan] ||
    props.selectedProduct.prices.monthly
  );
});

// Computed property to get firstName from form answers
const firstName = computed(() => {
  return props.formAnswers?.firstName || "";
});

// Update functions
const updatePromoCode = (event: Event) => {
  const target = event.target as HTMLInputElement;
  promoCode.value = target.value;
  emitContactUpdate();
};

// Helper function to emit contact updates
const emitContactUpdate = () => {
  emit("contact-update", {
    promoCode: promoCode.value,
  });
};

// Initialize on component mount
onMounted(() => {
  nextTick(() => {
    // Initialize promo code if needed
  });
});

const handlePaymentUpdate = (
  data:
    | { stripeSetupId: string | null; shippingAddress: AddressInfo | null }
    | null
    | undefined,
) => {
  emit("payment-update", data);
};

// Expose the payment ref for parent component
defineExpose({
  stripePaymentRef,
  promoCode,
});
</script>

