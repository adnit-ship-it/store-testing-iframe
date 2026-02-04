<template>
  <div>
    <label
      v-if="question.question"
      class="block text-base font-medium text-accentColor2 mb-2"
    >
      {{ question.question }}
      <span v-if="question.required" class="text-red-500">*</span>
    </label>

    <!-- Loading state -->
    <div v-if="initializing" class="text-sm text-gray-600 mb-4">
      <div>Setting up payment...</div>
    </div>

    <!-- Error message -->
    <div v-if="error" class="text-sm text-red-600 mb-4">
      {{ error }}
    </div>

    <!-- Stripe Elements Container -->
    <div class="space-y-6">
      <!-- Address Element -->
      <div>
        <label class="block text-lg font-medium text-accentColor1 mb-2">
          Shipping Address
        </label>
        <div
          id="element-address"
          class="form-input min-h-[60px] py-6 flex items-center stripe-element"
          :class="{ interacted: hasInteracted }"
        >
          <span class="text-gray-500">Loading address field...</span>
        </div>
      </div>

      <!-- Payment Element -->
      <div>
        <label class="block text-lg font-medium text-accentColor1 mb-2">
          Payment Method
        </label>
        <div
          id="element-payment"
          class="form-input min-h-[60px] py-6 flex items-center stripe-element"
          :class="{ interacted: hasInteracted }"
        >
          <span class="text-gray-500">Loading payment field...</span>
        </div>
        <!-- Payment Error Display -->
        <div v-if="paymentError" class="text-sm text-red-600 mt-2">
          {{ paymentError }}
        </div>
      </div>
    </div>

    <!-- Security notice -->
    <div class="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
      <p class="text-sm text-blue-800">
        <strong>Security Notice:</strong> For your security, payment information
        is not saved when you navigate away from this page. You'll need to
        re-enter your payment details if you go back to previous steps.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, nextTick, watch } from "vue";
import { useStripe } from "~/composables/intake-form/useStripe";

// --- TYPE DEFINITIONS ---
interface StripePaymentQuestion {
  id: string;
  question?: string;
  required?: boolean;
}

interface AddressInfo {
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

// --- TEST CARD DETECTION ---
const TEST_CARD_PATTERNS = [
  /^4242424242424242$/, // Visa test card
  /^4000056655665556$/, // Visa debit test card
  /^5555555555554444$/, // Mastercard test card
  /^2223003122003222$/, // Mastercard test card
  /^4000002500003155$/, // Visa test card (requires authentication)
  /^4000000000000002$/, // Visa test card (declined)
  /^4000000000009995$/, // Visa test card (declined)
  /^4000000000009987$/, // Visa test card (declined)
  /^4000000000009979$/, // Visa test card (declined)
  /^4000000000000069$/, // Visa test card (expired)
  /^4000000000000127$/, // Visa test card (incorrect CVC)
  /^4000000000000119$/, // Visa test card (processing error)
];

const isTestCard = (cardNumber: string): boolean => {
  const cleanNumber = cardNumber.replace(/\s/g, "");
  return TEST_CARD_PATTERNS.some((pattern) => pattern.test(cleanNumber));
};

const detectTestCardFromElements = (elements: any): boolean => {
  try {
    // Try to get the card number from the payment element
    const paymentElement = elements.getElement("payment");
    if (paymentElement) {
      // This is a simplified approach - in practice, we'll need to listen for card number changes
      return false; // We'll handle this in the change event
    }
  } catch (error) {
    // Silent fail - we'll handle detection in the change event
  }
  return false;
};

// --- STATE ---
const initializing = ref(true);
const error = ref<string | null>(null);
const paymentError = ref<string | null>(null);
const hasInteracted = ref(false);
const isPaymentComplete = ref(false);
const isAddressComplete = ref(false);
const shippingAddress = ref<AddressInfo | null>(null);
const stripeRef = ref<any>(null);
const stripeElementsRef = ref<any>(null);
const isMounted = ref(true);

// --- PROPS ---
const props = defineProps<{
  question: StripePaymentQuestion;
  modelValue?: {
    stripeSetupId: string | null;
    shippingAddress: AddressInfo | null;
  };
  formAnswers?: any;
}>();

// --- EMITS ---
const emit = defineEmits<{
  "update:modelValue": [
    value: {
      stripeSetupId: string | null;
      shippingAddress: AddressInfo | null;
    },
  ];
}>();

// --- COMPUTED ---
const getFullName = () => {
  const firstName = props.formAnswers?.firstName || "";
  const lastName = props.formAnswers?.lastName || "";
  return `${firstName} ${lastName}`.trim();
};

const canFinish = computed(() => {
  return isAddressComplete.value && isPaymentComplete.value;
});

const showValidationMessage = computed(() => {
  return (
    hasInteracted.value &&
    (!isAddressComplete.value || !isPaymentComplete.value)
  );
});

// --- STRIPE CONFIRMATION HANDLER ---
const handleStripeConfirm = async (event: CustomEvent) => {
  try {
    const result = await performPayment();

    if (result) {
      // Update the form data with the confirmed SetupIntent ID
      emit("update:modelValue", {
        stripeSetupId: result.stripePaymentId,
        shippingAddress: result.shippingAddress,
      });

      // Dispatch success event to trigger form submission
      const successEvent = new CustomEvent("stripe-confirmation-success", {
        detail: { setupIntent: { id: result.stripePaymentId } },
      });
      window.dispatchEvent(successEvent);
    }
  } catch (error: any) {
    console.error("Stripe confirmation error:", error);

    // Show specific error message
    const errorMessage = error.message || "Payment failed. Please try again.";

    // Show error to user
    if (process.client) {
      const { useToast } = await import("vue-toastification");
      const toast = useToast();
      toast.error(errorMessage);
    }

    // Reset loading state by emitting null value
    emit("update:modelValue", {
      stripeSetupId: null,
      shippingAddress: null,
    });

    // Dispatch error event to reset loading state in parent
    const errorEvent = new CustomEvent("stripe-confirmation-error", {
      detail: { error: errorMessage },
    });
    window.dispatchEvent(errorEvent);
  }
};

// --- METHODS ---
const performPayment = async () => {
  const elements = stripeElementsRef.value;
  const shippingAddr = shippingAddress.value;

  if (!stripeRef.value || !elements) {
    throw new Error("Payment system not initialized");
  }

  // Final test card check before submission
  if (process.env.NODE_ENV === "production") {
    try {
      const paymentElement = elements.getElement("payment");
      if (paymentElement) {
        const paymentMethod = await paymentElement.getValue();
        // Only check for test cards if the payment method is a card
        if (paymentMethod?.type === "card") {
          const cardNumber = paymentMethod.card?.number;
          if (cardNumber && isTestCard(cardNumber)) {
            throw new Error(
              "Test cards are not allowed in production. Please use a real credit card.",
            );
          }
        }
      }
    } catch (error) {
      // If we can't check the card number, continue with the payment
      // The error will be caught by Stripe if it's a test card
    }
  }

  try {
    const result = await stripeRef.value.confirmSetup({
      elements: elements,
      redirect: "if_required",
      confirmParams: {
        payment_method_data: {
          billing_details: {
            email: props.formAnswers?.email,
          },
        },
      },
    });

    const error = result?.error;
    if (error) {
      if (error.type === "validation_error") {
        // do nothing, validation errors are handled by stripe elements UI
        return null;
      } else {
        // Handle specific error types
        let errorMessage = "Payment failed. Please try again.";

        if (
          error.message?.includes("test card") ||
          error.message?.includes("live mode")
        ) {
          errorMessage =
            "Test cards are not allowed in production. Please use a real credit card.";
        } else if (error.message?.includes("declined")) {
          errorMessage =
            "Your card was declined. Please check your card details and try again.";
        } else if (error.message?.includes("expired")) {
          errorMessage = "Your card has expired. Please use a different card.";
        } else if (error.message?.includes("CVC")) {
          errorMessage = "Invalid CVC code. Please check and try again.";
        } else if (error.message) {
          errorMessage = error.message;
        }

        throw new Error(errorMessage);
      }
    } else {
      const setupIntent = result?.setupIntent;
      if (setupIntent && setupIntent.status === "succeeded") {
        return {
          stripePaymentId: setupIntent.id,
          shippingAddress: shippingAddr,
        };
      } else {
        throw new Error("Payment was not successful. Please try again.");
      }
    }
  } catch (err: any) {
    console.error("Payment confirmation error:", err);

    // Show specific error message
    const errorMessage = err.message || "Payment failed. Please try again.";

    // Show error to user
    if (process.client) {
      const { useToast } = await import("vue-toastification");
      const toast = useToast();
      toast.error(errorMessage);
    }
    throw err;
  }

  return undefined;
};

// Expose the payment method
defineExpose({
  performPayment,
});

// --- LIFECYCLE ---
onMounted(async () => {
  if (!process.client) return;

  isMounted.value = true;
  initializing.value = true;
  error.value = null;

  try {
    // Use the Stripe composable instead of initializing directly
    const { stripe, elements, isReady } = useStripe();
    
    // Wait for Stripe to be ready
    if (!isReady.value) {
      // If not ready, wait for it to become ready
      const unwatch = watch(isReady, (ready) => {
        if (ready && isMounted.value) {
          unwatch(); // Stop watching
          initializeElements();
        }
      });
      return;
    }
    
    // If already ready, initialize elements immediately
    await initializeElements();
    
  } catch (err: any) {
    console.error("Error initializing Stripe:", err);

    // Only show error if component is still mounted
    if (isMounted.value && initializing.value) {
      const errorMessage = err.message || "Stripe error";
      error.value = errorMessage;

      // Show error to user only if component is still mounted
      if (process.client && isMounted.value) {
        const { useToast } = await import("vue-toastification");
        const toast = useToast();
        toast.error(errorMessage);
      }
    }
  } finally {
    if (isMounted.value) {
      initializing.value = false;
    }
  }
});

// Watch for client secret changes to re-initialize elements when SetupIntent is refreshed
const { clientSecret } = useStripe();
watch(
  () => clientSecret.value,
  async (newClientSecret, oldClientSecret) => {
    // Only re-initialize if client secret actually changed and component is mounted
    if (newClientSecret && newClientSecret !== oldClientSecret && isMounted.value) {
      initializing.value = true;
      try {
        await initializeElements();
      } catch (err) {
        console.error("Error re-initializing elements:", err);
        error.value = "Failed to refresh payment form";
      } finally {
        initializing.value = false;
      }
    }
  }
);

// Helper function to initialize Stripe elements
const initializeElements = async () => {
  if (!isMounted.value) return;
  
  const { stripe, elements } = useStripe();
  
  if (!stripe.value || !elements.value) {
    throw new Error("Stripe not properly initialized");
  }

  // Create Payment Element
  const paymentElement = elements.value.create("payment", {
    defaultValues: {
      billingDetails: {
        email: props.formAnswers?.email,
        name: getFullName(),
      },
    },
  });

  // Create Address Element
  const addressElement = elements.value.create("address", {
    mode: "shipping",
    allowedCountries: ["US"],
    defaultValues: {
      name: getFullName(),
    },
  });

  // Helper function to check if both elements are complete and emit model value
  const updateFormValidity = () => {
    if (!isMounted.value) return;

    if (
      isPaymentComplete.value &&
      isAddressComplete.value &&
      shippingAddress.value
    ) {
      emit("update:modelValue", {
        stripeSetupId: "ready",
        shippingAddress: shippingAddress.value,
      });
    } else {
      emit("update:modelValue", {
        stripeSetupId: null,
        shippingAddress: null,
      });
    }
  };

  // Set up address element event listener
  addressElement.on("change", (e: any) => {
    if (!isMounted.value) return;

    hasInteracted.value = true;
    isAddressComplete.value = e.complete;

    const addr = e.value?.address;
    if (e.complete && addr) {
      shippingAddress.value = {
        addressLine1: addr.line1 || "",
        addressLine2: addr.line2 || "",
        city: addr.city || "",
        state: addr.state || "",
        country: addr.country || "US",
        postalCode: addr.postal_code || "",
      };
    } else {
      shippingAddress.value = null;
    }

    // Update form validity based on both elements
    updateFormValidity();
  });

  // Set up payment element event listener
  paymentElement.on("change", (e: any) => {
    if (!isMounted.value) return;

    hasInteracted.value = true;
    isPaymentComplete.value = e.complete;
    paymentError.value = e.error ? e.error.message : null;

    // Test card detection - only check for cards, not other payment methods
    if (e.complete && process.env.NODE_ENV === "production") {
      try {
        // Only check for test cards if the payment method is a card
        const paymentMethod = e.value?.paymentMethod;
        if (paymentMethod?.type === "card") {
          const cardNumber = paymentMethod.card?.number;
          if (cardNumber && isTestCard(cardNumber)) {
            paymentError.value =
              "Test cards are not allowed in production. Please use a real credit card.";
            isPaymentComplete.value = false;
            return;
          }
        }
      } catch (error) {
        // Silent fail - continue with normal validation
      }
    }

    // Update form validity based on both elements
    updateFormValidity();
  });

  // Wait for DOM to be ready before mounting
  await nextTick();

  // Check if component is still mounted and elements exist
  if (!isMounted.value) {
    return;
  }

  const paymentElementContainer = document.getElementById("element-payment");
  const addressElementContainer = document.getElementById("element-address");

  if (!paymentElementContainer || !addressElementContainer) {
    throw new Error("Payment elements not found in DOM");
  }

  // Mount elements
  paymentElement.mount("#element-payment");
  addressElement.mount("#element-address");

  // Store references only if still mounted
  if (isMounted.value) {
    stripeRef.value = stripe.value;
    stripeElementsRef.value = elements.value;

    // Listen for stripe confirmation event
    window.addEventListener(
      "stripe-confirm-setup",
      handleStripeConfirm as unknown as EventListener,
    );
  }
};

// Clean up on component unmount
onUnmounted(() => {
  isMounted.value = false;

  if (stripeElementsRef.value) {
    try {
      const addressElement = stripeElementsRef.value.getElement("address");
      const paymentElement = stripeElementsRef.value.getElement("payment");

      if (addressElement) {
        addressElement.destroy();
      }
      if (paymentElement) {
        paymentElement.destroy();
      }
    } catch (error) {
      // Silent cleanup error
    }
  }

  window.removeEventListener(
    "stripe-confirm-setup",
    handleStripeConfirm as unknown as EventListener,
  );
});
</script>

<style scoped>
.form-input {
  @apply block rounded-[10px] w-full border border-gray-200 bg-gray-50 px-4 appearance-none focus:outline-none focus:ring-2 focus:ring-accentColor1 transition-colors duration-200;
}

/* Hide Stripe validation messages until user has interacted */
:deep(.stripe-element) {
  --stripe-validation-opacity: 0;
  transition: opacity 0.3s ease;
}

:deep(.stripe-element.interacted) {
  --stripe-validation-opacity: 1;
}

/* Target Stripe's error messages */
:deep(.stripe-element [data-testid="error-message"]) {
  opacity: var(--stripe-validation-opacity);
}

/* Alternative approach: hide all error messages initially */
:deep(.stripe-element .error) {
  opacity: 0;
  transition: opacity 0.3s ease;
}

:deep(.stripe-element.interacted .error) {
  opacity: 1;
}
</style>
